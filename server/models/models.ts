import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
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

// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
  apiKey: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public email!: string;
  public hashedPassword!: string;
  public apiKey!: string;

  public getResults!: HasManyGetAssociationsMixin<Result>; // Note the null assertions!
  public addResults!: HasManyAddAssociationMixin<Result, number>;
  public hasResult!: HasManyHasAssociationMixin<Result, number>;
  public countResults!: HasManyCountAssociationsMixin;
  public createResult!: HasManyCreateAssociationMixin<Result>;

  public readonly results?: Result[];

  public static associations: {
    results: Association<User, Result>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    hashedPassword: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      field: 'hashed_pw',
    },
    apiKey: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'account',
    timestamps: false,
    underscored: true,
    sequelize: db, // passing the `sequelize` instance is required
  }
);
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
//Result.hasOne(KPI, {sourceKey: 'id', foreignKey: 'kpi_id'});
//KPI.hasOne(Result, {sourceKey: 'id', foreignKey: 'kpi_id'});

// defining both the belongsTo and hasMany in this specific case
// for User<->Result causes an infinite loop
//Result.belongsTo(User, {foreignKey: 'account_id'});
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

export function getKPIs(): Promise<KPI[]> {
  return KPI.findAll();
}

export function getTestCases(): Promise<TestCase[]> {
  return TestCase.findAll();
}

export function getControllerProperties(): Promise<ControllerProperty[]> {
  return ControllerProperty.findAll();
}

export function getUsers(): Promise<User[]> {
  return User.findAll();
}

export function getResultsForUser(): Promise<Result[]> {
  // this guy also works as long as circular reference is not in place
  return User.findByPk(2).then(user => {
    return user!.getResults();
  });
}

export function getUserResults(): Promise<User[]> {
  // this works as long as the circular reference is NOT in place
  // i.e. can't have both the hasMany and belongsTo defined
  return User.findAll({include: [User.associations.results]});
}

export function getKpiForResult(): Promise<KPI> {
  return Result.findByPk(1, {
    include: [Result.associations.kpi],
    rejectOnEmpty: true,
  }).then(result => {
    console.log(result);
    return result.getKpi();
  });
}
