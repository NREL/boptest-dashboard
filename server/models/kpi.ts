import {Result} from './result';
import {DataTypes, Model, Optional, Association} from 'sequelize';

import {db} from '../db';

// These are all the attributes in the User model
interface KPIAttributes {
  id: number;
  thermalDiscomfort?: number;
  energyUse?: number;
  cost?: number;
  emissions?: number;
  iaq?: number;
  timeRatio?: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface KPICreationAttributes extends Optional<KPIAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class KPI extends Model<KPIAttributes, KPICreationAttributes>
  implements KPIAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public thermalDiscomfort: number | undefined;
  public energyUse: number | undefined;
  public cost: number | undefined;
  public emissions: number | undefined;
  public iaq: number | undefined;
  public timeRatio: number | undefined;

  public static associations: {
    result: Association<KPI, Result>;
  };
}

KPI.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    thermalDiscomfort: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
    energyUse: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
    cost: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
    emissions: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
    iaq: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
    timeRatio: {
      type: new DataTypes.FLOAT(),
      allowNull: true,
    },
  },
  {
    tableName: 'kpi',
    timestamps: false,
    underscored: true,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// KPI.belongsTo(Result, {targetKey: 'id'});
// gets all the results. Not useful in practice
export function getKPIs(): Promise<KPI[]> {
  return KPI.findAll();
}
