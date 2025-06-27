import express from 'express';
import {getAccountByAPIKey} from '../controllers/account';
import {Account} from '../../common/interfaces';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

const envType = process.env.NODE_ENV;

const superUsers: string = process.env.SUPER_USERS!
const suIds: string[] = superUsers.split(',');

setupRouter.post('/db', (req: express.Request, res: express.Response) => {
  if (envType === 'development') {
    getAccountByAPIKey(req.body.apiKey)
    .then((account: Account) => {
      if (suIds.includes(account.hashedIdentifier)) {
        seedTestData(req.body.apiKey)
        .then(() => res.sendStatus(200))
        .catch(err => res.json(err));
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      console.log('ERROR:', err);
      res.json(err);
    });
  } else {
    res.sendStatus(401);
  }
});
