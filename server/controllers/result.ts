import {
  SignatureDetails,
  Result,
  Scenario,
  Scenarios,
  Account,
  BuildingType,
} from '../../common/interfaces';
import {
  getBuildingTypeByUid,
  findBuildingTypesByIds,
} from '../models/BuildingType';
import {
  findAccountById,
  findAccountsByIds,
} from '../models/Account';
import {getAccountByAPIKey} from './account';
import {
  createResult,
  listResults,
  findResultsByAccountId,
  findResultById,
  findResultByUid,
  replaceResult,
  ResultDocument,
} from '../models/Result';
import {upsertResultFacet} from '../models/ResultFacet';
import {DocumentRecord, JsonObject} from '../datastore/documentStore';

function jsonObjectToPlain(value: JsonObject): Record<string, any> {
  return value as unknown as Record<string, any>;
}

function toJsonObject(value: any): JsonObject {
  if (value && typeof value === 'object') {
    return value as JsonObject;
  }
  return {};
}


function sanitizeAccountForResult(account: Account): Account {
  return {
    ...account,
    apiKey: '',
    apiKeySalt: '',
    results: [],
  };
}

function sanitizeBuildingType(buildingType: BuildingType): BuildingType {
  return {
    ...buildingType,
    results: [],
  };
}

function toResult(
  record: DocumentRecord<ResultDocument>,
  account: Account,
  buildingType: BuildingType
): Result {
  const data = record.data;
  return {
    id: record.numericId,
    uid: data.uid,
    deleted: data.deleted,
    dateRun: new Date(data.dateRun),
    boptestVersion: data.boptestVersion,
    isShared: data.isShared,
    tags: data.tags,
    thermalDiscomfort: data.thermalDiscomfort,
    energyUse: data.energyUse,
    cost: data.cost,
    emissions: data.emissions,
    iaq: data.iaq,
    timeRatio: data.timeRatio,
    peakElectricity: data.peakElectricity,
    peakGas: data.peakGas,
    peakDistrictHeating: data.peakDistrictHeating,
    timePeriod: data.timePeriod,
    controlStep: data.controlStep,
    electricityPrice: data.electricityPrice,
    weatherForecastUncertainty: data.weatherForecastUncertainty,
    forecastParameters: jsonObjectToPlain(data.forecastParameters),
    scenario: jsonObjectToPlain(data.scenario),
    account: sanitizeAccountForResult(account),
    buildingType: sanitizeBuildingType(buildingType),
  };
}

async function hydrateResults(
  records: Array<DocumentRecord<ResultDocument>>
): Promise<Result[]> {
  if (records.length === 0) {
    return [];
  }

  const accountIds = Array.from(new Set(records.map(r => r.data.accountId)));
  const buildingIds = Array.from(new Set(records.map(r => r.data.buildingTypeId)));

  const [accounts, buildingTypes] = await Promise.all([
    findAccountsByIds(accountIds),
    findBuildingTypesByIds(buildingIds),
  ]);

  const accountMap = new Map(accounts.map(account => [account.id, account]));
  const buildingMap = new Map(buildingTypes.map(bt => [bt.id, bt]));

  const hydrated: Result[] = [];

  records.forEach(record => {
    const account = accountMap.get(record.data.accountId);
    if (!account) {
      console.warn(
        `Skipping result ${record.data.uid}: missing account ${record.data.accountId}`
      );
      return;
    }

    const buildingType = buildingMap.get(record.data.buildingTypeId);
    if (!buildingType) {
      console.warn(
        `Skipping result ${record.data.uid}: missing building type ${record.data.buildingTypeId}`
      );
      return;
    }

    hydrated.push(toResult(record, account, buildingType));
  });

  return hydrated;
}

function sanitizeSharedResult(result: Result): Result {
  const account: any = {...result.account};
  delete account.apiKey;
  delete account.apiKeySalt;
  delete account.shareAllResults;
  delete account.results;
  delete account.id;

  const buildingType: any = {...result.buildingType};
  delete buildingType.results;
  delete buildingType.markdown;
  delete buildingType.markdownURL;
  delete buildingType.pdfURL;

  return {
    ...result,
    account: account as Account,
    buildingType: buildingType as BuildingType,
  };
}

export async function getResults(): Promise<Result[]> {
  const records = await listResults();
  const active = records.filter(record => !record.data.deleted);
  return hydrateResults(active);
}

export async function getAllSharedResults(): Promise<Result[]> {
  const records = await listResults();
  const active = records.filter(record => !record.data.deleted);
  const hydrated = await hydrateResults(active);

  const filtered = hydrated.filter(result => {
    const shareAll = result.account.shareAllResults;
    if (shareAll === true) {
      return true;
    }
    return result.isShared;
  });

  return filtered.map(sanitizeSharedResult);
}

export async function getAllResultsForUser(userId: string): Promise<Result[]> {
  const accountId = parseInt(userId, 10);
  if (Number.isNaN(accountId)) {
    throw new Error('Invalid user ID');
  }

  const account = await findAccountById(accountId);
  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  const records = await findResultsByAccountId(accountId);
  const active = records.filter(record => !record.data.deleted);

  return hydrateResults(active);
}

function validateScenario(
  buildingType: BuildingType,
  scenario: Scenario,
  resultUid: string
): void {
  const buildingScenarios: Scenarios = {...(buildingType.scenarios as any)};
  const scenarioCopy: Scenario = {...scenario};

  for (const key in scenarioCopy) {
    if (!buildingScenarios[key] || !buildingScenarios[key].includes(scenarioCopy[key])) {
      throw {
        message: `Invalid Data: Result (${resultUid}) tried to use scenario type: "${key}" with value: "${scenarioCopy[key]}" for building type: "${buildingType.name}"`,
        data: scenario,
      };
    }
  }
}

function buildResultDocument(result: any, account: Account, buildingType: BuildingType): ResultDocument {
  return {
    uid: result.uid,
    deleted: false,
    dateRun: new Date(result.dateRun).toISOString(),
    boptestVersion: result.boptestVersion,
    isShared: result.isShared,
    tags: result.tags || [],
    thermalDiscomfort: result.kpis.tdis_tot,
    energyUse: result.kpis.ener_tot,
    cost: result.kpis.cost_tot,
    emissions: result.kpis.emis_tot,
    iaq: result.kpis.idis_tot,
    timeRatio: result.kpis.time_rat,
    peakElectricity: result.kpis.pele_tot,
    peakGas: result.kpis.pgas_tot,
    peakDistrictHeating: result.kpis.pdih_tot,
    timePeriod: result.scenario.timePeriod,
    controlStep: result.controlStep,
    electricityPrice: result.scenario.electricityPrice,
    weatherForecastUncertainty: result.scenario.weatherForecastUncertainty,
    forecastParameters: toJsonObject(result.forecastParameters),
    scenario: toJsonObject(result.scenario),
    accountId: account.id,
    buildingTypeId: buildingType.id,
  };
}

async function createResultAndAssociatedModels(result: any) {
  const account = await getAccountByAPIKey(result.account.apiKey);
  const buildingType = await getBuildingTypeByUid(result.buildingType.uid);

  validateScenario(buildingType, result.scenario, result.uid);

  const document = buildResultDocument(result, account, buildingType);
  await createResult(document);

  const scenarioValues: Record<string, string[]> = {};
  if (result.scenario && typeof result.scenario === 'object') {
    for (const key of Object.keys(result.scenario)) {
      const value = result.scenario[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          scenarioValues[key] = value
            .filter(item => item !== undefined && item !== null)
            .map(item => String(item));
        } else {
          scenarioValues[key] = [String(value)];
        }
      }
    }
  }

  await upsertResultFacet(
    buildingType.uid,
    buildingType.name,
    scenarioValues,
    Array.isArray(result.tags) ? result.tags.map((tag: any) => String(tag)) : []
  );
}

export async function createResults(results: any[]): Promise<PromiseSettledResult<void>[]> {
  return Promise.allSettled(
    results.map(async (result: any) => {
      await createResultAndAssociatedModels(result);
    })
  );
}

export async function toggleShared(id: number, share: boolean, sessionId: number): Promise<void> {
  const record = await findResultById(id);
  if (!record) {
    throw new Error('Result not found');
  }

  if (record.data.accountId !== sessionId) {
    throw new Error('Not authorized');
  }

  record.data.isShared = share;
  await replaceResult(record);
}

function stableStringify(value: any): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map(key => `"${key}":${stableStringify(value[key])}`);
  return `{${entries.join(',')}}`;
}

export async function getSignatureDetailsForResult(id: string): Promise<SignatureDetails> {
  const targetRecord = await findResultByUid(id);
  if (!targetRecord) {
    throw new Error(`Result with uid ${id} not found`);
  }

  const records = await listResults();
  const targetSignature = stableStringify(targetRecord.data.scenario);
  const matching = records.filter(record => stableStringify(record.data.scenario) === targetSignature);

  const hydratedResults = await hydrateResults(matching);
  const targetResult = hydratedResults.find(result => result.uid === id);

  if (!targetResult) {
    throw new Error(`Hydrated result with uid ${id} not found`);
  }

  return getKPIRanges(hydratedResults, targetResult);
}

function getKPIRanges(results: Result[], result: Result): SignatureDetails {
  let tdMin = result.thermalDiscomfort;
  let tdMax = result.thermalDiscomfort;

  let energyMin = result.energyUse;
  let energyMax = result.energyUse;

  let costMin = result.cost;
  let costMax = result.cost;

  let emissionsMin = result.emissions;
  let emissionsMax = result.emissions;

  let iaqMin = result.iaq;
  let iaqMax = result.iaq;

  let timeMin = result.timeRatio;
  let timeMax = result.timeRatio;

  let peakElectricityMin = result.peakElectricity;
  let peakElectricityMax = result.peakElectricity;

  let peakGasMin = result.peakGas || 0.0;
  let peakGasMax = result.peakGas || 0.0;

  let peakDistrictHeatingMin = result.peakDistrictHeating || 0.0;
  let peakDistrictHeatingMax = result.peakDistrictHeating || 0.0;

  results.forEach(res => {
    if (res.thermalDiscomfort < tdMin) {
      tdMin = res.thermalDiscomfort;
    }

    if (res.thermalDiscomfort > tdMax) {
      tdMax = res.thermalDiscomfort;
    }

    if (res.energyUse < energyMin) {
      energyMin = res.energyUse;
    }

    if (res.energyUse > energyMax) {
      energyMax = res.energyUse;
    }

    if (res.cost < costMin) {
      costMin = res.cost;
    }

    if (res.cost > costMax) {
      costMax = res.cost;
    }

    if (res.emissions < emissionsMin) {
      emissionsMin = res.emissions;
    }

    if (res.emissions > emissionsMax) {
      emissionsMax = res.emissions;
    }

    if (res.iaq < iaqMin) {
      iaqMin = res.iaq;
    }

    if (res.iaq > iaqMax) {
      iaqMax = res.iaq;
    }

    if (res.timeRatio < timeMin) {
      timeMin = res.timeRatio;
    }

    if (res.timeRatio > timeMax) {
      timeMax = res.timeRatio;
    }

    if (res.peakElectricity < peakElectricityMin) {
      peakElectricityMin = res.peakElectricity;
    }

    if (res.peakElectricity > peakElectricityMax) {
      peakElectricityMax = res.peakElectricity;
    }

    if (res.peakGas && res.peakGas < peakGasMin) {
      peakGasMin = res.peakGas;
    }

    if (res.peakGas && res.peakGas > peakGasMax) {
      peakGasMax = res.peakGas;
    }

    if (res.peakDistrictHeating && res.peakDistrictHeating < peakDistrictHeatingMin) {
      peakDistrictHeatingMin = res.peakDistrictHeating;
    }

    if (res.peakDistrictHeating && res.peakDistrictHeating > peakDistrictHeatingMax) {
      peakDistrictHeatingMax = res.peakDistrictHeating;
    }
  });

  return {
    numResults: results.length,
    thermalDiscomfort: {
      min: tdMin,
      max: tdMax,
    },
    energyUse: {
      min: energyMin,
      max: energyMax,
    },
    cost: {
      min: costMin,
      max: costMax,
    },
    emissions: {
      min: emissionsMin,
      max: emissionsMax,
    },
    iaq: {
      min: iaqMin,
      max: iaqMax,
    },
    timeRatio: {
      min: timeMin,
      max: timeMax,
    },
    peakElectricity: {
      min: peakElectricityMin,
      max: peakElectricityMax,
    },
    peakGas: {
      min: peakGasMin,
      max: peakGasMax,
    },
    peakDistrictHeating: {
      min: peakDistrictHeatingMin,
      max: peakDistrictHeatingMax,
    },
  };
}
