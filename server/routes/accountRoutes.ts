import express from 'express';

import {getUsers, getUserResults, getResultsForUser} from '../models/account';
import {getResults} from 'models/result';

export const accountRouter = express.Router();

accountRouter.get('/', (req: express.Request, res: express.Response) => {
  getUsers()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => console.log('Unable to get accounts' + err));
});

accountRouter.get('/result', (req: express.Request, res: express.Response) => {
  getResultsForUser()
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log('cant get the results' + err));
});

accountRouter.get('/results', (req: express.Request, res: express.Response) => {
  getResults()
    .then(results => {
      res.json(results);
    })
    .catch(err => console.log('couldnt get the results' + err));

  // getUserResults()
  //   .then(accounts => {
  //     //res.json(accounts[0].results);
  //     console.log('results: ' + accounts[0].results);
  //     res.json(accounts);
  //   })
  //   .catch(err => console.log('couldnt get the results from account' + err));
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
