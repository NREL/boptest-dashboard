import express from 'express';

import {getAccounts} from '../controllers/account';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getAccounts()
    .then(accounts => {
      console.log('get results');
      console.log(accounts[0].results);
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});
