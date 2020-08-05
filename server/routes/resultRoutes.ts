import express from 'express';

import {getResults, createEntities} from '../controllers/result';

export const resultRouter = express.Router();

resultRouter.get('/', (req: express.Request, res: express.Response) => {
  getResults()
    .then(results => {
      console.log('get account for result');
      console.log(results[0].account);
      res.json(results);
    })
    .catch(err => console.log('Unable to get results' + err));
});

resultRouter.post('/', (req: express.Request, res: express.Response) => {
  createEntities(req.body.results)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => res.status(500).send('Unable to create entities: ' + err));
});
