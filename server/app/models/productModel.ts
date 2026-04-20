import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";
import type ProductAttributes from "../interface/productInterface.ts";

class Product extends Model<ProductAttributes> {
  declare id?: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare stock?: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    tableName: "products",
    timestamps: true,
  },
);

export default Product;
