import {BuildingType} from './BuildingType';
import {EntitySchema, getRepository} from 'typeorm';

import {Account} from './Account';

export interface Result {
  id: number;
  uid: string;
  deleted: boolean;
  dateRun: Date;
  isShared: boolean;
  tags: JSON;

  // KPI stuff
  thermalDiscomfort: number;
  energyUse: number;
  cost: number;
  emissions: number;
  iaq: number;
  timeRatio: number;

  // Building Type stuff (formerly testcase stuff)
  testTimePeriodStart: Date;
  testTimePeriodEnd: Date;
  controlStep: string;
  priceScenario: string;
  weatherForecastUncertainty: string;

  // Controller Type stuff
  controllerType: string;
  problemFormulation: string;
  modelType: string;
  numStates: number;
  predictionHorizon: number;

  account: Account;
  buildingType: BuildingType;
}

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
    tags: {
      type: 'jsonb',
      nullable: true,
    },
    thermalDiscomfort: {
      type: Number,
    },
    energyUse: {
      type: Number,
    },
    cost: {
      type: Number,
    },
    emissions: {
      type: Number,
    },
    iaq: {
      type: Number,
    },
    timeRatio: {
      type: Number,
    },
    testTimePeriodStart: {
      type: Date,
    },
    testTimePeriodEnd: {
      type: Date,
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
    buildingType: {
      type: String,
    },
    controllerType: {
      type: String,
    },
    problemFormulation: {
      type: String,
    },
    modelType: {
      type: String,
    },
    numStates: {
      type: Number,
    },
    predictionHorizon: {
      type: Number,
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
