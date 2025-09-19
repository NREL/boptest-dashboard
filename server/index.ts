import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import {Account} from '../common/interfaces';

import {accountRouter} from './routes/accountRoutes';
import {buildingTypeRouter} from './routes/buildingTypeRoutes';
import {appRouter} from './routes/appRoutes';
import {setupRouter} from './routes/setupRoutes';
import {authRouter} from './routes/authRoutes';
import {resultRouter} from './routes/resultRoutes';
import {connectToDb} from './db';
import {getAccountById} from './controllers/account';

const app: express.Application = express();

// Configure CORS to allow credentials
app.use(cors({
  origin: true, // Allow all origins that include credentials
  credentials: true // Allow cookies to be sent with requests
}));

// Parse request body
app.use(bodyParser.json());

const SESSION_NAME = process.env.SESSION_NAME!;
const SESSION_SECRET = process.env.SESSION_SECRET!;
const IN_PROD: boolean = process.env.NODE_ENV! === 'production';

// Debug session configuration
console.log('Session config:', {
  name: SESSION_NAME,
  secret: SESSION_SECRET ? 'set' : 'not set',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 8*60*60*1000, // 8 Hours
    sameSite: true,
    secure: IN_PROD,
  }
});

app.use(
  session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,             // Only save session when modified
    saveUninitialized: false,  // Don't create session until something stored
    cookie: {
      maxAge: 8*60*60*1000,    // 8 Hours
      sameSite: 'lax',         // Balance between security and functionality
      secure: IN_PROD,         // HTTPS in production, HTTP in development
      httpOnly: true,          // Prevent JavaScript access to session cookie
      domain: process.env.COOKIE_DOMAIN || undefined // Configure domain from env var
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization setup
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  getAccountById(parseInt(id))
    .then((account) => {
      done(null, account);
    })
    .catch((err) => {
      done(err, null);
    });
});

// serve static files from the React app
console.log('ENV:', process.env.NODE_ENV);
if (!IN_PROD) {
  console.log("Serving static files from APP");
  app.use(express.static(path.join(__dirname, '/usr/client/build')));
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('server started at http://localhost:' + PORT);
    connectToDb();
  });
}

export default app;
