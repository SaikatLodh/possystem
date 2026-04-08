import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
class User extends Model {
}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 100,
            min: 6,
            isLowercase: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [10, 10],
            isNumeric: true,
        },
    },
    profilePicture: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    },
    role: {
        type: DataTypes.ENUM("customer", "admin", "waiter"),
        allowNull: false,
        defaultValue: "customer",
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    forgotPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    forgotPasswordExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db,
    tableName: "users",
    timestamps: true,
});
export default User;
//# sourceMappingURL=userModel.js.map