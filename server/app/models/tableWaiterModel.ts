import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";

class TableWaiter extends Model {
  declare id: number;
  declare tableId: string;
  declare userId: string;
}

TableWaiter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "TableWaiter",
    tableName: "TableWaiters",
    timestamps: true,
  }
);

export default TableWaiter;
