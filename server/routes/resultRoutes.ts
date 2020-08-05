import express from 'express';

import {getResults} from '../controllers/result';

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
