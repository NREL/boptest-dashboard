import {getRepository} from 'typeorm';

import {Account, AccountEntity} from './models/Account';
import {KPI, KpiEntity} from './models/KPI';
import {Result, ResultEntity} from './models/Result';
import {TestCase, TestCaseEntity} from './models/TestCase';

export async function createData() {
  const accountsRepository = getRepository<Account>(AccountEntity);
  const kpiRepo = getRepository<KPI>(KpiEntity);
  const resultRepo = getRepository<Result>(ResultEntity);
  const testCaseRepo = getRepository<TestCase>(TestCaseEntity);

  const kpiData = {
    thermalDiscomfort: 1,
    energyUse: 2,
    cost: 13,
    emissions: 400,
    iaq: 9,
    timeRatio: 120000,
  };

  const kpi = kpiRepo.create(kpiData);
  await kpiRepo.save(kpi);

  const testcaseData = {
    name: 'testcase1',
    cosimulationStart: new Date(),
    cosimulationEnd: new Date(),
    controlStep: 'step',
    priceScenario: 'price',
    uncertaintyDist: 'uncertain',
    buildingType: 'buildingBig',
  };

  const testcase = testCaseRepo.create(testcaseData);
  await testCaseRepo.save(testcase);

  const controllerData = {
    type: 'type',
    problemForm: 'prob',
    modelType: 'model1',
    numStates: 6,
    predictionHorizon: 600,
  };

  const resultData = {
    isShared: true,
    dateRun: new Date(),
    kpi: kpi,
    testcase: testcase,
  };

  const res = resultRepo.create(resultData);

  const accountData = {
    name: 'Chris',
    email: 'chris@gmail.com',
    password: 'pass',
    apiKey: 'api',
    results: [res],
  };

  accountsRepository
    .save(accountData)
    .then(account => {
      console.log('we saved both!');
      console.log('accountId', account.id);
      console.log('results', account.results);
    })
    .catch(err => console.log('unable to save account'));
}
