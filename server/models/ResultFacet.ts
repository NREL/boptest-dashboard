import {ResultFacet} from '../../common/interfaces';
import {DocumentRecord, JsonObject, getDocumentStore} from '../datastore/documentStore';

export interface ResultFacetDocument {
  buildingTypeUid: string;
  buildingTypeName: string;
  scenario: Record<string, string[]>;
  tags: string[];
}

const COLLECTION = 'resultFacets';

function mapRecordToFacet(record: DocumentRecord<JsonObject>): ResultFacet {
  const data = record.data as unknown as ResultFacetDocument;
  return {
    buildingTypeUid: data.buildingTypeUid,
    buildingTypeName: data.buildingTypeName,
    scenario: data.scenario || {},
    tags: data.tags || [],
  };
}

function unionStrings(existing: string[] = [], incoming: string[] = []): string[] {
  const set = new Set<string>(existing);
  for (const value of incoming) {
    if (value !== null && value !== undefined) {
      set.add(String(value));
    }
  }
  return Array.from(set).sort();
}

function mergeScenario(
  existing: Record<string, string[]> = {},
  incoming: Record<string, string[]>
): Record<string, string[]> {
  const merged: Record<string, string[]> = {...existing};
  for (const key of Object.keys(incoming || {})) {
    merged[key] = unionStrings(existing?.[key], incoming[key]);
  }
  return merged;
}

export async function upsertResultFacet(
  buildingTypeUid: string,
  buildingTypeName: string,
  scenario: Record<string, string[]>,
  tags: string[]
): Promise<ResultFacet> {
  const store = await getDocumentStore();

  const existing = await store.findOneByField<JsonObject>(
    COLLECTION,
    'buildingTypeUid',
    buildingTypeUid
  );

  const existingData = existing?.data as ResultFacetDocument | undefined;

  const nextScenario = mergeScenario(existingData?.scenario, scenario);
  const nextTags = unionStrings(existingData?.tags, tags);

  const document: ResultFacetDocument = {
    buildingTypeUid,
    buildingTypeName,
    scenario: nextScenario,
    tags: nextTags,
  };

  if (existing) {
    const updated = await store.replace<JsonObject>(
      COLLECTION,
      existing.docId,
      document as unknown as JsonObject
    );
    return mapRecordToFacet(updated ?? existing);
  }

  const created = await store.insert<JsonObject>(
    COLLECTION,
    document as unknown as JsonObject
  );
  return mapRecordToFacet(created as unknown as DocumentRecord<JsonObject>);
}
 
export async function listResultFacets(): Promise<ResultFacet[]> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records.map(mapRecordToFacet);
}
