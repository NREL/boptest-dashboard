import {Account} from '../../common/interfaces';
import {EntitySchema, getRepository} from 'typeorm';

export type AccountData = Omit<Account, 'results'>;

export const AccountEntity = new EntitySchema<Account>({
  name: 'accounts',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    hashedIdentifier: {
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
    },
    apiKey: {
      type: String,
      unique: true,
      select: false
    },
    apiKeySalt: {
      type: String,
      unique: true,
      select: false
    },
    shareAllResults: {
      type: Boolean,
      nullable: true,
    },
    oauthProvider: {
      type: String,
    }
  },
  relations: {
    results: {
      type: 'one-to-many',
      target: 'results',
      cascade: true,
      inverseSide: 'account',
    },
  },
});

export function createAccount(data: AccountData): Promise<Account> {
  const accountRepo = getRepository<Account>(AccountEntity);
  return accountRepo.save(data);
}

export function updateDisplayName(id: number, newDisplayName: string): Promise<any> {
  try {
    const repo = getRepository<Account>(AccountEntity);
    
    // Use the update method directly
    return repo.update(id, { displayName: newDisplayName });
  } catch (err) {
    console.error('Could not update display name for account', err);
    throw err;
  }
}

export function updateGlobalShare(id: number, shareAllResults: boolean | null): Promise<any> {
  try {
    const repo = getRepository<Account>(AccountEntity);
    
    // Use the update method directly
    return repo.update(id, { shareAllResults });
  } catch (err) {
    console.error('Could not update share settings for account', err);
    throw err;
  }
}
