import express from 'express';

import {getAccount, getAccounts} from '../controllers/account';
import {Account} from '../../common/interfaces';
import {getAccountByApiKey, updateName} from '../models/Account';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getAccounts()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});

// check if an apiKey is valid
accountRouter.get(
  '/apiKey/:key',
  (req: express.Request, res: express.Response) => {
    getAccountByApiKey(req.params.key)
      .then((account: Account) => {
        res.json({email: account.email});
      })
      .catch(() => {
        res.status(404).send(`API key ${req.params.key} doesn't exist`);
      });
  }
);

// GET /api/accounts/dummy
accountRouter.get('/dummy', (req: express.Request, res: express.Response) => {
  res.send('Hello world');
});

// gets an account
accountRouter.get('/:id', (req: express.Request, res: express.Response) => {
  getAccount(Number(req.params.id))
    .then(account => res.json(account))
    .catch(err => {
      console.log(`Unable to get account ${req.params.id}`, err);
      res.status(500).send('Unable to get account.');
    });
});

accountRouter.patch('/name', (req: express.Request, res: express.Response) => {
  updateName(req.body.userId, req.body.newName)
    .then(() => {
      if (req.session) { req.session.name = req.body.newName; }
      res.sendStatus(200)
    })
    .catch(err => res.status(500).json(err));
});