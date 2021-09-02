import {createConnection, getConnection} from 'typeorm';
import {createAccounts} from './controllers/account';
import {createBuildingTypes} from './controllers/buildingTypes';
import {createResults} from './controllers/result';
import {entityList} from './models/Entities';

export function connectToDb(withSync: boolean = false) {
  createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: entityList
  })
    .then(() => {
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

export async function seedTestData(apiKey: string) {
  // create accounts
  const accounts = [
    {
      name: 'Jerry',
      email: 'jerbear@gmail.com',
      apiKey: 'jerrysapikey',
    },
    {
      name: 'Carl',
      email: 'badcarl@gmail.com',
      apiKey: 'carlsapikey',
    },
    {
      name: 'Ted',
      email: 'teddybare@gmail.com',
      apiKey: 'tedsapikey',
    },
  ];

  const readmeUrl =
    'https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md';

  // create buildingTypes
  const buildingTypes = [
    {
      id: '1',
      uid: 'buildingType-1',
      name: 'BIG building',
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
    },
    {
      id: '2',
      uid: 'buildingType-2',
      name: 'small building',
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
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
      thermalDiscomfort: 6,
      energyUse: 5,
      cost: 100,
      emissions: 19,
      iaq: 43,
      timeRatio: 900,
      testTimePeriod: 'Summer',
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerProperties: {
        controllerType: 'controllerType1',
        problemFormulation: 'problem1',
        modelType: 'modelType1',
        numStates: 15,
        predictionHorizon: 700,
      },
      buildingType: buildingTypes[0],
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
      testTimePeriod: 'Winter',
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerProperties: {
        controllerType: 'controllerType2',
        problemFormulation: 'problem2',
        modelType: 'modelType2',
        numStates: 25,
        predictionHorizon: 8000,
      },
      buildingType: buildingTypes[1],
    },
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result3',
      account: {
        apiKey: apiKey,
      },
      thermalDiscomfort: 72,
      energyUse: 25,
      cost: 15,
      emissions: 12,
      iaq: 450,
      timeRatio: 1250,
      testTimePeriod: 'Winter',
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerProperties: {
        controllerType: 'controllerType3',
        problemFormulation: 'problem3',
        modelType: 'modelType3',
        numStates: 22,
        predictionHorizon: 8500,
      },
      buildingType: buildingTypes[1],
    },
    {
      dateRun: '2020-08-04T23:00:00.000Z',
      isShared: true,
      uid: 'result4',
      account: {
        apiKey: apiKey,
      },
      thermalDiscomfort: 78,
      energyUse: 27,
      cost: 19,
      emissions: 16,
      iaq: 454,
      timeRatio: 1450,
      testTimePeriod: 'Winter',
      controlStep: 'controlStep',
      priceScenario: 'priceScenario',
      weatherForecastUncertainty: 'forecast-unknown',
      controllerProperties: {
        controllerType: 'controllerType3',
        problemFormulation: 'problem3',
        modelType: 'modelType3',
        numStates: 24,
        predictionHorizon: 8525,
      },
      buildingType: buildingTypes[1],
    },
  ];

  return createAccounts(accounts)
    .finally(() => createBuildingTypes(buildingTypes))
    .finally(() => createResults(results));
}