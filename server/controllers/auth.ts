import {ISignUpResult} from 'amazon-cognito-identity-js';
import {signupUser} from './../cognito';
import {createAccountFromCognitoUser} from './../controllers/account';
import {LoginData, SignupData, User} from '../../common/interfaces';

export function signup(signupData: SignupData): Promise<any> {
  // signupUser(signupData, (err: Error, result: ISignUpResult) => {
  //   // something went wrong with the signup and we have a known error
  //   if (err) {
  //     console.log(err.message || JSON.stringify(err));
  //     return;
  //   }
  //   // we got a positive result back from Cognito, make our Account
  //   if (result) {
  //     var cognitoUser = result.user;
  //     // create account from cognito User
  //     createAccountFromCognitoUser(cognitoUser, signupData);
  //     console.log('user name is ' + cognitoUser.getUsername());
  //     return cognitoUser;
  //   } else {
  //     // something went wrong and we don't have a known error
  //     console.log('something went wrong, unable to register user');
  //     return;
  //   }
  // });
  return signupUser(signupData)
    .then((result: any) => {
      var cognitoUser = result.user;
      console.log('result:', result);
      // create account from cognito User
      return createAccountFromCognitoUser(cognitoUser, signupData);
    })
    .catch(err => {
      console.log(err.message || JSON.stringify(err));
      return;
    });
}

// export function login(loginData: LoginData): Promise<any> {}

// export function logout(email: string): Promise<any> {}
