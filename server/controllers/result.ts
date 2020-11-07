import {getBuildingType} from './../models/BuildingType';
import {getRepository} from 'typeorm';
import {getAccountByApiKey, getAccountByEmail} from '../models/Account';
import {createResult, Result, ResultEntity} from '../models/Result';

export function getResults(): Promise<Result[]> {
  // request data
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'buildingType'],
  });
}

// this fetches all results that are shared to be shown on
// both the home page and the results table
// we DO NOT want to show nonshared results for the current user
export function getAllSharedResults(): Promise<Result[]> {
  const resultsRepository = getRepository<Result>(ResultEntity);
  return resultsRepository.find({
    relations: ['account', 'buildingType'],
    where: {
      isShared: true,
    },
  });
}

export function getAllResultsForUser(email: string): Promise<Result[]> {
  const repo = getRepository<Result>(ResultEntity);

  const account = getAccountByEmail(email);

  return repo.find({
    relations: ['account', 'buildingType'],
    where: {
      account: account,
    },
  });
}

// need to account for account misses
function createResultAndAssociatedModels(result: any) {
  const account = getAccountByApiKey(result.account.apiKey);
  const buildingType = getBuildingType(result.buildingType.id);

  return Promise.all([account, buildingType])
    .then(data => {
      const resultData = {
        deleted: false,
        dateRun: result.dateRun,
        isShared: result.isShared,
        controllerProperties: result.controllerProperties,
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

        account: data[0],
        buildingType: data[1],
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
