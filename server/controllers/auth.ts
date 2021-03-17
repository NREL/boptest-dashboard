import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import {confirmRegistration, loginUser, signupCognitoUser} from './../cognito';
import {getUser, createAccountFromSignup} from './../controllers/account';
import {ConfirmData, LoginData, SignupData} from '../../common/interfaces';

const TESTING: boolean = process.env.CONTEXT! === 'testing';

export function signup(signupData: SignupData): Promise<any> {
  if (TESTING) {
    return createAccountFromSignup(signupData);
  }
  else {
    return signupCognitoUser(signupData).then((result: any) => {
      return createAccountFromSignup(signupData);
    });
  }
}

export function confirm(confirmData: ConfirmData): Promise<any> {
  return confirmRegistration(confirmData).then((result: CognitoUser) => {
    // username of a CognitoUser is the email
    return getUser(result.getUsername());
  });
}

export function login(loginData: LoginData): Promise<any> {
  if (TESTING) {
    return getUser(loginData.email);
  }
  else {
    return loginUser(loginData).then((result: CognitoUserSession) => {
      return getUser(result.getIdToken().payload.email);
    });
  }
}
