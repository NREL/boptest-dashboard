import {getRepository} from 'typeorm';
import {getAccount, AccountData} from '../models/Account';
import {createKPI, KPIData} from '../models/KPI';
import {createResult, Result, ResultEntity} from '../models/Result';
import {getOrCreateTestCase, TestCaseData} from '../models/TestCase';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'controller', 'kpi', 'testcase'],
  });
}

function createEntitiesFromResult(result: any) {
  const newKpi = createKPI(<KPIData>result.kpi);
  const account = getAccount(<AccountData>result.account);
  const testcase = getOrCreateTestCase(<TestCaseData>result.testcase);

  return Promise.all([newKpi, account, testcase])
    .then(data => {
      const resultData = {
        dateRun: result.dateRun,
        isShared: result.isShared,
        kpi: data[0],
        account: data[1],
        testcase: data[2],
      };

      return createResult(resultData);
    })
    .catch(err =>
      console.log('oops something went wrong with the promises', err)
    );
}

export function createEntities(results: any) {
  return Promise.all(
    results.map((result: any) => {
      createEntitiesFromResult(result);
    })
  );
}
