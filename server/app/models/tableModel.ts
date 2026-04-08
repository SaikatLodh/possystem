import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";
import type TableAttributes from "../interface/tableinterface.ts";

class Table extends Model<TableAttributes> {
  declare id?: string;
  declare tableNumber: number;
  declare status?: "available" | "unavailable";
  declare capacity: number;
  declare confirmedByWaiters?: Array<string>;
  declare isDeleted: boolean;
  declare createdAt?: "createdAt";
  declare updatedAt?: "updatedAt";
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
      type: DataTypes.STRING,
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
    confirmedByWaiters: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize: db,
    tableName: "tables",
    timestamps: true,
  },
);

export default Table;
