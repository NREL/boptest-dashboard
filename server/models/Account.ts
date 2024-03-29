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
    sub: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      select: false
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

export function updateName(id: number, newName: string): Promise<void> {
  const repo = getRepository<Account>(AccountEntity);
  return repo
    .findOneOrFail(id)
    .then(account => {
      account.name = newName;
      repo.save(account);
    })
    .catch(err => console.log('could not update name for account', err));
}

export function updateGlobalShare(id: number, shareAllResults: boolean | null): Promise<void> {
  const repo = getRepository<Account>(AccountEntity);
  return repo
    .findOneOrFail(id)
    .then((account: Account) => {
      account.shareAllResults = shareAllResults;
      repo.save(account);
    })
}
