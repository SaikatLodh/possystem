import { Model, DataTypes } from "sequelize";
import db from "../config/db.ts";

import type { cartItemAttributes } from "../interface/cartItemIterface.ts";

class CartItem extends Model<cartItemAttributes> {
  declare id?: string;
  declare userId: string;
  declare foodId: string;
  declare quantity: number;
  declare isDeleted?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    foodId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
   
    tableName: "cartItems",
    timestamps: true,
  },
);

export default CartItem;
