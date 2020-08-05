import {EntitySchema} from 'typeorm';

import {Result} from './Result';

export interface Controller {
  id: number;
  type: string;
  problemForm: string;
  modelType: string;
  numStates: number;
  predictionHorizon: number;
  results: Result[];
}

export const ControllerEntity = new EntitySchema<Controller>({
  name: 'controllers',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    type: {
      type: String,
    },
    problemForm: {
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
    results: {
      type: 'one-to-many',
      target: 'results',
      cascade: true,
      inverseSide: 'controller',
    },
  },
});
