import express from 'express';
import {getAccountByApiKey} from '../models/Account';
import {Account} from '../../common/interfaces';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

const superUsers: string = process.env.SUPER_USERS!
const suEmails: string[] = superUsers.split(',');

setupRouter.post('/db', (req: express.Request, res: express.Response) => {
  getAccountByApiKey(req.body.apiKey)
  .then((accout: Account) => {
    if (suEmails.includes(accout.email)) {
   seedTestData()
      .then(() => res.send(200))
      .catch(err => res.json(err));
    } else {
      res.send(401);
    }
  })
  .catch(err => res.json(err));
});
