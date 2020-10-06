import {SignupData} from './../common/interfaces';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

const userPoolId = 'us-east-2_bRRaBKHKB';
const appClientId = 'qf1rkdnu575bahbtmhb1hblat';

export function signupUser(signupData: SignupData) {
  return new Promise((promiseRes, promiseRej) => {
    var poolData = {
      UserPoolId: userPoolId,
      ClientId: appClientId,
    };
    var userPool = new CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: signupData.email,
    };

    var attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    userPool.signUp(
      signupData.username,
      signupData.password,
      attributeList,
      [],
      // onSignup()
      function (err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
          promiseRej(err);
          return;
        }
        if (result) {
          promiseRes(result);
        } else {
          console.log('something went wrong, unable to register user');
          promiseRej('something went wrong, unable to register user');
          return;
        }
      }
    );
  });
}
