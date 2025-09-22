import express from 'express';
import path from 'path';
import {resolveClientBuildDir} from '../utils/paths';

export const appRouter = express.Router();

const clientIndexPath = path.join(resolveClientBuildDir(), 'index.html');

appRouter.get(['/', '/*'], (req: express.Request, res: express.Response) => {
  res.sendFile(clientIndexPath);
});
