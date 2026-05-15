import { DataTypes, Model } from "sequelize";
import type {
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from "sequelize";
import type { BookingAttributes } from "../interface/bookInterface.ts";
import type Food from "./foodModel.ts";
import db from "../config/db.ts";

class Booking extends Model<BookingAttributes> {
  declare id?: string;
  declare tableId: string;
  declare userId: string;
  declare isDeleted?: boolean;
  declare confirmStatus?: "confirmed" | "not confirmed" | "pending";
  declare paymentStatus?: "paid" | "unpaid" | "pending";
  declare confirmBy?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  // Add the addFoods association mixin for the many-to-many relationship
  declare addFoods: BelongsToManyAddAssociationsMixin<Food, string>;
  declare setFoods: BelongsToManySetAssociationsMixin<Food, string>;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: "",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: "",
    },
    paymentStatus: {
      type: DataTypes.ENUM("paid", "unpaid", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    confirmStatus: {
      type: DataTypes.ENUM("confirmed", "not confirmed", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    confirmBy: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: "",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "Booking",
  },
);

export default Booking;
