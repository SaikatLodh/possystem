import { Model } from "sequelize";
import type OtpAttributes from "../interface/otpInterface.ts";
export declare class Otp extends Model<OtpAttributes> implements OtpAttributes {
    id: string;
    email: string;
    otp: number;
    otpExpire: Date;
    isotpsend: boolean;
    otpVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export default Otp;
//# sourceMappingURL=otpModel.d.ts.map