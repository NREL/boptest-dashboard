import {EntitySchema} from 'typeorm';

import {Account} from './Account';

export interface Result {
  id: number;
  dateRun: Date;
  isShared: boolean;
  account: Account;
}

// export class Result extends BaseEntity implements IResult {
export const ResultEntity = new EntitySchema<Result>({
  name: 'results',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    dateRun: {
      type: Date,
    },
    isShared: {
      type: Boolean,
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
  },
});

// Table account {
//     id int [pk, increment]
//     username varchar
//     email varchar
//     hashed_pw varchar
//   }
//   Table result {
//     id int [pk, increment]
//     account_id int
//     kpi_id int
//     test_case_id int
//     controller_id int
//     date_run timestamp
//     share bool
//   }
//   Table kpi {
//   id int [pk, increment]
//     thermal_discomfort float
//     energy_use float
//     cost float
//     emissions float
//     iaq float
//     time_ration float
//   }
//   Table test_case {
//     id int [pk, increment]
//     name varchar
//     start_cosimulation timestamp
//     stop_cosimulation timestamp
//     control_step varchar
//     price_scenario varchar
//     uncertainty_distribution varchar
//     type_of_building varchar
//   }
//   Table controler_properties {
//     id int [pk, increment]
//     prop1 varchar
//     prop2 varchar
//     prop3 varchar
//   }
