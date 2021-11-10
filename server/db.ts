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
        timePeriod: ['cooling peak', 'heating peak'],
        electricityPrice: ['constant', 'dynamic', 'highly dynamic'],
        weatherForecastUncertainty: ['deterministic'],
      },
    },
    {
      id: '2',
      uid: 'buildingType-2',
      name: 'small building',
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
      scenarios: {
        timePeriod: ['heating peak', 'heating typical'],
        electricityPrice: ['constant', 'dynamic'],
        weatherForecastUncertainty: ['deterministic', 'unknown'],
      },
    },
  ];

  // create results (which will associate the above and create kpis on the fly)
  const results = [
    {
      uid: 'result1',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: 'jerrysapikey',
      },
      tags: [
        'string1',
        'string2',
        'string3'
      ],
      kpis: {
        cost_tot: 100,  // cost
        emis_tot: 19,   // emissions
        ener_tot: 5,    // energyUse
        idis_tot: 43,   // iaq
        tdis_tot: 6,    // thermalDiscomfort
        time_rat: 900,  // timeRatio
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'deterministic',
      },
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
        apiKey: apiKey,
      },
      tags: [
        'tags1',
        'tags2',
        'tags3'
      ],
      kpis: {
        cost_tot: 110,
        emis_tot: 13,
        ener_tot: 8,
        idis_tot: 49,
        tdis_tot: 10,
        time_rat: 855,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
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
      tags: [
        'string1',
        'string2',
        'string3'
      ],
      kpis: {
        cost_tot: 105,
        emis_tot: 22,
        ener_tot: 4,
        idis_tot: 37,
        tdis_tot: 3,
        time_rat: 915,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
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
      tags: [
        'tags1',
        'tags2',
        'tags3'
      ],
      kpis: {
        cost_tot: 95,
        emis_tot: 14,
        ener_tot: 7,
        idis_tot: 50,
        tdis_tot: 7,
        time_rat: 925,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result5',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'string1',
        'string2',
        'string3'
      ],
      kpis: {
        cost_tot: 19,
        emis_tot: 16,
        ener_tot: 27,
        idis_tot: 454,
        tdis_tot: 78,
        time_rat: 1450,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'highly dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result6',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'other1',
        'other2',
        'other3'
      ],
      kpis: {
        cost_tot: 23,
        emis_tot: 19,
        ener_tot: 20,
        idis_tot: 400,
        tdis_tot: 72,
        time_rat: 1350,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'highly dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result7',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'string1',
        'tag2',
        'other1'
      ],
      kpis: {
        cost_tot: 21,
        emis_tot: 12,
        ener_tot: 22,
        idis_tot: 434,
        tdis_tot: 65,
        time_rat: 1400,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'highly dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result8',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: 'carlsapikey',
      },
      tags: [
        'string1',
        'string2',
        'string3'
      ],
      kpis: {
        cost_tot: 15,
        emis_tot: 13,
        ener_tot: 18,
        idis_tot: 435,
        tdis_tot: 69,
        time_rat: 1250,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'unknown',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result9',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'tags1',
        'tags2',
        'tags3'
      ],
      kpis: {
        cost_tot: 10,
        emis_tot: 10,
        ener_tot: 10,
        idis_tot: 400,
        tdis_tot: 60,
        time_rat: 1250,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'unknown',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result10',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'tags1',
        'kpi2',
        'other3',
        'string1',
        'info2'
      ],
      kpis: {
        cost_tot: 9,
        emis_tot: 8,
        ener_tot: 12,
        idis_tot: 420,
        tdis_tot: 52,
        time_rat: 1100,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'unknown',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result11',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'tags1',
        'tags2',
        'tags3'
      ],
      kpis: {
        cost_tot: 5,
        emis_tot: 6,
        ener_tot: 7,
        idis_tot: 330,
        tdis_tot: 55,
        time_rat: 1270,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'constant',
        weatherForecastUncertainty: 'unknown',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result12',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'info1',
        'info2',
        'info3'
      ],
      kpis: {
        cost_tot: 15,
        emis_tot: 12,
        ener_tot: 25,
        idis_tot: 450,
        tdis_tot: 72,
        time_rat: 1250,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating typical',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result13',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'other1',
        'other2',
        'other3'
      ],
      kpis: {
        cost_tot: 22,
        emis_tot: 23,
        ener_tot: 23,
        idis_tot: 410,
        tdis_tot: 78,
        time_rat: 1150,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating typical',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
    {
      uid: 'result14',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: apiKey,
      },
      tags: [
        'kpi1',
        'kpi2',
        'kpi3'
      ],
      kpis: {
        cost_tot: 11,
        emis_tot: 11,
        ener_tot: 11,
        idis_tot: 110,
        tdis_tot: 11,
        time_rat: 1110,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0
      },
      scenario: {
        timePeriod: 'heating typical',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
  ];

  return createAccounts(accounts)
    .finally(() => createBuildingTypes(buildingTypes))
    .finally(() => createResults(results));
}