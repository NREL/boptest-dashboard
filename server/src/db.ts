import {
  Sequelize,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from 'sequelize';

const sequelize = new Sequelize(<string>process.env.DATABASE_URL);

export function authDbConnection() {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been successful');
    })
    .catch(err => {
      console.log('unable to establish connection: ', err);
    });
}

// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  name: string;
  // preferredName: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Some attributes are optional in `User.build` and `User.create` calls interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  // public preferredName!: string | null; // for nullable fields

  // timestamps!
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
  public addProject!: HasManyAddAssociationMixin<Project, number>;
  public hasProject!: HasManyHasAssociationMixin<Project, number>;
  public countProjects!: HasManyCountAssociationsMixin;
  public createProject!: HasManyCreateAssociationMixin<Project>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    projects: Association<User, Project>;
  };
}

// const obj = {
//     ener_tot: float   # Total Energy Consumption [kWh]
//     emis_tot: float   # Total CO2 Emissions [kgCO2]
//     idis_tot: float   # Indoor Air Quality Discomfort [ppmh]
//     tdis_tot: float   # Thermal Discomfort [Kh]
//     time_rat: float   # Computational Time Ratio [-]
//     cost_tot: float   # Total Operational Cost [$ or Euro]
//   }

// example:
// {
//     "ener_tot": 147.23025216456708,
//     "emis_tot": 73.61512608228354,
//     "idis_tot": 365.69118739675133,
//     "tdis_tot": 6.04446040558893,
//     "time_rat": 1.3834294416098448e-06,
//     "cost_tot": 29.446050432913417
// }

interface ReportAttributes {
  id: number;
  tdis: number; //thermal discomfort (Kh)
  idis: number; //indoor air quality discomfort (ppmh)
  energy: number; //total energy consumption (kWh)
  cost: number; // total operational cost ($ or Euros)
  emis: number; // total CO2 emissions (kgCO2)
  time: number; //computational time ration (-)
}

interface ProjectAttributes {
  id: number;
  ownerId: number;
  name: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public ownerId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'projects',
  }
);

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
    // preferredName: {
    // type: new DataTypes.STRING(128),
    // allowNull: true,
    // },
  },
  {
    tableName: 'accounts',
    timestamps: false,
    sequelize, // passing the `sequelize` instance is required
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.hasMany(Project, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'projects', // this determines the name in `associations`!
});

export async function getUsers() {
  const users = await User.findAll();
  return users;
}

async function doStuffWithUser() {
  const newUser = await User.create({
    name: 'Johnny',
    //  preferredName: "John",
  });
  console.log(newUser.id, newUser.name);

  const project = await newUser.createProject({
    name: 'first!',
  });

  const ourUser = await User.findByPk(1, {
    include: [User.associations.projects],
    rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
  });

  // Note the `!` null assertion since TS can't know if we included
  // the model or not
  console.log(ourUser.projects![0].name);
}
