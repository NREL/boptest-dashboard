import {SignatureDetails, Account} from './../../common/interfaces';
import express from 'express';

import {
  getAllResultsForUser,
  getAllSharedResults,
  getSharedResultByUid,
  getSignatureDetailsForResult,
  createResults,
  toggleShared,
} from '../controllers/result';
import {listResultFacets} from '../models/ResultFacet';
import {authorizer} from './authRoutes';
import {validateSessionCsrf} from '../utils/security';

type PrivilegedAccount = Account & {
  privileged?: boolean;
};

export const resultRouter = express.Router();

resultRouter.get('/', (req: express.Request, res: express.Response) => {
  getAllSharedResults()
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log('Unable to get results' + err));
});

resultRouter.get('/my-results', authorizer, (req: express.Request, res: express.Response) => {
  const user = req.user as PrivilegedAccount | undefined;
  if (!user) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  getAllResultsForUser(user.id.toString())
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(`Unable to get results for user ID ${user.id}`, err);
      res.status(500).json({error: 'Failed to retrieve results'});
    });
});

resultRouter.get('/facets', (req: express.Request, res: express.Response) => {
  listResultFacets()
    .then(facets => res.json(facets))
    .catch(err => {
      console.error('Unable to list result facets', err);
      res.status(500).json({error: 'Failed to load result facets'});
    });
});

resultRouter.get('/uid/:uid', async (req: express.Request, res: express.Response) => {
  try {
    const result = await getSharedResultByUid(req.params.uid);
    if (!result) {
      res.status(404).json({error: 'Result not found'});
      return;
    }
    res.json(result);
  } catch (err) {
    console.error(`Unable to get result ${req.params.uid}`, err);
    res.status(500).json({error: 'Failed to load result'});
  }
});

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
      const fulfilled = responses
        .filter((response: any) => response.status === 'fulfilled')
        .map((response: any) => response.value);
      const rejected = responses
        .filter((response: any) => response.status === 'rejected')
        .map((response: any) => response.reason);
      const status = rejected.length <= 0 ? 200 : 400;
      res.status(status).send({fulfilled, rejected});
    })
    .catch(err => res.status(500).json(err));
});

resultRouter.patch('/share', authorizer, (req: express.Request, res: express.Response) => {
  const user = req.user as PrivilegedAccount | undefined;
  if (!user) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  if (!validateSessionCsrf(req, res)) {
    return;
  }

  toggleShared(req.body.id, req.body.share, user.id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
