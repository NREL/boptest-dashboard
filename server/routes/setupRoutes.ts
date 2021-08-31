import express from 'express';
import {getAccountByApiKey} from '../models/Account';
import {Account} from '../../common/interfaces';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

const envType = process.env.NODE_ENV;

const superUsers: string = process.env.SUPER_USERS!
const suEmails: string[] = superUsers.split(',');

setupRouter.post('/db', (req: express.Request, res: express.Response) => {
  if (envType === 'development') {
    getAccountByApiKey(req.body.apiKey)
    .then((accout: Account) => {
      console.log('Successfully got Account');
      if (suEmails.includes(accout.email)) {
        seedTestData(req.body.apiKey)
        .then(() => res.send(200))
        .catch(err => res.json(err));
      } else {
        res.send(401);
      }
    })
    .catch(err => {
      console.log('ERROR:', err);
      res.json(err);
    });
  } else {
    res.send(401);
  }
});