import axios from 'axios';

const resultsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results`;

describe('results test', () => {
  test('results endpoint should be reachable', async () => {
    let res = await axios.get(resultsEndpoint);

    expect(res.status).toEqual(200);
  });
  test('results should be returned properly', async () => {
    let res = await axios.get(resultsEndpoint);

    // TODO fill out expected results afterwe deciding
    // how I want to set up the db
    const expectedResults = {
      results: [{}, {}],
    };

    expect(res.data).toContain(expectedResults);
  });
  test('posting to results should return those results', async () => {
    const data = {};

    let res = await axios.post(resultsEndpoint, data);

    expect(res.status).toEqual(200);

    // TODO query the db for the data that we just added
  });
});
