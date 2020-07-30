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
    },
    modelType: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    numStates: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    predictionHorizon: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: 'controller_property',
    underscored: true,
    timestamps: false,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// gets all the results. Not useful in practice
export function getControllerProperties(): Promise<ControllerProperty[]> {
  return ControllerProperty.findAll();
}
