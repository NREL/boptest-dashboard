import crypto from 'crypto';

import {Account} from '../../common/interfaces';
import {
  AccountData,
  findAccountByApiKey,
  findAccountByHashedIdentifier,
  findAccountById,
  createAccount as persistAccount,
  replaceAccount,
} from '../models/Account';

function sanitizeAccount(account: Account): Account {
  return {
    ...account,
    apiKey: '',
    apiKeySalt: '',
    results: [],
  };
}

export async function getAccountById(id: number): Promise<Account> {
  const account = await findAccountById(id);
  if (!account) {
    throw new Error(`Account with id ${id} not found`);
  }
  return sanitizeAccount(account);
}

export async function getAccountByHashedIdentifier(hashedIdentifier: string): Promise<Account> {
  const account = await findAccountByHashedIdentifier(hashedIdentifier);
  if (!account) {
    throw new Error(`Account with hashed identifier ${hashedIdentifier} not found`);
  }
  return sanitizeAccount(account);
}

export async function createAccounts(accounts: AccountData[]): Promise<Account[]> {
  const created: Account[] = [];

  for (const account of accounts) {
    try {
      const newAccount = await persistAccount(account);
      created.push(newAccount);
    } catch (error) {
      console.warn(`Skipping account ${account.hashedIdentifier}: ${(error as Error).message}`);
    }
  }

  return created;
}

export async function getAccountByAPIKey(key: string): Promise<Account> {
  const account = await findAccountByApiKey(key);
  if (!account) {
    throw new Error(`Account with API key ${key} not found`);
  }
  return account;
}

export async function getAPIKeyByHashedIdentifier(hashedIdentifier: string): Promise<Account> {
  const account = await findAccountByHashedIdentifier(hashedIdentifier);
  if (!account) {
    throw new Error(`Account with hashed identifier ${hashedIdentifier} not found`);
  }
  return { ...account, results: [] };
}

export interface OAuthUserData {
  providerId: string;
  provider: string;
}

export function createHashedIdentifier(providerId: string): string {
  const salt = process.env.IDENTIFIER_SALT || 'default-salt-change-me';
  return crypto
    .createHash('sha256')
    .update(providerId + salt)
    .digest('hex');
}

function createApiKey(): string {
  if (typeof (crypto as any).randomUUID === 'function') {
    return (crypto as any).randomUUID().replace(/-/g, '');
  }
  return crypto.randomBytes(32).toString('hex');
}

function createSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function createAccountFromOAuth(userData: OAuthUserData): Promise<Account> {
  const hashedIdentifier = createHashedIdentifier(userData.providerId);
  const displayName = `User_${hashedIdentifier.substring(0, 8)}`;

  const accountData: AccountData = {
    hashedIdentifier,
    displayName,
    apiKey: createApiKey(),
    apiKeySalt: createSalt(),
    shareAllResults: false,
    oauthProvider: userData.provider,
  };

  return persistAccount(accountData);
}

export async function regenerateApiKey(hashedIdentifier: string): Promise<Account> {
  const account = await findAccountByHashedIdentifier(hashedIdentifier);
  if (!account) {
    throw new Error(`No account found with hashedIdentifier: ${hashedIdentifier}`);
  }

  const updatedAccount: Account = {
    ...account,
    apiKey: createApiKey(),
    apiKeySalt: createSalt(),
  };

  const persisted = await replaceAccount(updatedAccount);
  return persisted;
}
