import {Result} from './result';
import {Association, DataTypes, Model, Optional} from 'sequelize';

import {db} from '../db';

// These are all the attributes in the User model
interface ControllerPropertyAttributes {
  id: number;
  type?: string;
  problemFormulation?: string;
  modelType?: string;
  numStates?: number;
  predictionHorizon?: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface ControllerPropertyCreationAttributes
  extends Optional<ControllerPropertyAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class ControllerProperty
  extends Model<
    ControllerPropertyAttributes,
    ControllerPropertyCreationAttributes
  >
  implements ControllerPropertyAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public type?: string | undefined;
  public problemFormulation?: string | undefined;
  public modelType?: string | undefined;
  public numStates?: number | undefined;
  public predictionHorizon?: number | undefined;

  public static associations: {
    results: Association<ControllerProperty, Result>;
  };
}

ControllerProperty.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    problemFormulation: {
      type: new DataTypes.STRING(128),
      allowNull: true,
      field: 'problem_formulation',
    },
    modelType: {
      type: new DataTypes.STRING(128),
      allowNull: true,
      field: 'model_type',
    },
    numStates: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'num_states',
    },
    predictionHorizon: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'prediction_horizon',
    },
  },
  {
    tableName: 'controller_property',
    timestamps: false,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// ControllerProperty.hasMany(Result, {
//   sourceKey: 'id',
//   foreignKey: 'controllerId',
//   as: 'results',
// });

// gets all the results. Not useful in practice
export function getControllerProperties(): Promise<ControllerProperty[]> {
  return ControllerProperty.findAll();
}
