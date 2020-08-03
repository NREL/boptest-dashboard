//   Table kpi {
//   id int [pk, increment]
//     thermal_discomfort float
//     energy_use float
//     cost float
//     emissions float
//     iaq float
//     time_ration float
//   }

import {EntitySchema} from 'typeorm';

import {Result} from './Result';

export interface KPI {
  id: number;
  thermalDiscomfort: number;
  energyUse: number;
  cost: number;
  emissions: number;
  iaq: number;
  timeRatio: number;
  result: Result;
}

export const KpiEntity = new EntitySchema<KPI>({
  name: 'kpis',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
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
  },
  relations: {
    result: {
      type: 'one-to-one',
      target: 'results',
      cascade: true,
      inverseSide: 'kpi',
    },
  },
});
