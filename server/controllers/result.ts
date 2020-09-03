import {getRepository} from 'typeorm';
import {getAccountByApiKey} from '../models/Account';
import {createKPI, KPIData} from '../models/KPI';
import {createResult, Result, ResultEntity} from '../models/Result';
import {getTestCaseByUid} from '../models/TestCase';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'kpi', 'testcase'],
  });
}

// this fetches all results that are shared to be shown on
// both the home page and the results table
// TODO: Eventually, we will also need to include results for the
// current user even if they aren't shared (I believe; circle back)
export function getAllSharedResults(): Promise<Result[]> {
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'kpi', 'testcase'],
    where: {
      isShared: true,
    },
  });
}

// TODO get some error checking up in this bitch
// need to account for missing testcase uid and account misses too
function createResultAndAssociatedModels(result: any) {
  const newKpi = createKPI(<KPIData>result.kpi);
  const account = getAccountByApiKey(result.account.apiKey);
  const testcase = getTestCaseByUid(result.testcase.uid);

  return Promise.all([newKpi, account, testcase])
    .then(data => {
      const resultData = {
        dateRun: result.dateRun,
        isShared: result.isShared,
        tags: result.tags,
        uid: result.uid,
        kpi: data[0],
        account: data[1],
        testcase: data[2],
      };

      return createResult(resultData);
    })
    .catch(err =>
      console.log('Something went wrong in the mega creation method', err)
    );
}

export function createResults(results: any) {
  return Promise.all(
    results.map((result: any) => {
      return createResultAndAssociatedModels(result);
    })
  );
}
