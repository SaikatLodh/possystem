import { DataTypes, Model } from "sequelize";
import db from "../config/db.ts";
import type OtpAttributes from "../interface/otpInterface.ts";

export class Otp extends Model<OtpAttributes> implements OtpAttributes {
  declare id?: string;
  declare email: string;
  declare otp: number;
  declare otpExpire?: Date;
  declare isotpsend?: boolean;
  declare otpVerified?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1000,
        max: 9999,
        isNumeric: true,
      },
    },
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isotpsend: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    otpVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  { sequelize: db, tableName: "otp", timestamps: true },
);

export default Otp;
