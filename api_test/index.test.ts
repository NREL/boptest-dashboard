const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

import {
  suLogin,
  nonSuLogin,
  suSignup,
  mockBuilding1,
  mockBuilding2,
  nonSuSignup,
  nnonexistentUserLogin
} from './mockPayloads';

const authRoute = `http://${process.env.SERVER_HOST}:8080/api/auth`;
const buildingRoute = `http://${process.env.SERVER_HOST}:8080/api/buildingTypes`

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
      .then(() => session.get(authRoute + '/info'))
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.data.email).toEqual('email1@email.com');
      })
      .catch(() => {
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
      .then(() => session.get(authRoute + '/info'))
      .then(() => {
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch(err => {
        expect(err.response.status).toEqual(401);
      });
  });

  test('SU can post a building with their API Key', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(authRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        return res.data.apiKey;
      })
      .then(key => session.post(buildingRoute, {buildingTypes: [mockBuilding1], apiKey: key}))
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .catch(() => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

  test('Regular user cannot post a building with their API Key', () => {
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(authRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        return res.data.apiKey;
      })
      .then(key => session.post(buildingRoute, {buildingTypes: [mockBuilding2], apiKey: key}))
      .then(() => {
        // we should never hit the happy path
        expect(false).toEqual(true);
      })
      .catch(err => {
        expect(err.response.status).toEqual(401);
      });
  });

  test('Regular user can access buildings posted by SU', () => {
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(buildingRoute))
      .then(res => {
        expect(res.data.length).toEqual(1);
        expect(res.data[0].uid).toEqual(mockBuilding1.uid);
        expect(res.data[0].name).toEqual(mockBuilding1.name);
        expect(res.data[0].markdownURL).toEqual(mockBuilding1.markdownURL);
        expect(res.data[0].pdfURL).toEqual(mockBuilding1.pdfURL);
      })
      .catch(() => {
        // we should never hit the un-happy path
        expect(false).toEqual(true);
      })
  });
});
