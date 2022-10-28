import {SignatureDetails} from './../../common/interfaces';
import {getBuildingTypeByUid} from './../models/BuildingType';
import {getRepository} from 'typeorm';
import {getAccountByAPIKey, getAccountByEmail} from './account';
import {createResult, ResultEntity} from '../models/Result';
import {Result, Scenario, Scenarios, Signature} from '../../common/interfaces';

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
    where: (qb:any) => {
      qb.where(`
        ("results"."deleted" = false)
        AND
        ("results__account"."shareAllResults" is not false)
        AND
        (
          ("results__account"."shareAllResults" is true)
          OR
          ("results"."isShared") = true
        )
      `)
    }
  })
  .then(results => {
    results.forEach(result => {
      delete result.account.apiKey;
      delete result.account.shareAllResults;
      delete result.account.id
      delete result.buildingType.markdown;
      delete result.buildingType.markdownURL;
      delete result.buildingType.pdfURL;
    });
    return results;
  })
}

export function getAllResultsForUser(email: string): Promise<Result[]> {
  const repo = getRepository<Result>(ResultEntity);

  return getAccountByEmail(email)
    .then(targetAccount => {
      return repo.find({
        relations: ['account', 'buildingType'],
        where: {
          deleted: false,
          account: targetAccount,
        },
      }).then((data) => {
        return data;
      });
    })
}

// need to account for account misses
function createResultAndAssociatedModels(result: any) {
  const account = getAccountByAPIKey(result.account.apiKey);
  const buildingType = getBuildingTypeByUid(result.buildingType.uid);

  return Promise.all([account, buildingType])
    .then(data => {
      const resultData = {
        deleted: false,
        uid: result.uid,
        dateRun: result.dateRun,
        boptestVersion: result.boptestVersion,
        isShared: result.isShared,

        tags: result.tags,

        thermalDiscomfort: result.kpis.tdis_tot,
        energyUse: result.kpis.ener_tot,
        cost: result.kpis.cost_tot,
        emissions: result.kpis.emis_tot,
        iaq: result.kpis.idis_tot,
        timeRatio: result.kpis.time_rat,

        timePeriod: result.scenario.timePeriod,
        electricityPrice: result.scenario.electricityPrice,
        weatherForecastUncertainty: result.scenario.weatherForecastUncertainty,
        controlStep: result.controlStep,
        forecastParameters: result.forecastParameters,
        scenario: result.scenario,

        account: data[0],
        buildingType: data[1],
      };

      const buildingScenarios: Scenarios = { ...data[1].scenarios };
      const scenario: Scenario = { ...result.scenario };

      for(const key in scenario) {
        if (
          !buildingScenarios[key] ||
          !buildingScenarios[key].includes(scenario[key])
        ) {
          return Promise.reject({
            message: `Invalid Data: Result (${result.uid}) tried to use scenario type: "${key}" with value: "${scenario[key]}" for building type: "${data[1].name}"`,
            data: result
          });
        }
      }
      return createResult(resultData);
    });
}

export function createResults(results: any) {
  return Promise.allSettled(
    results.map((result: any) => {
      return createResultAndAssociatedModels(result);
    })
  );
}

/*Not implemented for the time being*/
// export function removeResults(ids: number[]): Promise<void>[] {
//   const repo = getRepository<Result>(ResultEntity);
//   return ids.map((id: number) => {
//     return repo
//       .findOneOrFail(id)
//       .then(result => {
//         result.deleted = true;
//         repo.save(result);
//       })
//       .catch(() => console.log('unable to remove result', id));
//   });
// }

export function toggleShared(id: number, share:boolean, sessionId: number): Promise<any> {
  const repo = getRepository<Result>(ResultEntity);
  return repo.findOneOrFail({
    relations: ['account'],
    where: {
      id,
    }
  })
    .then((result: Result) => {
      if (result.account.id === sessionId) {
        result.isShared = share;
        repo.save(result);
      } else {
        throw('Not authorized')
      }
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
        scenario: result.scenario,
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
      iaqMax = res.iaq;
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
