import express from 'express';
import {confirmRegistration} from './../cognito';
import {SignupData, LoginData, ConfirmData} from './../../common/interfaces';
import {login, signup} from './../controllers/auth';
import {Account} from './../models/Account';

export const authRouter = express.Router();

authRouter.post('/signup', (req: express.Request, res: express.Response) => {
  var signupData: SignupData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  signup(signupData)
    .then(user => {
      res.json(user);
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

  confirmRegistration(data)
    .then(result => {
      res.json(result);
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
        req.session.userId = user.id;
        req.session.email = user.email;
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).send('Unable to login user with err: ' + err);
    });
});

authRouter.get('/userInfo', (req: express.Request, res: express.Response) => {
  res.json(req.cookies);
});

// authRouter.post('/logout', (req: express.Request, res: express.Response) => {
//   const email = req.body.email;
//   logout(email)
//     .then(user => {
//       res.json(user);
//       req.session.destroy();
//       res.clearCookie('sid');
//     })
//     .catch(err => console.log('Unable to log out user with email', email));
// });
