import {DataTypes, Model, Optional} from 'sequelize';

import {db} from '../db';

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
    },
    kpiId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    testCaseId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    controllerId: {
      type: new DataTypes.STRING(128),
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
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// gets all the results. Not useful in practice
export function getResults(): Promise<Result[]> {
  return Result.findAll();
}
