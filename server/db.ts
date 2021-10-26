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
      scenarios: {
        validTimePeriods: ['cooling peak', 'heating peak'],
        validElectricityPrices: ['constant', 'dynamic', 'highly dynamic'],
        validWeatherForecastUncertainties: ['deterministic'],
      },
    },
    {
      id: '2',
      uid: 'buildingType-2',
      name: 'small building',
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
      scenarios: {
        validTimePeriods: ['heating peak', 'heating typical'],
        validElectricityPrices: ['constant', 'dynamic'],
        validWeatherForecastUncertainties: ['deterministic', 'unknown'],
      },
    },// apiKey
  ];

  // create results (which will associate the above and create kpis on the fly)
  const results = [
    {
      uid: 'result1',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0', // number
      account: {
        apiKey: 'jerrysapikey',
      },
      kpis: {
        cost_tot: 100,  // cost
        emis_tot: 19,   // emissions
        ener_tot: 5,    // energyUse
        idis_tot: 43,   // iaq
        tdis_tot: 6,    // thermalDiscomfort
        time_rat: 900,  // timeRatio
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'deterministic',
      },
      // testcase with id
      // testcase: {
        // id: "bestest_air"
      //}
      // buildingType: buildingTypes[0],
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result2',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: 'carlsapikey',
      },
      kpis: {
        cost_tot: 12,
        emis_tot: 11,
        ener_tot: 15,
        idis_tot: 430,
        tdis_tot: 62,
        time_rat: 1200,
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'unknown',
      },
      // buildingType: buildingTypes[1],
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result3',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      kpis: {
        cost_tot: 15,
        emis_tot: 12,
        ener_tot: 25,
        idis_tot: 450,
        tdis_tot: 72,
        time_rat: 1250,
      },
      scenario: {
        timePeriod: 'heating typical',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      // buildingType: buildingTypes[1],
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result4',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      kpis: {
        cost_tot: 19,
        emis_tot: 16,
        ener_tot: 27,
        idis_tot: 454,
        tdis_tot: 78,
        time_rat: 1450,
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'highly dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      // buildingType: buildingTypes[0],
      buildingType: {
        uid: 'buildingType-1',
      },
    },
  ];

  return createAccounts(accounts)
    .finally(() => createBuildingTypes(buildingTypes))
    .finally(() => createResults(results));
}