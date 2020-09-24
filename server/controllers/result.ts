import {getBuildingType} from './../models/BuildingType';
import {getRepository} from 'typeorm';
import {getAccountByApiKey} from '../models/Account';
import {createResult, Result, ResultEntity} from '../models/Result';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'buildingtype'],
  });
}

// this fetches all results that are shared to be shown on
// both the home page and the results table
// we DO NOT want to show nonshared results for the current user
export function getAllSharedResults(): Promise<Result[]> {
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'buildingtype'],
    where: {
      isShared: true,
    },
  });
}

// need to account for account misses
function createResultAndAssociatedModels(result: any) {
  const account = getAccountByApiKey(result.account.apiKey);
  const buildingType = getBuildingType(result.buildingTypeId);

  return Promise.all([account, buildingType])
    .then(data => {
      const resultData = {
        deleted: false,
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

export function removeResults(ids: number[]): Promise<void>[] {
  const repo = getRepository<Result>(ResultEntity);
  return ids.map((id: number) => {
    return repo
      .findOneOrFail(id)
      .then(result => {
        result.deleted = true;
        repo.save(result);
      })
      .catch(() => console.log('unable to remove result', id));
  });
}

export function shareResults(ids: number[]): Promise<void>[] {
  const repo = getRepository<Result>(ResultEntity);
  return ids.map((id: number) => {
    return repo
      .findOneOrFail(id)
      .then(result => {
        result.isShared = !result.isShared;
        repo.save(result);
      })
      .catch(() => console.log('unable to update shared value of result', id));
  });
}
