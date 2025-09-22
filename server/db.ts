import {getDocumentStore} from './datastore/documentStore';
import {createAccounts, getAccountByAPIKey} from './controllers/account';
import {createBuildingTypes} from './controllers/buildingTypes';
import {createResults} from './controllers/result';

export async function connectToDb(): Promise<void> {
  try {
    await getDocumentStore();
    console.log('Document store initialized');
  } catch (error) {
    console.error('Failed to initialize document store', error);
    throw error;
  }
}

export async function seedTestData(apiKey: string): Promise<void> {
  console.log('Starting seedTestData with API key:', apiKey);

  if (!apiKey) {
    throw new Error('API key is required');
  }

  const userAccount = await getAccountByAPIKey(apiKey).catch(() => null);
  if (!userAccount) {
    throw new Error(
      'Seed data requires a valid account for the provided API key. Log in once before calling /api/setup/db.'
    );
  }

  const readmeUrl =
    'https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md';

  const buildingTypes = [
    {
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

  const results = [
    {
      uid: 'result1',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: userAccount.apiKey,
      },
      tags: ['string1', 'string2', 'string3'],
      kpis: {
        cost_tot: 100,
        emis_tot: 19,
        ener_tot: 5,
        idis_tot: 43,
        tdis_tot: 6,
        time_rat: 900,
        pele_tot: 10.0,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0,
      },
      scenario: {
        timePeriod: 'cooling peak',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'deterministic',
      },
      buildingType: {
        uid: 'buildingType-1',
      },
    },
    {
      uid: 'result2',
      dateRun: '2020-08-05T12:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '180.0',
      account: {
        apiKey: userAccount.apiKey,
      },
      tags: ['demo', 'baseline'],
      kpis: {
        cost_tot: 110,
        emis_tot: 13,
        ener_tot: 8,
        idis_tot: 49,
        tdis_tot: 10,
        time_rat: 855,
        pele_tot: 12.5,
      },
      forecastParameters: {
        horizon: 43200.0,
        interval: 3600.0,
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
      uid: 'result3',
      dateRun: '2020-08-04T23:00:00.000Z',
      boptestVersion: '0.1.0',
      isShared: true,
      controlStep: '360.0',
      account: {
        apiKey: userAccount.apiKey,
      },
      tags: ['string1', 'string2', 'string3'],
      kpis: {
        cost_tot: 105,
        emis_tot: 22,
        ener_tot: 4,
        idis_tot: 37,
        tdis_tot: 3,
        time_rat: 915,
        pele_tot: 10.0,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0,
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
        apiKey: userAccount.apiKey,
      },
      tags: ['tags1', 'tags2', 'tags3'],
      kpis: {
        cost_tot: 95,
        emis_tot: 14,
        ener_tot: 7,
        idis_tot: 35,
        tdis_tot: 5,
        time_rat: 920,
        pele_tot: 10.0,
      },
      forecastParameters: {
        horizon: 21600.0,
        interval: 3600.0,
      },
      scenario: {
        timePeriod: 'heating peak',
        electricityPrice: 'dynamic',
        weatherForecastUncertainty: 'unknown',
      },
      buildingType: {
        uid: 'buildingType-2',
      },
    },
  ];

  const accounts = [
    {
      hashedIdentifier: 'demo-jerry',
      displayName: 'Jerry',
      apiKey: 'jerrysapikey',
      apiKeySalt: 'salt-1',
      shareAllResults: true,
      oauthProvider: 'google',
    },
  ];

  await connectToDb();
  await createAccounts(accounts);
  await createBuildingTypes(buildingTypes);

  const resultInsertions = await createResults(results);
  const rejected = resultInsertions.filter((entry: any) => entry.status === 'rejected');
  if (rejected.length > 0) {
    console.warn('Seed data encountered rejected result insertions:', rejected);
  } else {
    console.log('Seed data inserted demo results for account', userAccount.displayName);
  }
}
