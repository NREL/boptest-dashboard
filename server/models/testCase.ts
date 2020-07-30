import {Result} from './result';
import {Association, DataTypes, Model, Optional} from 'sequelize';

import {db} from '../db';

// These are all the attributes in the User model
interface TestCaseAttributes {
  id: number;
  name?: string;
  cosimilationStart?: Date;
  cosimilationEnd?: Date;
  controlStep?: string;
  priceScenario?: string;
  uncertaintyDistribution?: string;
  buildingType?: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface TestCaseCreationAttributes
  extends Optional<TestCaseAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class TestCase
  extends Model<TestCaseAttributes, TestCaseCreationAttributes>
  implements TestCaseAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name?: string | undefined;
  public cosimilationStart?: Date | undefined;
  public cosimilationEnd?: Date | undefined;
  public controlStep?: string | undefined;
  public priceScenario?: string | undefined;
  public uncertaintyDistribution?: string | undefined;
  public buildingType?: string | undefined;

  public static associations: {
    results: Association<TestCase, Result>;
  };
}

TestCase.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    cosimilationStart: {
      type: new DataTypes.DATE(),
      allowNull: true,
      field: 'start_cosimilation',
    },
    cosimilationEnd: {
      type: new DataTypes.DATE(),
      allowNull: true,
      field: 'end_cosimilation',
    },
    controlStep: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    priceScenario: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    uncertaintyDistribution: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    buildingType: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: 'test_case',
    timestamps: false,
    underscored: true,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// TestCase.hasMany(Result, {
//   sourceKey: 'id',
//   foreignKey: 'testCaseId',
//   as: 'results',
// });

// gets all the results. Not useful in practice
export function getTestCases(): Promise<TestCase[]> {
  return TestCase.findAll();
}
