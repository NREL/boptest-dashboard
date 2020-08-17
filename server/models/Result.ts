import {EntitySchema, getRepository} from 'typeorm';

import {Account} from './Account';
import {KPI} from './KPI';
import {TestCase} from './TestCase';

export interface Result {
  id: number;
  uid: string;
  dateRun: Date;
  isShared: boolean;
  account: Account;
  kpi: KPI;
  testcase: TestCase;
  tags: JSON;
}

export type ResultData = Omit<Result, 'id'>;

export const ResultEntity = new EntitySchema<Result>({
  name: 'results',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uid: {
      type: String,
      unique: true,
    },
    dateRun: {
      type: Date,
    },
    isShared: {
      type: Boolean,
    },
    tags: {
      type: 'jsonb',
      nullable: true,
    },
  },
  relations: {
    account: {
      type: 'many-to-one',
      target: 'accounts',
      joinColumn: true,
      nullable: false,
      inverseSide: 'results',
    },
    kpi: {
      type: 'one-to-one',
      target: 'kpis',
      joinColumn: true,
      nullable: false,
      inverseSide: 'result',
    },
    testcase: {
      type: 'many-to-one',
      target: 'testcases',
      joinColumn: true,
      nullable: false,
      inverseSide: 'results',
    },
  },
});

export function createResult(data: ResultData): Promise<Result> {
  const resultRepo = getRepository<Result>(ResultEntity);
  return resultRepo.save(data);
}
