import authController from "../../web/auth/authController.ts";

export const authResolvers = {
  Mutation: {
    sendOtp: (_: any, { email }: { email: string }) => {
      return authController.sendOtp(email);
    },
    verifyOtp: (_: any, { email, otp }: { email: string; otp: number }) => {
      return authController.verifyOtp(email, otp);
    },
    register: (
      _: any,
      {
        fullname,
        email,
        password,
        number,
      }: { fullname: string; email: string; password: string; number: string },
    ) => {
      return authController.register(fullname, email, password, number);
    },
    logIn: (
      _: any,
      {
        email,
        password,
        remember,
      }: {
        email: string;
        password: string;
        remember: boolean;
      },
    ) => {
      return authController.logIn(password, email, remember);
    },
    forgotSendMail: (_: any, { email }: { email: string }) => {
      return authController.forgotSendMail(email);
    },
    forgotPassword: (
      _: any,
      {
        newPassword,
        confirmPassword,
        token,
      }: { newPassword: string; confirmPassword: string; token: string },
    ) => {
      return authController.forgotPassword(newPassword, confirmPassword, token);
    },
    refreshToken: (_: any, { token }: { token: string }) => {
      return authController.refreshToken(token);
    },
  },
};
