import {Pool, PoolClient, types} from 'pg';
import {randomUUID} from 'crypto';

types.setTypeParser(20, value => parseInt(value, 10));
types.setTypeParser(1700, value => parseFloat(value));

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

  private mapRow<T>(row: any): DocumentRecord<T> {
    return {
      docId: row.doc_id,
      numericId: typeof row.numeric_id === 'number' ? row.numeric_id : parseInt(row.numeric_id, 10),
      collection: row.collection,
      data: row.data as T,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async insert<T extends JsonValue>(collection: string, data: T): Promise<DocumentRecord<T>> {
    await this.ensureInit();
    const docId = randomUUID();
    const result = await this.pool.query(
      `INSERT INTO ${TABLE_NAME} (doc_id, collection, data)
       VALUES ($1, $2, $3::jsonb)
       RETURNING doc_id, collection, numeric_id, data, created_at, updated_at`,
      [docId, collection, data]
    );

    return this.mapRow<T>(result.rows[0]);
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

    return this.mapRow<T>(result.rows[0]);
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

    return this.mapRow<T>(result.rows[0]);
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

    return this.mapRow<T>(result.rows[0]);
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

    return this.mapRow<T>(result.rows[0]);
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

    return result.rows.map(row => this.mapRow<T>(row));
  }

  async findAll<T>(collection: string): Promise<DocumentRecord<T>[]> {
    await this.ensureInit();
    const result = await this.pool.query(
      `SELECT doc_id, collection, numeric_id, data, created_at, updated_at
       FROM ${TABLE_NAME}
       WHERE collection = $1`,
      [collection]
    );

    return result.rows.map(row => this.mapRow<T>(row));
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

    return result.rows.map(row => this.mapRow<T>(row));
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
