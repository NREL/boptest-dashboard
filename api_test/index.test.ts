import axios from "axios";
import { LoginData, SignupData} from '../common/interfaces';

const authRoute = `http://${process.env.SERVER_HOST}:8080/api/auth`;

const user1Signup: SignupData = {
  username: 'user1',
  email: 'e.mail@mail.com',
  password: 'pass'
};

const user1Login: LoginData = {
  email: 'e.mail@mail.com',
  password: `doesn't matter.`
};

const nnonexistentUserLogin: LoginData = {
  email: 'does.not@exist.com',
  password: `doesn't matter.`
}

describe("Main", () => {
  beforeAll((done) => {
    return axios
      .post(authRoute + '/signup', user1Signup)
      .then(() => done())
      .catch(err => {
        console.log(err);
        done();
      });
  });

  test("Existing user can be logged in", () => {
    return axios.post(authRoute + '/login', user1Login).then((res) => {
      expect(res.status).toEqual(200);
    });
  });

  test("Nonexistent user cannot be logged in", () => {
    return axios.post(authRoute + '/login', nnonexistentUserLogin)
      .then(() => {
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch(err => {
        expect(err.response.status).toEqual(500);
        expect(err.response.data.name).toEqual('EntityNotFound');
      });
  });
});
