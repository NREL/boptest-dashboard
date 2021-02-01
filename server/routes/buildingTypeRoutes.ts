import express from 'express';
import {getAccountByApiKey} from '../models/Account';
import {createBuildingTypes} from '../controllers/buildingTypes';
import {getBuildingTypes} from '../models/BuildingType';
import { Account } from '../../common/interfaces';

const superUsers: string = process.env.SUPER_USERS!
const suEmails: string[] = superUsers.split(',');

export const buildingTypeRouter = express.Router();

buildingTypeRouter.post('/', (req: express.Request, res: express.Response) => {
  getAccountByApiKey(req.body.apiKey)
  .then((accout: Account) => {
    if (suEmails.includes(accout.email)) {
    createBuildingTypes(req.body.buildingTypes)
      .then(buildingTypes => {
        res.json(buildingTypes);
      })
      .catch(err => {
        res.json(err);
      });
    } else {
      res.send(401);
    }
  })
  .catch(err => {
    res.json(err);
  })
});

buildingTypeRouter.get('/', (req: express.Request, res: express.Response) => {
  getBuildingTypes()
    .then(buildingTypes => {
      res.json(buildingTypes);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
