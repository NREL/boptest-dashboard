import {ConfirmData, LoginData, SignupData} from './../common/interfaces';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import {getUser} from 'controllers/account';

const userPoolId = 'us-east-2_bRRaBKHKB';
const appClientId = 'qf1rkdnu575bahbtmhb1hblat';

const getUserPool = (): CognitoUserPool => {
  var poolData = {
    UserPoolId: userPoolId,
    ClientId: appClientId,
  };

  return new CognitoUserPool(poolData);
};

export function signupUser(signupData: SignupData) {
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

export function confirmRegistration(confirmData: ConfirmData) {
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
        promiseRes(result);
      }
    );
  });
}

export function loginUser(loginData: LoginData) {
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
