import {getRepository} from 'typeorm';
import express from 'express';
import {createAccounts} from '../controllers/account';
import {createTestCase} from '../models/TestCase';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

setupRouter.post('/account', (req: express.Request, res: express.Response) => {
  createAccounts(req.body)
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to create accounts', err));
});

setupRouter.post('/testcase', (req: express.Request, res: express.Response) => {
  createTestCase(req.body.testcase)
    .then(testcase => {
      res.json(testcase);
    })
    .catch(err => console.log('Unable to create testcase', err));
});

setupRouter.get('/db', (req: express.Request, res: express.Response) => {
  seedTestData()
    .then(() => res.send('successfully seeded db'))
    .catch(err => console.log('Unable to seed db', err));
});
