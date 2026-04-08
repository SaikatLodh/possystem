import { Model } from "sequelize";
import type UserAttributes from "../interface/userInterface.ts";
declare class User extends Model<UserAttributes> implements UserAttributes {
    id: string;
    fullname: string;
    email: string;
    password: string;
    number: number;
    profilePicture?: {
        publicId: string;
        url: string;
    } | null;
    role: "customer" | "admin" | "waiter";
    isVerified: boolean;
    forgotPasswordToken?: string | null;
    forgotPasswordExpiry?: Date | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export default User;
//# sourceMappingURL=userModel.d.ts.map