import express from 'express';

import {updateName, updateGlobalShare} from '../models/Account';
import {getUser} from '../controllers/account';
import {
  Account,
} from './../../common/interfaces';

export const accountRouter = express.Router();

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
});

accountRouter.get('/info', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.name && req.session.email) {
    const response = {
      name: req.session.name,
      email: req.session.email,
      userId: Number(req.session.userId),
      globalShare: req.session.globalShare
    };
    res.json(response);
  } else {
    res.status(401).send('User is not logged in');
  }
});

accountRouter.get('/key', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.name && req.session.email) {
    getUser(req.session.email)
      .then((user: Account) => {
        res.json({"apiKey": user.apiKey})
      })
      .catch(err => {
        res.status(501).send(err);
      });
  } else {
    res.status(401).send('User is not logged in');
  }
});
