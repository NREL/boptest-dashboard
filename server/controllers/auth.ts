import {CognitoUser, CognitoUserSession, ISignUpResult} from 'amazon-cognito-identity-js';
import {confirmRegistration, loginUser, signupCognitoUser} from './../cognito';
import {getAccountByEmail, createAccountFromSignup} from './../controllers/account';
import {ConfirmData, LoginData, SignupData} from '../../common/interfaces';

const TESTING: boolean = process.env.CONTEXT! === 'testing';

export function signup(signupData: SignupData): Promise<any> {
  if (TESTING) {
    return createAccountFromSignup(signupData, "testing");
  }
  else {
    return signupCognitoUser(signupData).then((signUpResult: ISignUpResult) => {
      return createAccountFromSignup(signupData, signUpResult.userSub);
    });
  }
}

export function confirm(confirmData: ConfirmData): Promise<any> {
  return confirmRegistration(confirmData).then((result: CognitoUser) => {
    // username of a CognitoUser is the email
    return getAccountByEmail(result.getUsername());
  });
}

export function login(loginData: LoginData): Promise<any> {
  if (TESTING) {
    return getAccountByEmail(loginData.email);
  }
  else {
    return loginUser(loginData).then((result: CognitoUserSession) => {
      return getAccountByEmail(result.getIdToken().payload.email);
    });
  }
}
