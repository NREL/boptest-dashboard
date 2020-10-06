import express from 'express';
import {SignupData, LoginData} from './../../common/interfaces';
//import {login, logout, signup} from './../controllers/auth';
import {signup} from './../controllers/auth';

export const authRouter = express.Router();

// use the errors

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
    .catch(err => console.log('Unable to sign up user ', signupData.username));
});

// authRouter.post('/login', (req: express.Request, res: express.Response) => {
//   const loginData: LoginData = {
//     email: req.body.email,
//     password: req.body.password,
//   };

//   login(loginData)
//     .then(user => {
//       res.json(user);
//     })
//     .catch(err =>
//       console.log('Unable to login user with email', loginData.email)
//     );
// });

// authRouter.post('/logout', (req: express.Request, res: express.Response) => {
//   const email = req.body.email;
//   logout(email)
//     .then(user => {
//       res.json(user);
//     })
//     .catch(err => console.log('Unable to log out user with email', email));
// });
