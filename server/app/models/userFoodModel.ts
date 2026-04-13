import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";

class UserFood extends Model {
  declare id: number;
  declare userId: string;
  declare foodId: string;
}

UserFood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
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
    modelName: "UserFood",
    tableName: "UserFoods",
    timestamps: true,
  }
);

export default UserFood;
