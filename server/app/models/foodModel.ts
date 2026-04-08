import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";
import type FoodAttributes from "../interface/foodInterface.ts";

class Food extends Model<FoodAttributes> {
  declare id?: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare category: string;
  declare image?: { publicId: string; url: string } | null;
  declare slug?: Promise<string> | string;
  declare numberOfOrders?: number;
  declare isDeleted?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Food.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 50,
        min: 6,
        isLowercase: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 200,
        min: 10,
        isLowercase: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: "",
    },
    numberOfOrders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "foods",
    timestamps: true,
  },
);

export default Food;
