import {
  ChangePasswordData,
  ConfirmData,
  ConfirmNewPasswordData,
  LoginData,
  SignupData,
} from './../common/interfaces';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const userPoolId = process.env.COGNITO_USER_POOL_ID!;
const appClientId = process.env.COGNITO_APP_CLIENT_ID!;

const getUserPool = (): CognitoUserPool => {
  var poolData = {
    UserPoolId: userPoolId,
    ClientId: appClientId,
  };

  return new CognitoUserPool(poolData);
};

export function signupCognitoUser(signupData: SignupData) {
  return new Promise((promiseRes, promiseRej) => {
    var userPool = getUserPool();

    var attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: signupData.email,
    };

    var attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    // sign up with email here as username, so that logging in can be done via email too
    userPool.signUp(
      signupData.email,
      signupData.password,
      attributeList,
      [],
      function (err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
          promiseRej(err);
          return;
        }
        if (result) {
          promiseRes(result);
        } else {
          promiseRej('something went wrong, unable to register user');
          return;
        }
      }
    );
  });
}

export function confirmRegistration(
  confirmData: ConfirmData
): Promise<CognitoUser> {
  return new Promise((promiseRes, promiseRej) => {
    const userPool = getUserPool();

    var userData = {
      Username: confirmData.username,
      Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(
      confirmData.verificationCode,
      true,
      function (err, result) {
        if (err) {
          promiseRej(err);
        }
        promiseRes(cognitoUser);
      }
    );
  });
}

export function loginUser(loginData: LoginData): Promise<CognitoUserSession> {
  return new Promise((promiseRes, promiseRej) => {
    var authenticationData = {
      Username: loginData.email,
      Password: loginData.password,
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userPool = getUserPool();
    var userData = {
      Username: loginData.email,
      Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        promiseRes(result);
      },
      onFailure: function (err) {
        promiseRej(err);
      },
    });
  });
}

export function changePassword(data: ChangePasswordData): Promise<void> {
  return new Promise((promiseRes, promiseRej) => {
    // get the current cognito user from local storage
    const cognitoUser = getUserPool().getCurrentUser();
    if (!cognitoUser) {
      console.log('cannot get the cognito user');
      promiseRej('Congito user does not exist in current context');
      return;
    }

    // need to authenticate the current user with cognito
    cognitoUser.getSession(function(err: any, session: any) {
      if (err) {
        promiseRej(err);
        return;
      }

      // we have a valid cognito session, so we can change the password
      cognitoUser.changePassword(data.oldPassword, data.newPassword, function (
        err
      ) {
        if (err) {
          promiseRej(err);
        } else {
          promiseRes();
        }
      });
    });
  });
}

export function forgotPassword(username: string): Promise<void> {
  return new Promise((promiseRes, promiseRej) => {
    const userPool = getUserPool();

    var userData = {
      Username: username,
      Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess() {
        promiseRes();
      },
      onFailure(err) {
        promiseRej(err);
      },
    });
  });
}

export function confirmPasswordChange(
  confirmData: ConfirmNewPasswordData
): Promise<void> {
  return new Promise((promiseRes, promiseRej) => {
    const userPool = getUserPool();
    var userData = {
      Username: confirmData.username,
      Pool: userPool,
    };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(
      confirmData.verificationCode,
      confirmData.newPassword,
      {
        onSuccess() {
          promiseRes();
        },
        onFailure(err) {
          promiseRej(err);
        },
      }
    );
  });
}
