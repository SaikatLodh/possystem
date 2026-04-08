import Joi from "joi";
export declare const sendOtpValidation: (data: {
    email: string;
}) => Joi.ValidationResult<any>;
export declare const validateOtpValidation: (data: {
    email: string;
    otp: number;
}) => Joi.ValidationResult<any>;
export declare const registerValidation: (data: {
    fullName: string;
    email: string;
    password: string;
    number: string;
}) => Joi.ValidationResult<any>;
export declare const loginValidation: (data: {
    email: string;
    password: string;
    remember: boolean;
}) => Joi.ValidationResult<any>;
export declare const forgotsendemailValidation: (data: {
    email: string;
}) => Joi.ValidationResult<any>;
export declare const forgotrestpasswordValidation: (data: {
    newPassword: string;
    confirmPassword: string;
}) => Joi.ValidationResult<any>;
export declare const googleSignUpvalidation: (data: {
    code: string;
}) => Joi.ValidationResult<any>;
export declare const googleSignInValidation: (data: {
    code: string;
}) => Joi.ValidationResult<any>;
export declare const facebookSignupValidation: (data: {
    name: string;
    email: string;
    id: string;
    avatar: string;
}) => Joi.ValidationResult<any>;
export declare const facebookSignInValidation: (data: {
    id: string;
}) => Joi.ValidationResult<any>;
//# sourceMappingURL=authValidation.d.ts.map