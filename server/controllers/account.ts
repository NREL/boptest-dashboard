import {getRepository, getConnection} from 'typeorm';
import {Account} from '../../common/interfaces';
import {AccountEntity, createAccount} from '../models/Account';
import crypto from 'crypto';

// Get account by ID
export function getAccountById(id: number): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail(id, {
    select: ['id', 'hashedIdentifier', 'displayName', 'shareAllResults', 'oauthProvider']
  });
}

// Get account by hashed identifier
export function getAccountByHashedIdentifier(hashedIdentifier: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    hashedIdentifier: hashedIdentifier,
  }, {
    select: ['id', 'hashedIdentifier', 'displayName', 'shareAllResults', 'oauthProvider']
  });
}

// Create multiple accounts
export function createAccounts(accounts: any): Promise<Account[]> {
  return Promise.all(
    accounts.map((account: any) => {
      return createAccount(account);
    })
  );
}

// Get account by API key
export function getAccountByAPIKey(key: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  return repo.findOneOrFail({
    apiKey: key,
  }, {
    select: ['id', 'hashedIdentifier', 'displayName', 'shareAllResults', 'oauthProvider']
  });
}

// Get API key by hashed identifier with improved error handling
export function getAPIKeyByHashedIdentifier(hashedIdentifier: string): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  // Use raw SQL query to ensure we get the API key regardless of select settings
  return repo.query(
    'SELECT "apiKey" FROM accounts WHERE "hashedIdentifier" = $1 LIMIT 1',
    [hashedIdentifier]
  )
  .then(results => {
    if (results && results.length > 0 && results[0].apiKey) {
      return { apiKey: results[0].apiKey } as Account;
    }
    throw new Error(`No API key found for hashedIdentifier: ${hashedIdentifier}`);
  });
}

// OAuth user data interface
export interface OAuthUserData {
  providerId: string;
  provider: string;
}

// Create a hashed identifier from OAuth provider and ID
export function createHashedIdentifier(providerId: string): string {
  // Get salt from environment variable
  const salt = process.env.IDENTIFIER_SALT || 'default-salt-change-me';
  
  // Create hashed identifier
  return crypto
    .createHash('sha256')
    .update(providerId + salt)
    .digest('hex');
}

// Create a new account from OAuth login
export function createAccountFromOAuth(userData: OAuthUserData): Promise<Account> {
  const repo = getRepository<Account>(AccountEntity);

  // Create hashed identifier
  const hashedIdentifier = createHashedIdentifier(userData.providerId);
  
  // Generate a display name
  const displayName = `User_${hashedIdentifier.substring(0, 8)}`;
  
  // Generate API key and salt
  const apiKey = createApiKey();
  const apiKeySalt = createSalt();

  // Create account data
  const accountData = {
    hashedIdentifier: hashedIdentifier,
    displayName: displayName,
    apiKey: apiKey,
    apiKeySalt: apiKeySalt,
    oauthProvider: userData.provider,
    shareAllResults: false
  };

  return repo.save(accountData);
}

// Helper functions
function createApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

function createSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Function to regenerate a new API key for a user
export function regenerateApiKey(hashedIdentifier: string): Promise<Account> {
  // Generate new API key and salt
  const newApiKey = createApiKey();
  const newApiKeySalt = createSalt();
  
  console.log(`Regenerating API key for hashedIdentifier: ${hashedIdentifier}`);

  // Two-step approach: First check if the account exists, then update if it does
  return getConnection().transaction(async transactionalEntityManager => {
    // First check if the account exists
    const account = await transactionalEntityManager.query(
      'SELECT id FROM accounts WHERE "hashedIdentifier" = $1 LIMIT 1', 
      [hashedIdentifier]
    );
    
    if (!account || account.length === 0) {
      throw new Error(`No account found with hashedIdentifier: ${hashedIdentifier}`);
    }
    
    console.log('Found account with id:', account[0].id);
    
    // Now update the API key
    await transactionalEntityManager.query(
      'UPDATE accounts SET "apiKey" = $1, "apiKeySalt" = $2 WHERE "hashedIdentifier" = $3',
      [newApiKey, newApiKeySalt, hashedIdentifier]
    );
    
    // Return the new API key
    return { apiKey: newApiKey } as Account;
  }).catch(err => {
    console.error('Error in regenerateApiKey transaction:', err);
    throw err;
  });
}