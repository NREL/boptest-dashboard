import express from 'express';

export const resultRouter = express.Router();

// This endpoint will return all (or a set number of) recent test results
// that are shared or belong to the current user
resultRouter.get('/', (req: express.Request, res: express.Response) => {
  res.send('There are no recent test results');
});

// Gets the data for a specific test result at /results/:id as long as it
// belongs to the current user or is shared
resultRouter.get('/:id', (req: express.Request, res: express.Response) => {
  res.send(`This is the data for result with id ${req.params.id}`);
});

// /result or /results name tbd.
// This is the endpoint NREL will hit with new test result data.
// Essentially our entire data model will be created in this method
resultRouter.post('/', (req: express.Request, res: express.Response) => {
  res.json(req.body);
});
