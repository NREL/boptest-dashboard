import express from 'express';

import {
  getAllSharedResults,
  createResults,
  removeResults,
  shareResults,
} from '../controllers/result';

export const resultRouter = express.Router();

resultRouter.get('/', (req: express.Request, res: express.Response) => {
  getAllSharedResults()
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log('Unable to get results' + err));
});

resultRouter.post('/', (req: express.Request, res: express.Response) => {
  createResults(req.body.results)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => res.status(500).send('Unable to create entities: ' + err));
});

resultRouter.post('/remove', (req: express.Request, res: express.Response) => {
  // remove all these results from the db. Probs getting a list of uids.
  Promise.all(removeResults(req.body.resultUids))
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
