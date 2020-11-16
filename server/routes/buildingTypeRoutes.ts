import express from 'express';

import {createBuildingTypes} from '../controllers/buildingTypes';

import {getBuildingTypes} from '../models/BuildingType';

export const buildingTypeRouter = express.Router();

buildingTypeRouter.post('/', (req: express.Request, res: express.Response) => {
  createBuildingTypes(req.body.buildingTypes)
    .then(buildingTypes => {
      res.json(buildingTypes);
    })
    .catch(err => console.log('Unable to create building types' + err));
});

buildingTypeRouter.get('/', (req: express.Request, res: express.Response) => {
  getBuildingTypes()
    .then(buildingTypes => {
      res.json(buildingTypes);
    })
    .catch(err => console.log('Unable to fetch building types', err));
});
