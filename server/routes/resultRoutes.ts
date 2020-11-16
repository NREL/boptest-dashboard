import {SignatureDetails} from './../../common/interfaces';
import express from 'express';

import {
  getAllResultsForUser,
  getAllSharedResults,
  getSignatureDetailsForResult,
  createResults,
  removeResults,
  shareResults,
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

resultRouter.get('/:email', (req: express.Request, res: express.Response) => {
  let email: string = '';
  if(TESTING) {
    email = req.params.email;
  } else if (req.session != undefined) {
    email = req.session.email;
  }
  getAllResultsForUser(email)
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log(`Unable to get results for user ${req.params.email}`, err));
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
    .catch(err => res.status(500).send('Unable to create entities: ' + err));
});

resultRouter.post('/remove', (req: express.Request, res: express.Response) => {
  // remove all these results from the db. Probs getting a list of ids.
  // (potentially full results tho)

  Promise.all(removeResults(req.body.resultIds))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => res.status(500).send('Unable to remove entities: ' + err));
});

resultRouter.post('/share', (req: express.Request, res: express.Response) => {
  // share all these, potentially a list of full results, or maybe just ids
  Promise.all(shareResults(req.body.results))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err =>
      res.status(500).send('Unable to update shared value of entities: ' + err)
    );
});
