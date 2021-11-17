import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';

import {accountRouter} from './routes/accountRoutes';
import {buildingTypeRouter} from './routes/buildingTypeRoutes';
import {appRouter} from './routes/appRoutes';
import {setupRouter} from './routes/setupRoutes';
import {authRouter} from './routes/authRoutes';
import {resultRouter} from './routes/resultRoutes';
import {connectToDb} from './db';

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

const SESSION_NAME = process.env.SESSION_NAME!;
const SESSION_SECRET = process.env.SESSION_SECRET!;
const IN_PROD: boolean = process.env.NODE_ENV! === 'production';

app.use(
  session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 8*60*60*1000, // 8 Hours
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

// serve static files from the React app
console.log('env:', process.env.NODE_ENV);
if (!IN_PROD) {
  console.log("Serving static files from APP");
  app.use(express.static(path.join(__dirname, '/usr/client/build')));
  app.use('/assets', express.static(path.join(__dirname, '/usr/client/assets')));
} else {
  console.log("Serving static files from nginx");
}

// define routes
app.use('/api/auth', authRouter);
app.use('/api/setup', setupRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/buildingTypes', buildingTypeRouter);
app.use('/api/results', resultRouter);
app.use('/', appRouter);

const {PORT = 8080} = process.env;

// question: need to find out if this needs to run in Prod. ~Amit
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('server started at http://localhost:' + PORT);
    connectToDb(true);
  });
}

export default app;
