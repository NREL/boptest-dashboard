import {entityList} from './models/Entities';
import 'reflect-metadata';
import {createConnection, getConnection} from 'typeorm';
import {createAccounts} from './controllers/account';
import {createTestCases} from './controllers/testcase';
import {createResults} from './controllers/result';

export function connectToDb(withSync: boolean = false) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: entityList,
  })
    .then(() => {
      console.log('Connection to postgres created');
      if (withSync) {
        const conn = getConnection();
        conn
          .synchronize()
          .then(() => {
            console.log('models synchronized');
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // createData();
      }
    })
    .catch(error => console.log(error));
}

export async function seedTestData() {
  // create accounts
  const accounts = [
    {
      name: 'Jerry',
      email: 'jerbear@gmail.com',
      apiKey: 'jerrysapikey',
      password: 'jerryspass',
    },
    {
      name: 'Carl',
      email: 'badcarl@gmail.com',
      apiKey: 'carlsapikey',
      password: 'carlspass',
    },
    {
      name: 'Ted',
      email: 'teddybare@gmail.com',
      apiKey: 'tedsapikey',
      password: 'tedspass',
    },
  ];

  // create testcases
  const testcases = [
    {
      uid: 'uidTest1',
      name: 'testcase1',
      cosimulationStart: '2020-08-04T23:00:00.000Z',
      cosimulationEnd: '2020-08-04T23:00:00.000Z',
      controlStep: 'control1',
      priceScenario: 'pscene1',
      uncertaintyDist: 'uncertain1',
      buildingType: 'building-large',
    },
    {
      uid: 'uidTest2',
      name: 'testcase2',
      cosimulationStart: '2020-08-04T23:00:00.000Z',
      cosimulationEnd: '2020-08-04T23:00:00.000Z',
      controlStep: 'control2',
      priceScenario: 'pscene2',
      uncertaintyDist: 'uncertain2',
      buildingType: 'building-large',
    },
  ];

  // create results (which will associate the above and create kpis on the fly)
  const results = [
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result1',
      account: {
        apiKey: 'jerrysapikey',
      },
      kpi: {
        thermalDiscomfort: 6,
        energyUse: 5,
        cost: 100,
        emissions: 19,
        iaq: 43,
        timeRatio: 900,
      },
      testcase: {
        uid: 'uidTest1',
      },
    },
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result2',
      account: {
        apiKey: 'carlsapikey',
      },
      kpi: {
        thermalDiscomfort: 62,
        energyUse: 15,
        cost: 12,
        emissions: 11,
        iaq: 430,
        timeRatio: 1200,
      },
      testcase: {
        uid: 'uidTest2',
      },
      tags: {
        numStates: 6,
        controllerType: 'controller-big',
      },
    },
  ];

  return createAccounts(accounts)
    .then(res => createTestCases(testcases))
    .then(res => createResults(results));
}
