import express from 'express';
import {createAccounts} from '../controllers/account';
import {createBuildingType} from '../models/BuildingType';
import {seedTestData} from '../db';

export const setupRouter = express.Router();

setupRouter.post('/account', (req: express.Request, res: express.Response) => {
  createAccounts(req.body)
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to create accounts', err));
});

setupRouter.post(
  '/buildingType',
  (req: express.Request, res: express.Response) => {
    createBuildingType(req.body.buildingType)
      .then(buildingType => {
        res.json(buildingType);
      })
      .catch(err => console.log('Unable to create buildingType', err));
  }
);

setupRouter.get('/db', (req: express.Request, res: express.Response) => {
  seedTestData()
    .then(() => res.send('successfully seeded db'))
    .catch(err => console.log('Unable to seed db', err));
});
