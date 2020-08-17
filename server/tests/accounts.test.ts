import axios from 'axios';

const accountsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts`;

describe('accounts test', () => {
  test('accounts endpoint should be reachable', async () => {
    let res = await axios.get(accountsEndpoint);

    expect(res.status).toEqual(200);
  });
  test('accounts should be returned properly', async () => {
    let res = await axios.get(accountsEndpoint);

    // TODO fill out expected accounts after deciding
    // how I want to set up the db
    const expectedAccounts = {
      accounts: [{}, {}],
    };

    expect(res.data).toContain(expectedAccounts);
  });
});
