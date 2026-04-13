import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";

class BookingFood extends Model {
  declare id: number;
  declare bookingId: string;
  declare foodId: string;
}

BookingFood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: {
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
    modelName: "BookingFood",
    tableName: "BookingFoods",
    timestamps: true,
  }
);

export default BookingFood;
