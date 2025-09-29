import {getDocumentStore} from './datastore/documentStore';
import {createAccounts, getAccountByAPIKey} from './controllers/account';
import {createResults} from './controllers/result';

interface SeedAccountConfig {
  alias: string;
  hashedIdentifier: string;
  displayName: string;
  apiKey: string;
  apiKeySalt: string;
  shareAllResults: boolean | null;
  oauthProvider: string;
}

interface SeedAccountInfo {
  alias: string;
  apiKey: string;
  shareAllResults: boolean | null;
}

interface SeedBuildingType {
  uid: string;
  name: string;
  scenarios: {
    timePeriod: string[];
    electricityPrice: string[];
    temperature_uncertainty: string[];
    solar_uncertainty: string[];
  };
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomInt(seed: number, min: number, max: number): number {
  const value = pseudoRandom(seed);
  return Math.floor(value * (max - min + 1)) + min;
}

function pickFrom<T>(seed: number, values: T[]): T {
  const index = randomInt(seed, 0, values.length - 1);
  return values[index];
}

function buildTags(seed: number, tagPool: string[]): string[] {
  const tags = new Set<string>();
  const tagCount = randomInt(seed, 2, 4);
  for (let i = 0; i < tagPool.length && tags.size < tagCount; i++) {
    tags.add(pickFrom(seed + i, tagPool));
  }
  return Array.from(tags);
}

function generateSeedResults(
  total: number,
  accountPool: SeedAccountInfo[],
  buildingTypes: SeedBuildingType[],
  userAccount: SeedAccountInfo
) {
  const results: any[] = [];
  const tagPool = [
    'baseline',
    'optimized',
    'comfort',
    'hvac',
    'weekend',
    'night',
    'dr-event',
    'preheat',
    'simulation',
    'v1',
  ];
  const controlSteps = ['180.0', '300.0', '360.0', '600.0'];
  const baseDate = new Date('2024-01-01T00:00:00.000Z').getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const combinedAccounts = [userAccount, ...accountPool];

  for (let index = 0; index < total; index++) {
    const seed = index + 1;
    const account = combinedAccounts[index % combinedAccounts.length];
    const buildingType = pickFrom(seed + 5, buildingTypes);
    const temperatureOptions = buildingType.scenarios.temperature_uncertainty;
    const solarOptions = buildingType.scenarios.solar_uncertainty;

    const scenario = {
      timePeriod: pickFrom(seed + 10, buildingType.scenarios.timePeriod),
      electricityPrice: pickFrom(seed + 11, buildingType.scenarios.electricityPrice),
      temperature_uncertainty: pickFrom(seed + 12, temperatureOptions),
      solar_uncertainty: pickFrom(seed + 13, solarOptions),
      seed: randomInt(seed + 14, 1, 50),
    };

    const baseEnergy = randomInt(seed + 15, 40, 120) / 10;
    const energySpread = randomInt(seed + 16, -10, 10) / 10;
    const thermal = randomInt(seed + 17, 30, 120) / 10;
    const emissions = randomInt(seed + 18, 10, 40);
    const cost = randomInt(seed + 19, 60, 180);
    const timeRatio = randomInt(seed + 20, 700, 1100);
    const peakElectricity = randomInt(seed + 21, 5, 20);
    const peakGas = randomInt(seed + 22, 0, 10);
    const peakDistrictHeating = randomInt(seed + 23, 0, 8);

    const isShared = account.shareAllResults === true
      ? true
      : pseudoRandom(seed + 24) > 0.35;

    const runDate = new Date(
      baseDate + index * dayMs + randomInt(seed + 25, 0, 12) * 60 * 60 * 1000
    ).toISOString();

    results.push({
      uid: `seed-${account.alias}-${seed}`,
      dateRun: runDate,
      boptestVersion: `0.${randomInt(seed + 26, 1, 3)}.${randomInt(seed + 27, 0, 9)}`,
      isShared,
      controlStep: pickFrom(seed + 28, controlSteps),
      account: {
        apiKey: account.apiKey,
      },
      tags: buildTags(seed + 29, tagPool),
      kpis: {
        cost_tot: cost,
        emis_tot: emissions,
        ener_tot: Number((baseEnergy + energySpread).toFixed(2)),
        idis_tot: randomInt(seed + 30, 20, 80),
        tdis_tot: Number(thermal.toFixed(2)),
        time_rat: timeRatio,
        pele_tot: Number((peakElectricity + pseudoRandom(seed + 31)).toFixed(2)),
        pgas_tot: peakGas === 0 ? null : Number((peakGas / 2).toFixed(2)),
        pdih_tot:
          peakDistrictHeating === 0
            ? null
            : Number((peakDistrictHeating / 2).toFixed(2)),
      },
      scenario,
      buildingType: {
        uid: buildingType.uid,
        name: buildingType.name,
      },
    });
  }

  return results;
}

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

  const buildingTypes: SeedBuildingType[] = [
    {
      uid: 'buildingType-1',
      name: 'BIG building',
      scenarios: {
        timePeriod: ['cooling peak', 'heating peak'],
        electricityPrice: ['constant', 'dynamic', 'highly dynamic'],
        temperature_uncertainty: ['low', 'medium', 'high', 'none'],
        solar_uncertainty: ['low', 'medium', 'high', 'none'],
      },
    },
    {
      uid: 'buildingType-2',
      name: 'small building',
      scenarios: {
        timePeriod: ['heating peak', 'heating typical'],
        electricityPrice: ['constant', 'dynamic'],
        temperature_uncertainty: ['low', 'medium', 'none'],
        solar_uncertainty: ['low', 'medium', 'high', 'none'],
      },
    },
  ];
  const seededAccounts: SeedAccountConfig[] = [
    {
      alias: 'grid-squad',
      hashedIdentifier: 'seed-grid-squad',
      displayName: 'Grid Squad',
      apiKey: 'grid-squad-key',
      apiKeySalt: 'seed-salt-1',
      shareAllResults: true,
      oauthProvider: 'seed',
    },
    {
      alias: 'comfort-co',
      hashedIdentifier: 'seed-comfort-co',
      displayName: 'Comfort Co',
      apiKey: 'comfort-co-key',
      apiKeySalt: 'seed-salt-2',
      shareAllResults: false,
      oauthProvider: 'seed',
    },
    {
      alias: 'peak-patrol',
      hashedIdentifier: 'seed-peak-patrol',
      displayName: 'Peak Patrol',
      apiKey: 'peak-patrol-key',
      apiKeySalt: 'seed-salt-3',
      shareAllResults: null,
      oauthProvider: 'seed',
    },
    {
      alias: 'jerry',
      hashedIdentifier: 'demo-jerry',
      displayName: 'Jerry',
      apiKey: 'jerrysapikey',
      apiKeySalt: 'salt-1',
      shareAllResults: true,
      oauthProvider: 'google',
    },
  ];

  const accounts = seededAccounts.map(account => ({
    hashedIdentifier: account.hashedIdentifier,
    displayName: account.displayName,
    apiKey: account.apiKey,
    apiKeySalt: account.apiKeySalt,
    shareAllResults: account.shareAllResults,
    oauthProvider: account.oauthProvider,
  }));

  await connectToDb();
  await createAccounts(accounts);

  const accountPool: SeedAccountInfo[] = seededAccounts
    .filter(account => account.apiKey !== userAccount.apiKey)
    .map(account => ({
      alias: account.alias,
      apiKey: account.apiKey,
      shareAllResults: account.shareAllResults,
    }));

  const generatedResults = generateSeedResults(
    160,
    accountPool,
    buildingTypes,
    {
      alias: 'primary-user',
      apiKey: userAccount.apiKey,
      shareAllResults: (userAccount.shareAllResults as boolean | null) ?? null,
    }
  );

  const resultInsertions = await createResults(generatedResults);
  const rejected = resultInsertions.filter((entry: any) => entry.status === 'rejected');
  if (rejected.length > 0) {
    console.warn('Seed data encountered rejected result insertions:', rejected);
  } else {
    console.log('Seed data inserted demo results for account', userAccount.displayName);
    console.log(`Generated ${generatedResults.length} synthetic results across ${accountPool.length + 1} accounts.`);
  }
}
