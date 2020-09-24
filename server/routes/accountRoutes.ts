import express from 'express';

import {getAccounts} from '../controllers/account';
import {updateName} from '../models/Account';

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

accountRouter.post('/name', (req: express.Request, res: express.Response) => {
  updateName(req.body.id, req.body.name)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err =>
      res.status(500).send('Unable to update name of account: ' + err)
    );
});
