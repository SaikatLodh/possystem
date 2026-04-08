import { ROLES } from "../config/userRoles.ts";

export default interface UserAttributes {
  id?: string;
  fullname: string;
  email: string;
  password: string;
  number: number;
  profilePicture?: { publicId: string; url: string } | null;
  role?: ROLES;
  isVerified?: boolean;
  forgotPasswordToken?: string | null;
  forgotPasswordExpiry?: Date | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
