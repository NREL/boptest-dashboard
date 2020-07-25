import express from 'express';

import {getUsers} from '../models/account';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getUsers()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});

// this endpoint gets all the routes for the given user as long as that user
// is the currently logged in user
accountRouter.get(
  '/:userId/results',
  (req: express.Request, res: express.Response) => {
    res.send(
      `There are no test results associated with account ${req.params.userId}`
    );
  }
);
