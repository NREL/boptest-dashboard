import express from 'express';

import {updateName, updateGlobalShare} from '../models/Account';

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