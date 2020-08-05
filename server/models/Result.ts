import {EntitySchema} from 'typeorm';

import {Account} from './Account';
import {Controller} from './Controller';
import {KPI} from './KPI';
import {TestCase} from './TestCase';

export interface Result {
  id: number;
  dateRun: Date;
  isShared: boolean;
  account: Account;
  controller: Controller;
  kpi: KPI;
  testcase: TestCase;
}

export const ResultEntity = new EntitySchema<Result>({
  name: 'results',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    dateRun: {
      type: Date,
    },
    isShared: {
      type: Boolean,
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
    controller: {
      type: 'many-to-one',
      target: 'controllers',
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
