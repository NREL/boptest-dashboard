import {SignatureDetails} from './../../common/interfaces';
import express from 'express';

import {
  getAllResultsForUser,
  getAllSharedResults,
  getSignatureDetailsForResult,
  createResults,
  toggleShared
} from '../controllers/result';

export const resultRouter = express.Router();
const TESTING: boolean = process.env.CONTEXT! === 'testing';

resultRouter.get('/', (req: express.Request, res: express.Response) => {
  getAllSharedResults()
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log('Unable to get results' + err));
});

resultRouter.get('/my-results', (req: express.Request, res: express.Response) => {
  console.log('Getting my-results, session info:', req.session ? 'exists' : 'missing');
  console.log('Session user ID:', req.session?.userId);
  console.log('Headers:', req.headers);
  
  // Try to get user ID from multiple sources
  let userId: string | null = null;
  
  // 1. First priority: Session
  if (req.session && req.session.userId) {
    userId = req.session.userId;
    console.log('Using user ID from session:', userId);
  } 
  // 2. Second priority: X-User-ID header
  else if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'] as string;
    console.log('Using user ID from header:', userId);
  }
  // 3. Third priority: auth_user cookie via header
  else if (req.headers.cookie) {
    try {
      const cookies = req.headers.cookie.split(';');
      const authUserCookie = cookies.find(cookie => cookie.trim().startsWith('auth_user='));
      
      if (authUserCookie) {
        const cookieValue = authUserCookie.split('=')[1];
        if (cookieValue) {
          const decodedValue = decodeURIComponent(cookieValue);
          const authUserData = JSON.parse(decodedValue);
          
          if (authUserData && authUserData.userId) {
            userId = String(authUserData.userId);
            console.log('Using user ID from auth_user cookie:', userId);
          }
        }
      }
    } catch (e) {
      console.error('Error parsing auth_user cookie from header:', e);
    }
  }
  
  // If we have a user ID from any source, proceed
  if (userId) {
    console.log('Getting results for user ID:', userId);
    
    getAllResultsForUser(userId)
      .then(results => {
        console.log(`Found ${results.length} results for user ID ${userId}`);
        res.json(results);
      })
      .catch(err => {
        console.log(`Unable to get results for user ID ${userId}`, err);
        res.status(500).json({ error: 'Failed to retrieve results' });
      });
  } else {
    console.log('No user ID found in any source for /my-results endpoint');
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// This endpoint is going to be hit a lot if the user is clicking into
// the detail view of results in the results table.
// A future optimization could be to use memcached with the values of
// the signature so that we don't have to query the table as much.
resultRouter.get(
  '/:id/signature',
  (req: express.Request, res: express.Response) => {
    getSignatureDetailsForResult(req.params.id)
      .then((result: SignatureDetails) => {
        res.json(result);
      })
      .catch(err => console.log('Unable to get signature for result', err));
  }
);

resultRouter.post('/', (req: express.Request, res: express.Response) => {
  createResults(req.body.results)
    .then((responses: any) => {
      const fulfilled = responses.filter((response: any) => response.status === 'fulfilled').map((response: any) => response.value);
      const rejected = responses.filter((response: any) => response.status === 'rejected').map((response: any) => response.reason);
      rejected.length <= 0 ? res.status(200) : res.status(400);
      res.send({ fulfilled: fulfilled, rejected: rejected });
    })
    .catch(err => res.status(500).json(err));
});

/*
Not Implemented for the time being
Will be a DELETE request
*/
// resultRouter.post('/remove', (req: express.Request, res: express.Response) => {
//   Promise.all(removeResults(req.body.resultIds))
//     .then(() => {
//       res.sendStatus(200);
//     })
//     .catch(err => res.status(500).send('Unable to remove entities: ' + err));
// });

resultRouter.patch('/share', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.userId) {
    const userId = Number(req.session.userId);
    
    toggleShared(req.body.id, req.body.share, userId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});