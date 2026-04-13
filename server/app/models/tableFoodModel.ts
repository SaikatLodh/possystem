import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";

class TableFood extends Model {
  declare id: number;
  declare tableId: string;
  declare foodId: string;
}

TableFood.init(
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
    foodId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "TableFood",
    tableName: "TableFoods",
    timestamps: true,
  }
);

export default TableFood;
