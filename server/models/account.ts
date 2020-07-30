import {Result} from './result';
import {Association, DataTypes, Model, Optional} from 'sequelize';

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
      field: 'api_key',
    },
  },
  {
    tableName: 'account',
    timestamps: false,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

// User.hasMany(Result, {sourceKey: 'id', foreignKey: 'accountId', as: 'results'});

export function getUsers(): Promise<User[]> {
  return User.findAll();
}
