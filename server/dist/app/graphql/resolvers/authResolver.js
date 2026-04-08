import authController from "../../web/auth/authController.js";
export const authResolvers = {
    Mutation: {
        sendOtp: (_, { email }) => {
            return authController.sendOtp(email);
        },
        verifyOtp: (_, { email, otp }) => {
            return authController.verifyOtp(email, otp);
        },
        register: (_, { fullname, email, password, number, }) => {
            return authController.register(fullname, email, password, number);
        },
        logIn: (_, { email, password, remember, }) => {
            return authController.logIn(password, email, remember);
        },
        forgotSendMail: (_, { email }) => {
            return authController.forgotSendMail(email);
        },
        forgotPassword: (_, { newPassword, confirmPassword, token, }) => {
            return authController.forgotPassword(newPassword, confirmPassword, token);
        },
        refreshToken: (_, { token }) => {
            return authController.refreshToken(token);
        },
    },
};
//# sourceMappingURL=authResolver.js.map