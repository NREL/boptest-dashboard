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
  public getAccount!: HasOneGetAssociationMixin<User>; // Note the null assertions!
  public addAccount!: HasOneSetAssociationMixin<User, number>;
  public createResult!: HasOneCreateAssociationMixin<User>;
  // public getKpis!: HasOneGetAssociationMixin<KPI>; // Note the null assertions!
  // public addKpis!: HasOneCreateAssociationMixin<KPI>;
  // public addProject!: HasManyAddAssociationMixin<Project, number>;
  // public hasProject!: HasManyHasAssociationMixin<Project, number>;
  // public createProject!: HasManyCreateAssociationMixin<Project>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly kpis?: KPI[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    projects: Association<Result, KPI>;
    account: Association<Result, User>;
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
      type: new DataTypes.STRING(128),
      allowNull: false,
      field: 'account_id',
    },
    kpiId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      field: 'kpi_id',
    },
    testCaseId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      field: 'test_case_id',
    },
    controllerId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      field: 'controller_id',
    },
    dateRun: {
      type: new DataTypes.DATE(),
      allowNull: false,
      field: 'date_run',
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

Result.hasOne(KPI, {sourceKey: 'id'});
KPI.belongsTo(Result, {targetKey: 'id'});

// Result.belongsTo(User);
// User.hasMany(Result, {
//   sourceKey: 'id',
//   foreignKey: 'account_id',
//   as: 'results',
// });

Result.belongsTo(TestCase, {targetKey: 'id'});
TestCase.hasMany(Result, {
  sourceKey: 'id',
  foreignKey: 'testCaseId',
  as: 'results',
});

Result.belongsTo(ControllerProperty, {targetKey: 'id'});
ControllerProperty.hasMany(Result, {
  sourceKey: 'id',
  foreignKey: 'controllerId',
  as: 'results',
});

// gets all the results. Not useful in practice
export function getResults(): Promise<Result[]> {
  return Result.findAll();
}
