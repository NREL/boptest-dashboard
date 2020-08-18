import axios from "axios";

const setupEndpoint = `http://${process.env.SERVER_HOST}:8080/api/setup/db`;

// Have the server init the db before any of the tests run
beforeAll(() => {
  console.log("calling setup endpoint", setupEndpoint);
  return axios
    .get(setupEndpoint)
    .then(() => console.log("db is now setup"))
    .catch((err) => "unable to make call to endpoint to setup db");
});

const dummyEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts/dummy`;

describe("dummy test", () => {
  test("dummy endpoint should be reachable", async () => {
    console.log(dummyEndpoint);
    let res = await axios.get(dummyEndpoint);

    expect(res.status).toEqual(200);
  });
});

const accountsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts`;

describe("accounts test", () => {
  test("accounts endpoint should be reachable", async () => {
    let res = await axios.get(accountsEndpoint);

    expect(res.status).toEqual(200);
  });
  test("accounts should be returned properly", async () => {
    let res = await axios.get(accountsEndpoint);

    // TODO fill out expected accounts after deciding
    // how I want to set up the db
    const expectedAccounts = {
      accounts: [{}, {}],
    };

    expect(res.data).toContain(expectedAccounts);
  });
});

const resultsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results`;

describe("results test", () => {
  test("results endpoint should be reachable", async () => {
    let res = await axios.get(resultsEndpoint);

    expect(res.status).toEqual(200);
  });
  test("results should be returned properly", async () => {
    let res = await axios.get(resultsEndpoint);

    // TODO fill out expected results after deciding
    // how I want to set up the db
    const expectedResults = {
      results: [{}, {}],
    };

    expect(res.data).toContain(expectedResults);
  });
  test("posting to results should return those results", async () => {
    const data = {};

    let res = await axios.post(resultsEndpoint, data);

    expect(res.status).toEqual(200);

    // TODO query the db for the data that we just added
  });
});
