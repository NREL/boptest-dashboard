import express from 'express';
import path from 'path';
import fs from 'fs';
import {resolveClientBuildDir} from '../utils/paths';

export const appRouter = express.Router();

const clientIndexPath = path.join(resolveClientBuildDir(), 'index.html');

appRouter.get(['/', '/*'], (req: express.Request, res: express.Response) => {
  if (!fs.existsSync(clientIndexPath)) {
    res.status(503).send(
      'Client build not found. Run `npm run build` inside the client workspace before serving from the Node backend.'
    );
    return;
  }

  res.sendFile(clientIndexPath);
});
