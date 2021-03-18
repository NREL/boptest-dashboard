const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

import { LoginData, SignupData} from '../common/interfaces';

const authRoute = `http://${process.env.SERVER_HOST}:8080/api/auth`;

const session = axios.create({
  jar: new tough.CookieJar(),
  withCredentials: true
});

axiosCookieJarSupport(session);
session.defaults.jar = new tough.CookieJar();
session.defaults.withCredentials = true;


const suSignup: SignupData = {
  username: 'user1',
  email: 'email1@email.com',
  password: 'pass'
};

const suLogin: LoginData = {
  email: 'email1@email.com',
  password: `doesn't matter.`
};

const nonSuSignup: SignupData = {
  username: 'user2',
  email: 'a@email.com',
  password: 'pass'
};

const nonSuLogin: LoginData = {
  email: 'a@email.com',
  password: `doesn't matter.`
};

const nnonexistentUserLogin: LoginData = {
  email: 'doesNot@exist.com',
  password: `doesn't matter.`
}

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
        expect(res.data.email).toEqual('email1@email.com');
      })
      .catch(err => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });
});
