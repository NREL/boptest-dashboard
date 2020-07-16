import { Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Optional } from "sequelize";
export declare function authDbConnection(): void;
interface UserAttributes {
    id: number;
    name: string;
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    name: string;
    getProjects: HasManyGetAssociationsMixin<Project>;
    addProject: HasManyAddAssociationMixin<Project, number>;
    hasProject: HasManyHasAssociationMixin<Project, number>;
    countProjects: HasManyCountAssociationsMixin;
    createProject: HasManyCreateAssociationMixin<Project>;
    readonly projects?: Project[];
    static associations: {
        projects: Association<User, Project>;
    };
}
interface ProjectAttributes {
    id: number;
    ownerId: number;
    name: string;
}
interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> {
}
declare class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    id: number;
    ownerId: number;
    name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function getUsers(): Promise<User[]>;
export {};
