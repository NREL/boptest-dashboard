import express from 'express';

import {User} from '../models/account';

export const accountRouter = express.Router();

accountRouter.get('/', async (req: express.Request, res: express.Response) => {
  User.findAll()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});
