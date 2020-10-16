import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import {confirmRegistration, loginUser, signupUser} from './../cognito';
import {getUser, createAccountFromCognitoUser} from './../controllers/account';
import {ConfirmData, LoginData, SignupData} from '../../common/interfaces';

export function signup(signupData: SignupData): Promise<any> {
  return signupUser(signupData).then((result: any) => {
    var cognitoUser = result.user;
    // create account from cognito User
    return createAccountFromCognitoUser(cognitoUser, signupData);
  });
}

export function confirm(confirmData: ConfirmData): Promise<any> {
  return confirmRegistration(confirmData).then((result: CognitoUser) => {
    // username of a CognitoUser is the email
    return getUser(result.getUsername());
  });
}

export function login(loginData: LoginData): Promise<any> {
  return loginUser(loginData).then((result: CognitoUserSession) => {
    return getUser(result.getIdToken().payload.email);
  });
}
