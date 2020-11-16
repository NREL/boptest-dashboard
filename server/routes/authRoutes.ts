import express from 'express';
import {
  Account,
  SignupData,
  LoginData,
  ConfirmData,
} from './../../common/interfaces';
import {confirm, login, signup} from './../controllers/auth';

export const authRouter = express.Router();

authRouter.post('/signup', (req: express.Request, res: express.Response) => {
  var signupData: SignupData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  signup(signupData)
    .then(() => {
      res.status(200).send('User successfully signed up');
    })
    .catch(err => {
      res.status(500).send('Unable to sign up user with err: ' + err);
    });
});

authRouter.post('/confirm', (req: express.Request, res: express.Response) => {
  const data: ConfirmData = {
    username: req.body.username,
    verificationCode: req.body.verificationCode,
  };

  confirm(data)
    .then((user: Account) => {
      if (req.session) {
        req.session.email = user.email;
        req.session.name = user.name;
      }
      const data = {
        email: user.email,
        name: user.name,
      };

      res.json(data);
    })
    .catch(err => {
      res.status(500).send('Unable to confirm user with err: ' + err);
    });
});

authRouter.post('/login', (req: express.Request, res: express.Response) => {
  const loginData: LoginData = {
    email: req.body.email,
    password: req.body.password,
  };

  login(loginData)
    .then((user: Account) => {
      if (req.session) {
        req.session.email = user.email;
        req.session.name = user.name;
      }

      const data = {
        email: user.email,
        name: user.name,
      };

      res.json(data);
    })
    .catch(err => {
      res.status(500).send('Unable to login user with err: ' + err);
    });
});

authRouter.get('/info', (req: express.Request, res: express.Response) => {
  if (req.session && req.session.name && req.session.email) {
    const response = {
      name: req.session.name,
      email: req.session.email,
    };

    res.json(response);
  } else {
    res.status(403).send('User is not logged in');
  }
});

authRouter.post('/logout', (req: express.Request, res: express.Response) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log('Unable to destroy session', err);
        res.status(500).send('Unable to logout, please try again');
      }
    });
    res.clearCookie(process.env.SESSION_NAME!);
    res.status(200).send('Logged out successfully');
  }
});
