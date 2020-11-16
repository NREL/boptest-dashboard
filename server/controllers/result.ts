import {SignatureDetails} from './../../common/interfaces';
import {getBuildingType} from './../models/BuildingType';
import {getRepository} from 'typeorm';
import {getAccountByApiKey, getAccountByEmail} from '../models/Account';
import {createResult, ResultEntity} from '../models/Result';
import {Result, Signature} from '../../common/interfaces';

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
      deleted: false,
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
      deleted: false,
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

        testTimePeriod: result.testTimePeriod,
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

export function getSignatureDetailsForResult(
  id: string
): Promise<SignatureDetails> {
  const repo = getRepository<Result>(ResultEntity);
  return repo
    .findOneOrFail({
      uid: id,
    })
    .then(result => {
      const targetSignature: Signature = {
        testTimePeriod: result.testTimePeriod,
        controlStep: result.controlStep,
        priceScenario: result.priceScenario,
        weatherForecastUncertainty: result.weatherForecastUncertainty,
      };
      return repo
        .find({
          where: {...targetSignature},
        })
        .then(results => {
          return getKPIRanges(results, result);
        });
    });
}

function getKPIRanges(results: Result[], result: Result): SignatureDetails {
  var tdMin = result.thermalDiscomfort;
  var tdMax = result.thermalDiscomfort;

  var energyMin = result.energyUse;
  var energyMax = result.energyUse;

  var costMin = result.cost;
  var costMax = result.cost;

  var emissionsMin = result.emissions;
  var emissionsMax = result.emissions;

  var iaqMin = result.iaq;
  var iaqMax = result.iaq;

  var timeMin = result.timeRatio;
  var timeMax = result.timeRatio;

  results.forEach(res => {
    if (res.thermalDiscomfort < tdMin) {
      tdMin = res.thermalDiscomfort;
    }

    if (res.thermalDiscomfort > tdMax) {
      tdMax = res.thermalDiscomfort;
    }

    if (res.energyUse < energyMin) {
      energyMin = res.energyUse;
    }

    if (res.energyUse > energyMax) {
      energyMax = res.energyUse;
    }

    if (res.cost < costMin) {
      costMin = res.cost;
    }

    if (res.cost > costMax) {
      costMax = res.cost;
    }

    if (res.emissions < emissionsMin) {
      emissionsMin = res.emissions;
    }

    if (res.emissions > emissionsMax) {
      emissionsMax = res.emissions;
    }

    if (res.iaq < iaqMin) {
      iaqMin = res.iaq;
    }

    if (res.iaq > iaqMax) {
      iaqMin = res.iaq;
    }

    if (res.timeRatio < timeMin) {
      timeMin = res.timeRatio;
    }

    if (res.timeRatio > timeMax) {
      timeMax = res.timeRatio;
    }
  });

  return {
    numResults: results.length,
    thermalDiscomfort: {
      min: tdMin,
      max: tdMax,
    },
    energyUse: {
      min: energyMin,
      max: energyMax,
    },
    cost: {
      min: costMin,
      max: costMax,
    },
    emissions: {
      min: emissionsMin,
      max: emissionsMax,
    },
    iaq: {
      min: iaqMin,
      max: iaqMax,
    },
    timeRatio: {
      min: timeMin,
      max: timeMax,
    },
  };
}
