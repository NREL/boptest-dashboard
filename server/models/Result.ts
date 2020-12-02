import {Result} from '../../common/interfaces';
import {EntitySchema, getRepository} from 'typeorm';

export type ResultData = Omit<Result, 'id'>;

export const ResultEntity = new EntitySchema<Result>({
  name: 'results',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uid: {
      type: String,
      unique: true,
    },
    deleted: {
      type: Boolean,
    },
    dateRun: {
      type: Date,
    },
    isShared: {
      type: Boolean,
    },
    controllerProperties: {
      type: 'jsonb',
      nullable: true,
    },
    thermalDiscomfort: {
      type: 'float',
      scale: 5,
    },
    energyUse: {
      type: 'float',
      scale: 5,
    },
    cost: {
      type: 'float',
      scale: 2,
    },
    emissions: {
      type: 'float',
      scale: 5,
    },
    iaq: {
      type: 'float',
      scale: 5,
    },
    timeRatio: {
      type: 'float',
      scale: 5,
    },
    testTimePeriod: {
      type: String,
    },
    controlStep: {
      type: String,
    },
    priceScenario: {
      type: String,
    },
    weatherForecastUncertainty: {
      type: String,
    },
  },
  relations: {
    account: {
      type: 'many-to-one',
      target: 'accounts',
      joinColumn: true,
      nullable: false,
      inverseSide: 'results',
    },
    buildingType: {
      type: 'many-to-one',
      target: 'buildingtypes',
      joinColumn: true,
      nullable: false,
      inverseSide: 'results',
    },
  },
});

export function createResult(data: ResultData): Promise<Result> {
  const resultRepo = getRepository<Result>(ResultEntity);
  return resultRepo.save(data);
}
