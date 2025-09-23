const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

import {
  suLogin,
  nonSuLogin,
  suSignup,
  mockResult1,
  mockResult2,
  mockResult3,
  mockResult6,
  mockResult7,
  mockResult8,
  mockResult9,
  mockResult10,
  nonSuSignup,
  nnonexistentUserLogin,
} from './mockPayloads';

const authRoute = `http://${process.env.SERVER_HOST}:8080/api/auth`;
const accountRoute = `http://${process.env.SERVER_HOST}:8080/api/accounts`;
const resultRoute = `http://${process.env.SERVER_HOST}:8080/api/results`;

const session = axios.create({
  jar: new tough.CookieJar(),
  withCredentials: true
});

axiosCookieJarSupport(session);
session.defaults.jar = new tough.CookieJar();
session.defaults.withCredentials = true;

describe('Main', () => {
  beforeAll((done) => {
    return session
      .post(authRoute + '/signup', suSignup)
      .then(() => session.post(authRoute + '/signup', nonSuSignup))
      .then(() => done())
      .catch(err => {
        console.log(err);
        done();
      });
  });

  test('Existing user can be logged in', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      });
  });

  test('Nonexistent user cannot be logged in', () => {
    return session.post(authRoute + '/login', nnonexistentUserLogin)
      .then(() => {
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch(err => {
        expect(err.response.status).toEqual(500);
        expect(err.response.data.name).toEqual('EntityNotFound');
      });
  });

  test('Logged in user can access their information', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/info'))
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.data.email).toEqual('email1@email.com');
      })
      .catch((err) => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });
  
  test('Logged out user cannot access their information', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.post(authRoute + '/logout'))
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/info'))
      .then(() => {
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch(err => {
        expect(err.response.status).toEqual(401);
      });
  });

  test('Regular user can post a single result with their API Key', () => {
    let modifiedResult = mockResult1;
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        modifiedResult.account['apiKey'] = res.data.apiKey;
        return modifiedResult;
      })
      .then(result => session.post(resultRoute, {results: [result]}))
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.data.fulfilled.length).toEqual(1);
        expect(res.data.rejected.length).toEqual(0);
      })
      .catch((err) => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

  test('SU user can post a single result with their API Key', () => {
    let modifiedResult = mockResult2;
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        modifiedResult.account['apiKey'] = res.data.apiKey;
        return modifiedResult;
      })
      .then(result => session.post(resultRoute, {results: [result]}))
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.data.fulfilled.length).toEqual(1);
        expect(res.data.rejected.length).toEqual(0);
      })
      .catch((err) => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

  test('Regular user can post multiple result with their API Key, all valid result', () => {
    let modifiedResult1 = mockResult3;
    let modifiedResult2 = mockResult6;
    let modifiedResult3 = mockResult7;
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        modifiedResult1.account['apiKey'] = res.data.apiKey;
        modifiedResult2.account['apiKey'] = res.data.apiKey;
        modifiedResult3.account['apiKey'] = res.data.apiKey;
        return [modifiedResult1, modifiedResult2, modifiedResult3];
      })
      .then(results => session.post(resultRoute, {results: results}))
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.data.fulfilled.length).toEqual(3);
        expect(res.data.rejected.length).toEqual(0);
      })
      .catch((err) => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

  test('SU user can post multiple result with their API Key, all valid result', () => {
    let modifiedResult1 = mockResult8;
    let modifiedResult2 = mockResult9;
    let modifiedResult3 = mockResult10;
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        modifiedResult1.account['apiKey'] = res.data.apiKey;
        modifiedResult2.account['apiKey'] = res.data.apiKey;
        modifiedResult3.account['apiKey'] = res.data.apiKey;
        return [modifiedResult1, modifiedResult2, modifiedResult3];
      })
      .then(results => session.post(resultRoute, {results: results}))
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.data.fulfilled.length).toEqual(3);
        expect(res.data.rejected.length).toEqual(0);
      })
      .catch((err) => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

});
