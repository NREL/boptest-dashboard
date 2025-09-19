import {DocumentRecord, JsonObject, getDocumentStore} from '../datastore/documentStore';

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
  const data = record.data as ResultDocument;
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
  const existing = await store.findOneByField<JsonObject>(COLLECTION, 'uid', data.uid);
  if (existing) {
    return existing as DocumentRecord<ResultDocument>;
  }

  const record = await store.insert<JsonObject>(COLLECTION, data);
  return record as DocumentRecord<ResultDocument>;
}

export async function findResultById(id: number): Promise<DocumentRecord<ResultDocument> | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  return record ? (record as DocumentRecord<ResultDocument>) : null;
}

export async function findResultByUid(uid: string): Promise<DocumentRecord<ResultDocument> | null> {
  const store = await getDocumentStore();
  const record = await store.findOneByField<JsonObject>(COLLECTION, 'uid', uid);
  return record ? (record as DocumentRecord<ResultDocument>) : null;
}

export async function listResults(): Promise<Array<DocumentRecord<ResultDocument>>> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records as Array<DocumentRecord<ResultDocument>>;
}

export async function findResultsByAccountId(accountId: number): Promise<Array<DocumentRecord<ResultDocument>>> {
  const store = await getDocumentStore();
  const records = await store.findManyByField<JsonObject>(COLLECTION, 'accountId', accountId);
  return records as Array<DocumentRecord<ResultDocument>>;
}

export async function replaceResult(record: DocumentRecord<ResultDocument>): Promise<DocumentRecord<ResultDocument>> {
  const store = await getDocumentStore();
  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, record.data);
  if (!updated) {
    throw new Error(`Result with docId ${record.docId} not found`);
  }
  return updated as DocumentRecord<ResultDocument>;
}
