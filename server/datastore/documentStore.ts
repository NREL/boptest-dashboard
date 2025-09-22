import {Pool, PoolClient, types} from 'pg';
import {randomBytes} from 'crypto';

types.setTypeParser(20, (value: string) => parseInt(value, 10));
types.setTypeParser(1700, (value: string) => parseFloat(value));

type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export interface DocumentRecord<T> {
  docId: string;
  numericId: number;
  collection: string;
  data: T;
  createdAt: Date;
  updatedAt: Date;
}

function generateUuid(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}

const SEQUENCE_NAME = 'documents_numeric_id_seq';
const TABLE_NAME = 'documents';

async function runQueries(client: PoolClient, statements: string[]): Promise<void> {
  for (const statement of statements) {
    await client.query(statement);
  }
}

export class DocumentStore {
  private initialized = false;

  constructor(private readonly pool: Pool) {}

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await runQueries(client, [
        `CREATE SEQUENCE IF NOT EXISTS ${SEQUENCE_NAME};`,
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          doc_id uuid PRIMARY KEY,
          collection text NOT NULL,
          numeric_id bigint NOT NULL DEFAULT nextval('${SEQUENCE_NAME}'),
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS ${TABLE_NAME}_collection_numeric_idx ON ${TABLE_NAME} (collection, numeric_id);`,
        `CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_collection_idx ON ${TABLE_NAME} (collection);`,
        `CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_data_gin_idx ON ${TABLE_NAME} USING GIN (data);`
      ]);
      await client.query('COMMIT');
      this.initialized = true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  private async ensureInit(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  private mapRow<T>(row: Record<string, unknown>): DocumentRecord<T> {
    const typed = row as {
      doc_id: string;
      numeric_id: number | string;
      collection: string;
      data: T;
      created_at: string | Date;
      updated_at: string | Date;
    };

    return {
      docId: typed.doc_id,
      numericId: typeof typed.numeric_id === 'number' ? typed.numeric_id : parseInt(typed.numeric_id, 10),
      collection: typed.collection,
      data: typed.data,
      createdAt: new Date(typed.created_at),
      updatedAt: new Date(typed.updated_at),
    };
  }

  async insert<T extends JsonValue>(collection: string, data: T): Promise<DocumentRecord<T>> {
    await this.ensureInit();
    const docId = generateUuid();
    const result = await this.pool.query(
      `INSERT INTO ${TABLE_NAME} (doc_id, collection, data)
       VALUES ($1, $2, $3::jsonb)
       RETURNING doc_id, collection, numeric_id, data, created_at, updated_at`,
      [docId, collection, data]
    );

    return this.mapRow<T>(result.rows[0] as Record<string, unknown>);
  }

  async replace<T extends JsonValue>(collection: string, docId: string, data: T): Promise<DocumentRecord<T> | null> {
    await this.ensureInit();
    const result = await this.pool.query(
      `UPDATE ${TABLE_NAME}
         SET data = $3::jsonb,
             updated_at = now()
       WHERE doc_id = $1 AND collection = $2
       RETURNING doc_id, collection, numeric_id, data, created_at, updated_at`,
      [docId, collection, data]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapRow<T>(result.rows[0] as Record<string, unknown>);
  }

  async delete(collection: string, docId: string): Promise<void> {
    await this.ensureInit();
    await this.pool.query(
      `DELETE FROM ${TABLE_NAME} WHERE doc_id = $1 AND collection = $2`,
      [docId, collection]
    );
  }

  async findByDocId<T>(collection: string, docId: string): Promise<DocumentRecord<T> | null> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE doc_id = $1 AND collection = $2
       LIMIT 1`,
      [docId, collection]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapRow<T>(result.rows[0] as Record<string, unknown>);
  }

  async findByNumericId<T>(collection: string, numericId: number): Promise<DocumentRecord<T> | null> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1 AND numeric_id = $2
       LIMIT 1`,
      [collection, numericId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapRow<T>(result.rows[0] as Record<string, unknown>);
  }

  async findOneByField<T>(collection: string, field: string, value: string | number | boolean): Promise<DocumentRecord<T> | null> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1
         AND data ->> $2 = $3
       LIMIT 1`,
      [collection, field, String(value)]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.mapRow<T>(result.rows[0] as Record<string, unknown>);
  }

  async findManyByField<T>(collection: string, field: string, value: string | number | boolean): Promise<DocumentRecord<T>[]> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1
         AND data ->> $2 = $3`,
      [collection, field, String(value)]
    );

    return result.rows.map(row => this.mapRow<T>(row as Record<string, unknown>));
  }

  async findAll<T>(collection: string): Promise<DocumentRecord<T>[]> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1`,
      [collection]
    );

    return result.rows.map(row => this.mapRow<T>(row as Record<string, unknown>));
  }

  async findByNumericIds<T>(collection: string, ids: number[]): Promise<DocumentRecord<T>[]> {
    await this.ensureInit();
    if (ids.length === 0) {
      return [];
    }

    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1 AND numeric_id = ANY($2::bigint[])`,
      [collection, ids]
    );

    return result.rows.map(row => this.mapRow<T>(row as Record<string, unknown>));
  }
}

let storePromise: Promise<DocumentStore> | null = null;

export async function getDocumentStore(): Promise<DocumentStore> {
  if (!storePromise) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    const pool = new Pool({ connectionString });
    const store = new DocumentStore(pool);
    storePromise = store.init().then(() => store);
  }

  return storePromise;
}
