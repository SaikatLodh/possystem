import { DataTypes, Model } from "sequelize";
import type {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
} from "sequelize";
import db from "../config/db.ts";
import type TableAttributes from "../interface/tableinterface.ts";
import type User from "./userModel.ts";
import Food from "./foodModel.ts";

class Table extends Model<TableAttributes> {
  declare id?: string;
  declare tableNumber: number;
  declare status?: "available" | "unavailable";
  declare capacity: number;
  declare isDeleted?: boolean;
  declare createdAt?: "createdAt";
  declare updatedAt?: "updatedAt";

  declare addCustomer: BelongsToManyAddAssociationMixin<User, string>;
  declare addCustomers: BelongsToManyAddAssociationsMixin<User, string>;
  declare addWaiter: BelongsToManyAddAssociationMixin<User, string>;
  declare addWaiters: BelongsToManyAddAssociationsMixin<User, string>;
  declare addFood: BelongsToManyAddAssociationMixin<Food, string>;
  declare addFoods: BelongsToManyAddAssociationsMixin<Food, string>;
}

Table.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("available", "unavailable"),
      allowNull: false,
      defaultValue: "available",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "tables",
    timestamps: true,
  },
);

export default Table;
