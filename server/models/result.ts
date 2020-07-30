import {ControllerProperty} from './controllerProperty';
import {User} from './account';
import {KPI} from './kpi';
import {
  Association,
  DataTypes,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';

import {db} from '../db';
import {TestCase} from './testCase';

// These are all the attributes in the User model
interface ResultAttributes {
  id: number;
  accountId: string;
  kpiId: string;
  testCaseId: string;
  controllerId: string;
  dateRun: Date;
  shared: boolean;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface ResultCreationAttributes extends Optional<ResultAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class Result extends Model<ResultAttributes, ResultCreationAttributes>
  implements ResultAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public accountId!: string;
  public kpiId!: string;
  public testCaseId!: string;
  public controllerId!: string;
  public dateRun!: Date;
  public shared!: boolean;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getKpi!: HasOneGetAssociationMixin<KPI>; // Note the null assertions!
  public addKpi!: HasOneCreateAssociationMixin<KPI>;
  public createKpi!: HasOneCreateAssociationMixin<KPI>;
  public setKpi!: HasOneSetAssociationMixin<KPI, number>;

  public getAccount!: BelongsToGetAssociationMixin<User>;
  public createAccount!: BelongsToCreateAssociationMixin<User>;
  public setAccount!: BelongsToSetAssociationMixin<User, number>;

  public getTestCase!: BelongsToGetAssociationMixin<TestCase>;
  public createTestCase!: BelongsToCreateAssociationMixin<TestCase>;
  public setTestCase!: BelongsToSetAssociationMixin<TestCase, number>;

  public getControllerProperty!: BelongsToGetAssociationMixin<
    ControllerProperty
  >;
  public createControllerProperty!: BelongsToCreateAssociationMixin<
    ControllerProperty
  >;
  public setControllerProperty!: BelongsToSetAssociationMixin<
    ControllerProperty,
    number
  >;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly kpi?: KPI; // Note this is optional since it's only populated when explicitly requested in code
  public readonly account?: User;
  public readonly testCase?: TestCase;
  public readonly controllerProperty?: ControllerProperty;

  public static associations: {
    kpi: Association<Result, KPI>;
    account: Association<Result, User>;
    testCase: Association<Result, TestCase>;
    controllerProperty: Association<Result, ControllerProperty>;
  };
}

Result.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    kpiId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    testCaseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    controllerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    dateRun: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    shared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'result',
    timestamps: false,
    underscored: true,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

Result.belongsTo(KPI, {foreignKey: 'kpi_id'});
KPI.hasOne(Result, {sourceKey: 'id', foreignKey: 'kpi_id'});

Result.belongsTo(User, {foreignKey: 'account_id'});
User.hasMany(Result, {
  sourceKey: 'id',
  foreignKey: 'account_id',
  as: 'results',
});

Result.belongsTo(TestCase, {foreignKey: 'test_case_id'});
TestCase.hasMany(Result, {
  sourceKey: 'id',
  foreignKey: 'test_case_id',
  as: 'results',
});

Result.belongsTo(ControllerProperty, {foreignKey: 'controller_id'});
ControllerProperty.hasMany(Result, {
  sourceKey: 'id',
  foreignKey: 'controller_id',
  as: 'results',
});

// gets all the results. Not useful in practice
export function getResults(): Promise<Result[]> {
  return Result.findAll();
}
