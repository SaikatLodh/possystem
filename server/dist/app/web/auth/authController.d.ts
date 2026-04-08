declare class AuthController {
    sendOtp(email: string): Promise<{
        status: number;
        message: any;
    }>;
    verifyOtp(email: string, otp: number): Promise<{
        status: number;
        message: any;
    }>;
    register(fullname: string, email: string, password: string, number: string): Promise<{
        status: number;
        message: any;
    }>;
    logIn(password: string, email: string, remember: boolean): Promise<{
        status: number;
        accessToken: never;
        refreshToken: never;
        message: string;
    } | {
        status: number;
        message: any;
        accessToken?: never;
        refreshToken?: never;
    } | undefined>;
    forgotSendMail(email: string): Promise<{
        status: number;
        message: any;
    }>;
    forgotPassword(newPassword: string, confirmPassword: string, token: string): Promise<{
        status: number;
        message: any;
    }>;
    refreshToken(token: string): Promise<{
        status: number;
        message: string;
        accessToken: never;
    } | {
        status: number;
        message: any;
        accessToken?: never;
    }>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=authController.d.ts.map