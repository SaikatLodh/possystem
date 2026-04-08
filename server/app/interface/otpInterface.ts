export default interface OtpAttributes {
  id?: string;
  email: string;
  otp: number;
  otpExpire?: Date | null;
  isotpsend?: boolean;
  otpVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
