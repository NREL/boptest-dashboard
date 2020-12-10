import express from 'express';

import {getAccount, getAccounts} from '../controllers/account';
import {Account} from '../../common/interfaces';
import {getAccountByApiKey, updateName, updateGlobalShare} from '../models/Account';

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

accountRouter.patch('/name', (req: express.Request, res: express.Response) => {
  updateName(req!.session!.userId, req.body.newName)
    .then(() => {
      req!.session!.name = req.body.newName;
      res.sendStatus(200)
    })
    .catch(err => res.status(500).json(err));
});

accountRouter.patch('/global-share', (req: express.Request, res: express.Response) => {
  updateGlobalShare(req!.session!.userId, req.body.globalShare)
  .then(() => {
    req!.session!.globalShare = req.body.globalShare;
    res.sendStatus(200)
  })
  .catch(err => res.status(500).json(err));
  // console.log(req.body.globalShare);
  // res.json(req.body.globalShare);
});