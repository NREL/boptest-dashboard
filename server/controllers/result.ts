import {getBuildingType} from './../models/BuildingType';
import {getRepository} from 'typeorm';
import {getAccountByApiKey} from '../models/Account';
import {createResult, Result, ResultEntity} from '../models/Result';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    //relations: ['account', 'kpi', 'testcase'],
    relations: ['account', 'buildingtype'],
  });
}

// this fetches all results that are shared to be shown on
// both the home page and the results table
// TODO: Eventually, we will also need to include results for the
// current user even if they aren't shared (I believe; circle back)
export function getAllSharedResults(): Promise<Result[]> {
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    //relations: ['account', 'kpi', 'testcase'],
    relations: ['account', 'buildingtype'],
    where: {
      isShared: true,
    },
  });
}

// TODO get some error checking up in this bitch
// need to account for missing testcase uid and account misses too
function createResultAndAssociatedModels(result: any) {
  //const newKpi = createKPI(<KPIData>result.kpi);
  //const testcase = getTestCaseByUid(result.testcase.uid);
  const account = getAccountByApiKey(result.account.apiKey);
  const buildingType = getBuildingType(result.buildingTypeId);

  return Promise.all([account, buildingType])
    .then(data => {
      const resultData = {
        dateRun: result.dateRun,
        isShared: result.isShared,
        tags: result.tags,
        uid: result.uid,

        thermalDiscomfort: result.thermalDiscomfort,
        energyUse: result.energyUse,
        cost: result.cost,
        emissions: result.emissions,
        iaq: result.iaq,
        timeRatio: result.timeRatio,

        testTimePeriodStart: result.testTimePeriodStart,
        testTimePeriodEnd: result.testTimePeriodEnd,
        controlStep: result.controlStep,
        priceScenario: result.priceScenario,
        weatherForecastUncertainty: result.weatherForecastUncertainty,

        controllerType: result.controllerType,
        problemFormulation: result.problemFormulation,
        modelType: result.modelType,
        numStates: result.numStates,
        predictionHorizon: result.predictionHorizon,

        account: data[0],
        buildingtype: data[1],
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
