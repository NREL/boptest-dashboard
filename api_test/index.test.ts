const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

import {
  suLogin,
  nonSuLogin,
  suSignup,
  mockBuilding1,
  mockBuilding2,
  mockBuilding3,
  mockBuilding4,
  mockResult1,
  mockResult2,
  mockResult3,
  mockResult4,
  mockResult5,
  mockResult6,
  mockResult7,
  mockResult8,
  mockResult9,
  mockResult10,
  mockResult11,
  mockResult12,
  mockResult13,
  mockResult14,
  nonSuSignup,
  nnonexistentUserLogin,
} from './mockPayloads';

const authRoute = `http://${process.env.SERVER_HOST}:8080/api/auth`;
const accountRoute = `http://${process.env.SERVER_HOST}:8080/api/accounts`;
const buildingRoute = `http://${process.env.SERVER_HOST}:8080/api/buildingTypes`;
const updateBuildingRoute = `http://${process.env.SERVER_HOST}:8080/api/buildingTypes?uid=one`;
const resultRoute = `http://${process.env.SERVER_HOST}:8080/api/results`;

const rejectedMessage1 = 'Invalid Data: Result (result4) tried to use scenario type: "time" with value: "cooling peak" for building type: "this is a building"';
const rejectedMessage2 = 'Invalid Data: Result (result5) tried to use scenario type: "timePeriod" with value: "peak" for building type: "this is a building"';

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

  test('SU can post a building with their API Key', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
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
      .then(() => session.get(accountRoute + '/key'))
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
        expect(res.data[0].scenarios).toEqual(mockBuilding1.scenarios);
      })
      .catch(() => {
        // we should never hit the un-happy path
        expect(false).toEqual(true);
      })
  });

  test('SU can update a building with their API Key', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        return res.data.apiKey;
      })
      .then(key => session.put(updateBuildingRoute, {buildingTypes: [mockBuilding4], apiKey: key}))
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .catch(() => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
      });
  });

  test('SU can post multiple buildings with their API Key', () => {
    return session.post(authRoute + '/login', suLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        return res.data.apiKey;
      })
      .then(key => session.post(buildingRoute, {buildingTypes: [mockBuilding2, mockBuilding3], apiKey: key}))
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .catch(() => {
        // We should never hit the un-happy path.
        expect(false).toEqual(true);
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

  test('Any user can post multiple results, two valid results, one rejected (bad scenario type)', () => {
    let modifiedResult1 = mockResult11;
    let modifiedResult2 = mockResult12;
    let modifiedResult3 = mockResult4;
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
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch((err) => {
        expect(err.response.status).toEqual(400);
        expect(err.response.data.fulfilled.length).toEqual(2);
        expect(err.response.data.rejected.length).toEqual(1);
        expect(err.response.data.rejected[0].message).toEqual(rejectedMessage1);
      });
  });

  test('Any user can post multiple results, two valid results, one rejected (bad scenario value)', () => {
    let modifiedResult1 = mockResult13;
    let modifiedResult2 = mockResult14;
    let modifiedResult3 = mockResult5;
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
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch((err) => {
        expect(err.response.status).toEqual(400);
        expect(err.response.data.fulfilled.length).toEqual(2);
        expect(err.response.data.rejected.length).toEqual(1);
        expect(err.response.data.rejected[0].message).toEqual(rejectedMessage2);
      });
  });

  test('Any user cannot post bad results, no valid results', () => {
    let modifiedResult1 = mockResult4;
    let modifiedResult2 = mockResult5;
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(accountRoute + '/key'))
      .then(res => {
        expect(res.status).toEqual(200);
        modifiedResult1.account['apiKey'] = res.data.apiKey;
        modifiedResult2.account['apiKey'] = res.data.apiKey;
        return [modifiedResult1, modifiedResult2];
      })
      .then(results => session.post(resultRoute, {results: results}))
      .then((res) => {
        // We should never hit the happy path.
        expect(false).toEqual(true);
      })
      .catch((err) => {
        expect(err.response.status).toEqual(400);
        expect(err.response.data.fulfilled.length).toEqual(0);
        expect(err.response.data.rejected.length).toEqual(2);
        expect(err.response.data.rejected[0].message).toEqual(rejectedMessage1);
        expect(err.response.data.rejected[1].message).toEqual(rejectedMessage2);
      });
  });

  test('Regular user can access new and updated buildings posted by SU', () => {
    return session.post(authRoute + '/login', nonSuLogin)
      .then(res => {
        expect(res.status).toEqual(200);
      })
      .then(() => session.get(buildingRoute))
      .then(res => {
        expect(res.data.length).toEqual(3);
        res.data.forEach((building) => {
          if (building.uid === 'one') {
            expect(building.name).toEqual(mockBuilding4.name);
            expect(building.markdownURL).toEqual(mockBuilding4.markdownURL);
            expect(building.pdfURL).toEqual(mockBuilding4.pdfURL);
            expect(building.scenarios).toEqual(mockBuilding4.scenarios);
          } else if (building.uid === 'two') {
            expect(building.name).toEqual(mockBuilding2.name);
            expect(building.markdownURL).toEqual(mockBuilding2.markdownURL);
            expect(building.pdfURL).toEqual(mockBuilding2.pdfURL);
            expect(building.scenarios).toEqual(mockBuilding2.scenarios);
          } else if (building.uid === 'three') {
            expect(building.name).toEqual(mockBuilding3.name);
            expect(building.markdownURL).toEqual(mockBuilding3.markdownURL);
            expect(building.pdfURL).toEqual(mockBuilding3.pdfURL);
            expect(building.scenarios).toEqual(mockBuilding3.scenarios);
          } else {
            // we should never hit the un-happy path (not seeing updates or new buildings)
            expect(false).toEqual(true);
          }
        })
      })
      .catch(() => {
        // we should never hit the un-happy path
        expect(false).toEqual(true);
      })
  });
});
