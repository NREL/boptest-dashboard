import {loginUser, signupUser} from './../cognito';
import {getUser, createAccountFromCognitoUser} from './../controllers/account';
import {LoginData, SignupData} from '../../common/interfaces';

export function signup(signupData: SignupData): Promise<any> {
  return signupUser(signupData).then((result: any) => {
    var cognitoUser = result.user;
    // create account from cognito User
    return createAccountFromCognitoUser(cognitoUser, signupData);
  });
}

export function login(loginData: LoginData): Promise<any> {
  return loginUser(loginData).then((result: any) => {
    return getUser(result.idToken.payload.email);
  });
}
