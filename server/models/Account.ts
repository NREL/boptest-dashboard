import {EntitySchema, getRepository} from 'typeorm';

import {Result} from './Result';

export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  apiKey: string;
  results: Result[];
}

export type AccountData = Omit<Account, 'results'>;

export const AccountEntity = new EntitySchema<Account>({
  name: 'accounts',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    apiKey: {
      type: String,
      unique: true,
    },
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

export function getAccountByApiKey(apiKey: string): Promise<Account> {
  const accountsRepo = getRepository<Account>(AccountEntity);

  return accountsRepo.findOneOrFail({
    apiKey: apiKey,
  });
}

export function createAccount(data: AccountData): Promise<Account> {
  const accountRepo = getRepository<Account>(AccountEntity);
  return accountRepo.save(data);
}
