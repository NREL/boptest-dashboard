import express from 'express';

import {updateName, updateGlobalShare} from '../models/Account';
import {getAccountById, getAccountByEmail, getAPIKeyByEmail} from '../controllers/account';
import {authorizer} from './authRoutes';
import {
  Account,
} from './../../common/interfaces';

export const accountRouter = express.Router();
accountRouter.use(authorizer);

accountRouter.patch('/name', (req: express.Request, res: express.Response) => {
  updateName(req.user.id, req.body.newName)
    .then(() => {
      if (req.session) {
        req.session.name = req.body.newName;
      }
      res.sendStatus(200)
    })
    .catch(err => res.status(500).json(err));
});

accountRouter.patch('/global-share', (req: express.Request, res: express.Response) => {
  updateGlobalShare(req.user.id, req.body.globalShare)
    .then(() => {
      if (req.session) {
        req.session.globalShare = req.body.globalShare;
      }
      res.sendStatus(200)
    })
    .catch(err => res.status(500).json(err));
});

accountRouter.get('/info', (req: express.Request, res: express.Response) => {
  const response = {
    name: req.user.name,
    sub: req.user.sub,
    email: req.user.email,
    privileged: req.user.privileged,
    userId: Number(req.user.id),
    globalShare: req.user.globalShare 
  };
  res.json(response);
});

accountRouter.get('/key', (req: express.Request, res: express.Response) => {
  getAPIKeyByEmail(req.user.email)
    .then((user: Account) => {
      res.json({"apiKey": user.apiKey})
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
