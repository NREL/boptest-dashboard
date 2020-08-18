import {createTestCase, TestCase} from '../models/TestCase';

export function createTestCases(testcases: any): Promise<TestCase[]> {
  return Promise.all(
    testcases.map((testcase: any) => {
      createTestCase(testcase);
    })
  );
}
