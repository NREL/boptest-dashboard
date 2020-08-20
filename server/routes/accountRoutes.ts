import express from 'express';

import {getAccounts} from '../controllers/account';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getAccounts()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});

// GET /api/accounts/dummy
accountRouter.get('/dummy', (req: express.Request, res: express.Response) => {
  res.send('Hello world');
});
