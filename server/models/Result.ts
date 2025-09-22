import {DocumentRecord, JsonObject, JsonValue, getDocumentStore} from '../datastore/documentStore';

function toJsonValue(value: unknown): JsonValue {
  if (value === null) {
    return null;
  }
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return value;
    case "object":
      if (Array.isArray(value)) {
        return value.map(toJsonValue) as JsonValue;
      }
      return Object.entries(value as Record<string, unknown>)
        .reduce((acc, [key, val]) => {
          acc[key] = toJsonValue(val);
          return acc;
        }, {} as JsonObject);
    default:
      return null;
  }
}


export interface ResultDocument {
  uid: string;
  deleted: boolean;
  dateRun: string;
  boptestVersion: string;
  isShared: boolean;
  tags: string[];
  thermalDiscomfort: number;
  energyUse: number;
  cost: number;
  emissions: number;
  iaq: number;
  timeRatio: number;
  peakElectricity: number;
  peakGas?: number;
  peakDistrictHeating?: number;
  timePeriod: string;
  controlStep: string;
  electricityPrice: string;
  weatherForecastUncertainty: string;
  forecastParameters: JsonObject;
  scenario: JsonObject;
  accountId: number;
  buildingTypeId: number;
}

export type ResultData = Omit<ResultDocument, 'uid'> & { uid: string };

const COLLECTION = 'results';

function mapRecordToDocument(record: DocumentRecord<JsonObject>): ResultDocument {
  const data = record.data as unknown as ResultDocument;
  return {
    uid: data.uid,
    deleted: data.deleted,
    dateRun: data.dateRun,
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
    forecastParameters: data.forecastParameters,
    scenario: data.scenario,
    accountId: data.accountId,
    buildingTypeId: data.buildingTypeId,
  };
}

export async function createResult(data: ResultData): Promise<DocumentRecord<ResultDocument>> {
  const store = await getDocumentStore();

  const normalized: JsonObject = {
    uid: data.uid,
    deleted: data.deleted,
    dateRun: data.dateRun,
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
    peakGas: data.peakGas ?? null,
    peakDistrictHeating: data.peakDistrictHeating ?? null,
    timePeriod: data.timePeriod,
    controlStep: data.controlStep,
    electricityPrice: data.electricityPrice,
    weatherForecastUncertainty: data.weatherForecastUncertainty,
    forecastParameters: toJsonValue(data.forecastParameters),
    scenario: toJsonValue(data.scenario),
    accountId: data.accountId,
    buildingTypeId: data.buildingTypeId,
  };

  const existing = await store.findOneByField<JsonObject>(COLLECTION, 'uid', data.uid);
  if (existing) {
    const updated = await store.replace<JsonObject>(COLLECTION, existing.docId, normalized);
    return (updated ?? existing) as unknown as DocumentRecord<ResultDocument>;
  }

  const record = await store.insert<JsonObject>(COLLECTION, normalized);
  return record as unknown as DocumentRecord<ResultDocument>;
}

export async function findResultById(id: number): Promise<DocumentRecord<ResultDocument> | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  return record ? (record as unknown as DocumentRecord<ResultDocument>) : null;
}

export async function findResultByUid(uid: string): Promise<DocumentRecord<ResultDocument> | null> {
  const store = await getDocumentStore();
  const record = await store.findOneByField<JsonObject>(COLLECTION, 'uid', uid);
  return record ? (record as unknown as DocumentRecord<ResultDocument>) : null;
}

export async function listResults(): Promise<Array<DocumentRecord<ResultDocument>>> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records as unknown as Array<DocumentRecord<ResultDocument>>;
}

export async function findResultsByAccountId(accountId: number): Promise<Array<DocumentRecord<ResultDocument>>> {
  const store = await getDocumentStore();
  const records = await store.findManyByField<JsonObject>(COLLECTION, 'accountId', accountId);
  return records as unknown as Array<DocumentRecord<ResultDocument>>;
}

export async function replaceResult(record: DocumentRecord<ResultDocument>): Promise<DocumentRecord<ResultDocument>> {
  const store = await getDocumentStore();
  const normalized: JsonObject = {
    uid: record.data.uid,
    deleted: record.data.deleted,
    dateRun: record.data.dateRun,
    boptestVersion: record.data.boptestVersion,
    isShared: record.data.isShared,
    tags: record.data.tags,
    thermalDiscomfort: record.data.thermalDiscomfort,
    energyUse: record.data.energyUse,
    cost: record.data.cost,
    emissions: record.data.emissions,
    iaq: record.data.iaq,
    timeRatio: record.data.timeRatio,
    peakElectricity: record.data.peakElectricity,
    peakGas: record.data.peakGas ?? null,
    peakDistrictHeating: record.data.peakDistrictHeating ?? null,
    timePeriod: record.data.timePeriod,
    controlStep: record.data.controlStep,
    electricityPrice: record.data.electricityPrice,
    weatherForecastUncertainty: record.data.weatherForecastUncertainty,
    forecastParameters: toJsonValue(record.data.forecastParameters),
    scenario: toJsonValue(record.data.scenario),
    accountId: record.data.accountId,
    buildingTypeId: record.data.buildingTypeId,
  };

  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, normalized);
  if (!updated) {
    throw new Error(`Result with docId ${record.docId} not found`);
  }
  return updated as unknown as DocumentRecord<ResultDocument>;
}
