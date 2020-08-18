import axios from 'axios';

const dummyEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts/dummy`;

describe('dummy test', () => {
  test('dummy endpoint should be reachable', async () => {
    console.log(dummyEndpoint);
    let res = await axios.get(dummyEndpoint);

    expect(res.status).toEqual(200);
  });
});

// import app from "../index";
// import * as supertest from "supertest";

// describe("app", () => {
//   let request;

//   beforeEach(() => {
//     request = supertest(app);
//   });

//   it("should return a successful response for GET /", (done) => {
//     request.get("/").expect(200, done);
//   });
// });
