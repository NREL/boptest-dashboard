import {randomBytes} from 'crypto';
import {ResultFacet} from '../../common/interfaces';
import {DocumentRecord, JsonObject, getDocumentStore} from '../datastore/documentStore';
import {PoolClient} from 'pg';

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

function normalizeScenario(value: Record<string, string[]> | undefined): Record<string, string[]> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const normalized: Record<string, string[]> = {};
  for (const key of Object.keys(value)) {
    const entry = value[key];
    if (Array.isArray(entry)) {
      normalized[key] = entry
        .filter(item => item !== undefined && item !== null)
        .map(item => String(item));
    } else if (entry !== undefined && entry !== null) {
      normalized[key] = [String(entry)];
    }
  }
  return normalized;
}

function normalizeTags(value: string[] | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(item => item !== undefined && item !== null)
    .map(item => String(item));
}

function mapRow(row: Record<string, unknown>): DocumentRecord<JsonObject> {
  const typed = row as {
    doc_id: string;
    numeric_id: number | string;
    collection: string;
    data: JsonObject;
    created_at: string | Date;
    updated_at: string | Date;
  };

  return {
    docId: typed.doc_id,
    numericId: typeof typed.numeric_id === 'number' ? typed.numeric_id : parseInt(String(typed.numeric_id), 10),
    collection: typed.collection,
    data: typed.data,
    createdAt: new Date(typed.created_at),
    updatedAt: new Date(typed.updated_at),
  };
}

function generateUuid(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}

async function insertFacet(
  client: PoolClient,
  buildingTypeUid: string,
  buildingTypeName: string,
  scenario: Record<string, string[]>,
  tags: string[]
): Promise<DocumentRecord<JsonObject> | null> {
  const sanitizedScenario = mergeScenario({}, scenario);
  const sanitizedTags = unionStrings([], tags);
  const document: ResultFacetDocument = {
    buildingTypeUid,
    buildingTypeName,
    scenario: sanitizedScenario,
    tags: sanitizedTags,
  };

  const result = await client.query(
    `INSERT INTO documents (doc_id, collection, data)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT DO NOTHING
       RETURNING doc_id, collection, numeric_id, data, created_at, updated_at`,
    [generateUuid(), COLLECTION, document as unknown as JsonObject]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRow(result.rows[0] as Record<string, unknown>);
}

async function selectExistingFacet(
  client: PoolClient,
  buildingTypeUid: string
): Promise<DocumentRecord<JsonObject> | null> {
  const result = await client.query(
    `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM documents
      WHERE collection = $1 AND data->>'buildingTypeUid' = $2
      FOR UPDATE`,
    [COLLECTION, buildingTypeUid]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRow(result.rows[0] as Record<string, unknown>);
}

async function updateFacet(
  client: PoolClient,
  docId: string,
  document: ResultFacetDocument
): Promise<DocumentRecord<JsonObject>> {
  const result = await client.query(
    `UPDATE documents
        SET data = $2::jsonb,
            updated_at = now()
      WHERE doc_id = $1
      RETURNING doc_id, collection, numeric_id, data, created_at, updated_at`,
    [docId, document as unknown as JsonObject]
  );

  return mapRow(result.rows[0] as Record<string, unknown>);
}

export async function upsertResultFacet(
  buildingTypeUid: string,
  buildingTypeName: string,
  scenario: Record<string, string[]>,
  tags: string[]
): Promise<ResultFacet> {
  const store = await getDocumentStore();
  const pool = store.getPool();
  const normalizedScenario = normalizeScenario(scenario);
  const normalizedTags = normalizeTags(tags);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const inserted = await insertFacet(
      client,
      buildingTypeUid,
      buildingTypeName,
      normalizedScenario,
      normalizedTags
    );

    if (inserted) {
      await client.query('COMMIT');
      return mapRecordToFacet(inserted);
    }

    const existing = await selectExistingFacet(client, buildingTypeUid);

    if (!existing) {
      // Another transaction may have deleted the row between insert attempt and select.
      // Restart the loop by inserting again.
      const retried = await insertFacet(
        client,
        buildingTypeUid,
        buildingTypeName,
        normalizedScenario,
        normalizedTags
      );

      await client.query('COMMIT');
      if (!retried) {
        throw new Error(`Unable to upsert facet for building ${buildingTypeUid}`);
      }
      return mapRecordToFacet(retried);
    }

    const existingData = existing.data as unknown as ResultFacetDocument;

    const mergedScenario = mergeScenario(
      normalizeScenario(existingData?.scenario),
      normalizedScenario
    );
    const mergedTags = unionStrings(normalizeTags(existingData?.tags), normalizedTags);
    const resolvedBuildingTypeName =
      buildingTypeName || existingData?.buildingTypeName || buildingTypeUid;
    const mergedDocument: ResultFacetDocument = {
      buildingTypeUid,
      buildingTypeName: resolvedBuildingTypeName,
      scenario: mergedScenario,
      tags: mergedTags,
    };

    const updated = await updateFacet(client, existing.docId, mergedDocument);
    await client.query('COMMIT');
    return mapRecordToFacet(updated);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
 
export async function listResultFacets(): Promise<ResultFacet[]> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records.map(mapRecordToFacet);
}
