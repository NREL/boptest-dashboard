import axios from 'axios';

import {BuildingType} from '../../common/interfaces';
import {DocumentRecord, JsonObject, getDocumentStore} from '../datastore/documentStore';

export type BuildingTypeData = Omit<BuildingType, 'id' | 'results'>;

const COLLECTION = 'buildingTypes';

function mapRecordToBuildingType(record: DocumentRecord<JsonObject>): BuildingType {
  const data = record.data as unknown as BuildingTypeData;
  return {
    id: record.numericId,
    uid: data.uid,
    name: data.name,
    markdown: data.markdown ?? null,
    markdownURL: data.markdownURL,
    pdfURL: data.pdfURL,
    scenarios: data.scenarios,
    results: [],
  };
}

async function fetchMarkdown(markdownURL: string): Promise<string | null> {
  try {
    const response = await axios.get(markdownURL);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch markdown from ${markdownURL}`, error);
    return null;
  }
}

export async function createBuildingType(data: BuildingTypeData): Promise<BuildingType> {
  const store = await getDocumentStore();
  const existing = await store.findOneByField<JsonObject>(COLLECTION, 'uid', data.uid);
  if (existing) {
    throw new Error(`Building type already exists for uid ${data.uid}`);
  }

  const markdown = await fetchMarkdown(data.markdownURL);

  const payload: JsonObject = {
    uid: data.uid,
    name: data.name,
    markdown: markdown ?? null,
    markdownURL: data.markdownURL,
    pdfURL: data.pdfURL,
    scenarios: (data.scenarios || {}) as unknown as JsonObject,
  };

  const record = await store.insert<JsonObject>(COLLECTION, payload);

  return mapRecordToBuildingType(record);
}

export async function updateBuildingType(
  building: BuildingType,
  newData: BuildingTypeData
): Promise<BuildingType> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, building.id);
  if (!record) {
    throw new Error(`Building type with id ${building.id} not found`);
  }

  const markdown = await fetchMarkdown(newData.markdownURL);
  const updatedPayload: JsonObject = {
    uid: newData.uid,
    name: newData.name,
    markdown: markdown ?? null,
    markdownURL: newData.markdownURL,
    pdfURL: newData.pdfURL,
    scenarios: (newData.scenarios || {}) as unknown as JsonObject,
  };

  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, updatedPayload);
  if (!updated) {
    throw new Error(`Failed to update building type with id ${building.id}`);
  }

  return mapRecordToBuildingType(updated);
}

export async function getBuildingTypes(): Promise<BuildingType[]> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records.map(mapRecordToBuildingType);
}

export async function getBuildingTypeByUid(uid: string): Promise<BuildingType> {
  const store = await getDocumentStore();
  const record = await store.findOneByField<JsonObject>(COLLECTION, 'uid', uid);
  if (!record) {
    throw new Error(`Building type with uid ${uid} not found`);
  }
  return mapRecordToBuildingType(record);
}

export async function findBuildingTypeById(id: number): Promise<BuildingType | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  return record ? mapRecordToBuildingType(record) : null;
}

export async function findBuildingTypesByIds(ids: number[]): Promise<BuildingType[]> {
  const store = await getDocumentStore();
  const records = await store.findByNumericIds<JsonObject>(COLLECTION, ids);
  return records.map(mapRecordToBuildingType);
}
