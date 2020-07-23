import {DataTypes, Model, Optional} from 'sequelize';

import {db} from '../db';

// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  name: string;
  // preferredName: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  // timestamps!
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
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
  },
  {
    tableName: 'accounts',
    timestamps: false,
    sequelize: db, // passing the `sequelize` instance is required
  }
);

export function getUsers(): Promise<User[]> {
  return User.findAll();
}

async function doStuffWithUser() {
  const newUser = await User.create({
    name: 'Johnny',
    //  preferredName: "John",
  });
  console.log(newUser.id, newUser.name);
  const ourUser = await User.findByPk(1, {
    rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
  });
}
