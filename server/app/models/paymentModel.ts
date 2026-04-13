import { DataTypes, Model, Sequelize } from "sequelize";
import db from "../config/db.ts";
import type { PaymentAttributes } from "../interface/paymentInterface.ts";

class Payment extends Model<PaymentAttributes> {
    declare id?: string;
    declare bookingId: string;
    declare userId: string;
    declare amount: number;
    declare paymentMethod?: string;
    declare paymentStatus?: string;
    declare isDeleted?: boolean;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Payment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: "",
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: "",
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "cash",
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "pending",
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName: "Payment",
    timestamps: true
})

export default Payment