import express from 'express';
import path from 'path';

export const appRouter = express.Router();

appRouter.get(['/', '/*'], (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '/usr/client/build', 'index.html'));
});
