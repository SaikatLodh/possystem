import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";

class TableCustomer extends Model {
  declare id: number;
  declare tableId: string;
  declare userId: string;
}

TableCustomer.init(
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
    modelName: "TableCustomer",
    tableName: "TableCustomers",
    timestamps: true,
  }
);

export default TableCustomer;
