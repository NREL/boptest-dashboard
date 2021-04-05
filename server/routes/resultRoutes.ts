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
  if (req.session) {
    getAllResultsForUser(req.session.email)
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log(`Unable to get results for user ${req.params.email}`, err));
  }
});
// this endpoint is going to be hit a lot if the user is cicking into
// the detail view of results in the results table.
// I'd suggest a future optimization of memcached with the values of
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
    .then(() => {
      res.sendStatus(200);
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

resultRouter.patch('/share',  (req: express.Request, res: express.Response) => {
  toggleShared(req.body.id, req.body.share, Number(req!.session!.userId))
    .then(() => {
      res.send(200);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});