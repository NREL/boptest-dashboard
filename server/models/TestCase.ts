import {EntitySchema, getRepository} from 'typeorm';

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

export type TestCaseData = Omit<TestCase, 'results'>;

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
// const controllerRepo = getRepository<Controller>(ControllerEntity);
export function getOrCreateTestCase(data: TestCaseData): Promise<TestCase> {
  const testCaseRepo = getRepository<TestCase>(TestCaseEntity);

  return testCaseRepo
    .findOneOrFail({
      name: data.name,
    })
    .then(testcase => {
      return testcase;
    })
    .catch(() => {
      const testcase = testCaseRepo.create(data);
      testCaseRepo.save(testcase);
      return testcase;
    });
}
