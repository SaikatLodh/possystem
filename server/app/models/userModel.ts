import { DataTypes, Model } from "sequelize";
import type { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin } from "sequelize";
import db from "../config/db.ts";
import type UserAttributes from "../interface/userInterface.ts";
import { ROLES, type Role } from "../config/userRoles.ts";
import Food from "./foodModel.ts";

class User extends Model<UserAttributes> implements UserAttributes {
  declare id?: string;
  declare fullname: string;
  declare email: string;
  declare password: string;
  declare number: number;
  declare profilePicture?: { publicId: string; url: string } | null;
  declare role?: Role;
  declare isVerified?: boolean;
  declare forgotPasswordToken?: string | null;
  declare forgotPasswordExpiry?: Date | null;
  declare isDeleted?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  declare addFood: BelongsToManyAddAssociationMixin<Food, string>;
  declare addFoods: BelongsToManyAddAssociationsMixin<Food, string>;

}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
        min: 6,
        isLowercase: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 10],
        isNumeric: true,
      },
    },
    profilePicture: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM(ROLES.ADMIN, ROLES.CUSTOMER, ROLES.WAITER),
      allowNull: false,
      defaultValue: "customer",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    forgotPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    forgotPasswordExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "users",
    timestamps: true,
  },
);

export default User;
