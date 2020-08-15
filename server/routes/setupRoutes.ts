import express from 'express';
import {createAccount} from '../models/Account';
import {createTestCase} from '../models/TestCase';

export const setupRouter = express.Router();

setupRouter.post('/account', (req: express.Request, res: express.Response) => {
  createAccount(req.body.account)
    .then(account => {
      console.log('successfully created account with id', account.id);
      res.json(account);
    })
    .catch(err => console.log('Unable to create account', err));
});

setupRouter.post('/testcase', (req: express.Request, res: express.Response) => {
  createTestCase(req.body.testcase)
    .then(testcase => {
      console.log('successfully created test case with id', testcase.id);
      res.json(testcase);
    })
    .catch(err => console.log('Unable to create testcase', err));
});
