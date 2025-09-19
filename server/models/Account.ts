import {Account} from '../../common/interfaces';
import {getDocumentStore, DocumentRecord, JsonObject} from '../datastore/documentStore';

export type AccountDocument = Omit<Account, 'id' | 'results'>;
export type AccountData = AccountDocument;

const COLLECTION = 'accounts';

function mapRecordToAccount(record: DocumentRecord<JsonObject>): Account {
  const data = record.data as AccountDocument;
  return {
    id: record.numericId,
    hashedIdentifier: data.hashedIdentifier,
    displayName: data.displayName,
    apiKey: data.apiKey,
    apiKeySalt: data.apiKeySalt,
    results: [],
    shareAllResults: data.shareAllResults ?? null,
    oauthProvider: data.oauthProvider,
  };
}

export async function createAccount(data: AccountData): Promise<Account> {
  const store = await getDocumentStore();

  const existing = await store.findOneByField<JsonObject>(
    COLLECTION,
    'hashedIdentifier',
    data.hashedIdentifier
  );

  if (existing) {
    throw new Error(`Account already exists for identifier ${data.hashedIdentifier}`);
  }

  const record = await store.insert<JsonObject>(COLLECTION, {
    ...data,
    shareAllResults: data.shareAllResults ?? null,
  });

  return mapRecordToAccount(record);
}

export async function findAccountById(id: number): Promise<Account | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  return record ? mapRecordToAccount(record) : null;
}

export async function findAccountByHashedIdentifier(hashedIdentifier: string): Promise<Account | null> {
  const store = await getDocumentStore();
  const record = await store.findOneByField<JsonObject>(
    COLLECTION,
    'hashedIdentifier',
    hashedIdentifier
  );
  return record ? mapRecordToAccount(record) : null;
}

export async function findAccountByApiKey(apiKey: string): Promise<Account | null> {
  const store = await getDocumentStore();
  const record = await store.findOneByField<JsonObject>(COLLECTION, 'apiKey', apiKey);
  return record ? mapRecordToAccount(record) : null;
}

export async function updateDisplayName(id: number, newDisplayName: string): Promise<Account | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  if (!record) {
    return null;
  }

  record.data.displayName = newDisplayName;
  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, record.data);
  return updated ? mapRecordToAccount(updated) : null;
}

export async function updateGlobalShare(id: number, shareAllResults: boolean | null): Promise<Account | null> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, id);
  if (!record) {
    return null;
  }

  record.data.shareAllResults = shareAllResults;
  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, record.data);
  return updated ? mapRecordToAccount(updated) : null;
}

export async function replaceAccount(account: Account): Promise<Account> {
  const store = await getDocumentStore();
  const record = await store.findByNumericId<JsonObject>(COLLECTION, account.id);

  if (!record) {
    throw new Error(`Account with id ${account.id} not found`);
  }

  const data: AccountDocument = {
    hashedIdentifier: account.hashedIdentifier,
    displayName: account.displayName,
    apiKey: account.apiKey,
    apiKeySalt: account.apiKeySalt,
    shareAllResults: account.shareAllResults ?? null,
    oauthProvider: account.oauthProvider,
  };

  const updated = await store.replace<JsonObject>(COLLECTION, record.docId, data);
  if (!updated) {
    throw new Error(`Failed to update account with id ${account.id}`);
  }

  return mapRecordToAccount(updated);
}

export async function listAccounts(): Promise<Account[]> {
  const store = await getDocumentStore();
  const records = await store.findAll<JsonObject>(COLLECTION);
  return records.map(mapRecordToAccount);
}

export async function findAccountsByIds(ids: number[]): Promise<Account[]> {
  const store = await getDocumentStore();
  const records = await store.findByNumericIds<JsonObject>(COLLECTION, ids);
  return records.map(mapRecordToAccount);
}
