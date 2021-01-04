import express from 'express';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

setupRouter.get('/db', (req: express.Request, res: express.Response) => {
  seedTestData()
    .then(() => res.send('successfully seeded db'))
    .catch(err => console.log('Unable to seed db', err));
});
