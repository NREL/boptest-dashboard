import {EntitySchema} from 'typeorm';

import {Result} from './Result';

export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  apiKey: string;
  results: Result[];
}

//export class Account extends BaseEntity implements IAccount {
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
    },
    password: {
      type: String,
    },
    apiKey: {
      type: String,
    },
  },
  relations: {
    results: {
      type: 'one-to-many',
      target: 'results',
      cascade: true,
      inverseSide: 'account',
      eager: true,
    },
  },
});
