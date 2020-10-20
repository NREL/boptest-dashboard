import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';

import {accountRouter} from './routes/accountRoutes';
import {buildingTypeRouter} from './routes/buildingTypeRoutes';
import {appRouter} from './routes/appRoutes';
import {authRouter} from './routes/authRoutes';
import {resultRouter} from './routes/resultRoutes';
import {setupRouter} from './routes/setupRoutes';
import {connectToDb} from './db';

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

const SESSION_NAME = process.env.SESSION_NAME!;
const SESSION_SECRET = process.env.SESSION_SECRET!;

const ONE_HOUR = 1000 * 60 * 60;

app.use(
  session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: ONE_HOUR,
      sameSite: true,
      secure: app.get('env') === 'production',
    },
  })
);

// serve static files from the React app
app.use(express.static(path.join(__dirname, '/usr/client/build')));

// define routes
app.use('/api/auth', authRouter);
app.use('/api/setup', setupRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/buildingTypes', buildingTypeRouter);
app.use('/api/results', resultRouter);
app.use('/', appRouter);

const {PORT = 8080} = process.env;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('server started at http://localhost:' + PORT);
    connectToDb(true);
  });
}

export default app;
