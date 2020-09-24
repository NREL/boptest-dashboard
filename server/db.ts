import {createConnection, getConnection} from 'typeorm';
import {createAccounts} from './controllers/account';
import {createBuildingTypes} from './controllers/buildingTypes';
import {createResults} from './controllers/result';
import {entityList} from './models/Entities';

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

  // create buildingTypes
  const buildingTypes = [
    {
      id: 'buildingType-1',
      uid: 'buildingType-1',
      name: 'BIG building',
      parsedHTML: '<html></html>',
      detailsURL: 'bigbuilding.com',
    },
    {
      id: 'buildingType-2',
      uid: 'buildingType-2',
      name: 'small building',
      parsedHTML: '<html></html>',
      detailsURL: 'smallbuilding.com',
    },
  ];

  // // Building Type stuff (formerly testcase stuff)
  // testTimePeriodStart: Date;
  // testTimePeriodEnd: Date;
  // controlStep: string;
  // priceScenario: string;
  // weatherForecastUncertainty: string;

  // // Controller Type stuff
  // controllerType: string;
  // problemFormulation: string;
  // modelType: string;
  // numStates: number;
  // predictionHorizon: number;

  // account: Account;
  // buildingtype: BuildingType;

  // create results (which will associate the above and create kpis on the fly)
  // need to update results to abide by the building types changes instead of testcases
  const results = [
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result1',
      account: {
        apiKey: 'jerrysapikey',
      },
      thermalDiscomfort: 6,
      energyUse: 5,
      cost: 100,
      emissions: 19,
      iaq: 43,
      timeRatio: 900,
      testcase: {
        uid: 'uidTest1',
      },
      tags: {},
      testTimePeriodStart: new Date(),
      testTimePeriodEnd: new Date(),
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerType: 'controllerType1',
      problemFormulation: 'problem1',
      modelType: 'modelType1',
      numStates: 15,
      predictionHorizon: 700,
    },
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result2',
      account: {
        apiKey: 'carlsapikey',
      },
      thermalDiscomfort: 62,
      energyUse: 15,
      cost: 12,
      emissions: 11,
      iaq: 430,
      timeRatio: 1200,
      testcase: {
        uid: 'uidTest2',
      },
      tags: {},
      testTimePeriodStart: new Date(),
      testTimePeriodEnd: new Date(),
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerType: 'controllerType2',
      problemFormulation: 'problem2',
      modelType: 'modelType2',
      numStates: 25,
      predictionHorizon: 8000,
    },
  ];

  return createAccounts(accounts)
    .then(res => createBuildingTypes(buildingTypes))
    .then(res => createResults(results));
}
