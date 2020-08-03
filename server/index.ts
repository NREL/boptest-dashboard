import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';

import {accountRouter} from './routes/accountRoutes';
import {appRouter} from './routes/appRoutes';
import {connectToDb} from './db';

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

// serve static files from the React app
app.use(express.static(path.join(__dirname, '/usr/client/build')));

// define routes
app.use('/api/accounts', accountRouter);
app.use('/', appRouter);

const {PORT = 8080} = process.env;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('server started at http://localhost:' + PORT);
    connectToDb(false);
  });
}

export default app;
