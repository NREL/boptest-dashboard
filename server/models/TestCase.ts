import {EntitySchema} from 'typeorm';

import {Result} from './Result';

export interface TestCase {
  id: number;
  name: string;
  cosimulationStart: Date;
  cosimulationEnd: Date;
  controlStep: string;
  priceScenario: string;
  uncertaintyDist: string;
  buildingType: string;
  results: Result[];
}

export const TestCaseEntity = new EntitySchema<TestCase>({
  name: 'testcases',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    cosimulationStart: {
      type: Date,
    },
    cosimulationEnd: {
      type: Date,
    },
    controlStep: {
      type: String,
    },
    priceScenario: {
      type: String,
    },
    uncertaintyDist: {
      type: String,
    },
    buildingType: {
      type: String,
    },
  },
  relations: {
    results: {
      type: 'one-to-many',
      target: 'results',
      cascade: true,
      inverseSide: 'testcase',
    },
  },
});
