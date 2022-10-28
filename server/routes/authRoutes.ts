import {
  changePassword,
  confirmPasswordChange,
  forgotPassword,
} from '../cognito';
import express from 'express';
import {
  Account,
  SignupData,
  LoginData,
  ConfirmData,
} from './../../common/interfaces';
import {confirm, login, signup} from './../controllers/auth';
import {getAccountById, getAccountByAPIKey} from '../controllers/account';

// Middleware to authorize a request using a key or a session
export function authorizer(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.header('Authorization');

  if (key) {
    getAccountByAPIKey(key).then((account: Account) => {
      req.user = account;
      next();
    }).catch(err => {
      res.status(401).json({error: 'Not Authorized'});
    });
  } else if(req.session && req.session.userId) {
    getAccountById(req.session.userId).then((account: Account) => {
      req.user = account;
      next();
    }).catch(err => {
      res.status(500).json(err);
    });
  } else {
    res.status(401).json({error: 'Not Authorized'});
  }
};

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
    .catch(err => res.status(500).json(err));
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
        req.session.userId = `${user.id}`;
        req.session.globalShare = user.shareAllResults;
      }
      const data = {
        email: user.email,
        name: user.name,
      };

      res.json(data);
    })
    .catch(err => res.status(500).json(err));
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
        req.session.userId = `${user.id}`;
        req.session.globalShare = user.shareAllResults;
      }
      const data = {
        email: user.email,
        name: user.name,
      };
      res.json(data);
    })
    .catch(err => res.status(500).json(err));
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

// initiate a forgot password flow
authRouter.post(
  '/forgotPassword',
  (req: express.Request, res: express.Response) => {
    forgotPassword(req.body.email)
      .then(() => {
        res.status(200).send('Successfully initiated the forgot password flow');
      })
      .catch(err =>
        res
          .status(500)
          .send(
            `Unable to start the forgot password sequence with error: ${err}`
          )
      );
  }
);

authRouter.post(
  '/confirmNewPassword',
  (req: express.Request, res: express.Response) => {
    confirmPasswordChange(req.body)
      .then(() => res.status(200).send('Successfully confirmed the new password change'))
      .catch(err => res.status(500).json(err));
  }
);

authRouter.post(
  '/changePassword',
  (req: express.Request, res: express.Response) => {
    changePassword(req.body)
      .then(() => res.status(200).send('Successfully changed your password'))
      .catch(err => res.status(500).json(err));
  }
);
