import express from 'express';

import {getUsers} from '../models/account';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getUsers()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});
