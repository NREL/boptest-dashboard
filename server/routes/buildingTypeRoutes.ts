import express from 'express';
import {getAccountByAPIKey} from '../controllers/account';
import {createBuildingTypes} from '../controllers/buildingTypes';
import {getBuildingTypes, getBuildingTypeByUid, updateBuildingType} from '../models/BuildingType';
import { Account } from '../../common/interfaces';

export const buildingTypeRouter = express.Router();

const superUsers: string = process.env.SUPER_USERS!
const suIds: string[] = superUsers.split(',');

buildingTypeRouter.post('/', (req: express.Request, res: express.Response) => {
  getAccountByAPIKey(req.body.apiKey)
  .then((account: Account) => {
    if (suIds.includes(account.hashedIdentifier)) {
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

buildingTypeRouter.put('/', (req: express.Request, res: express.Response) => {
  getAccountByAPIKey(req.body.apiKey)
  .then((account: Account) => {
    if (suIds.includes(account.hashedIdentifier)) {
      getBuildingTypeByUid(req.param('uid'))
      .then(buildingType => {
        updateBuildingType(buildingType, req.body.buildingTypes[0]);
      })
      .then(buildingType => res.json(buildingType))
      .catch(err => {
        res.status(500).json(err);
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
      res.status(500).json(err);
    });
});


buildingTypeRouter.get('/building', (req: express.Request, res: express.Response) => {
  getBuildingTypeByUid(req.param('uid'))
    .then(buildingType => {
      res.json(buildingType);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
