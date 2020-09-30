import express from 'express';

import {createBuildingTypes} from '../controllers/buildingTypes';

export const buildingTypeRouter = express.Router();

buildingTypeRouter.post('/', (req: express.Request, res: express.Response) => {
  createBuildingTypes(req.body.buildingTypes)
    .then(buildingTypes => {
      res.json(buildingTypes);
    })
    .catch(err => console.log('Unable to create building types' + err));
});
