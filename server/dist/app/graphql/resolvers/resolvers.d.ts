export declare const resolvers: {
    Query: {
        getUser: (parent: any, args: any, context: any, info: any) => Promise<any>;
    };
    Mutation: {
        updateUser: (parent: any, args: any, context: any, info: any) => Promise<any>;
        changePassword: (parent: any, args: any, context: any, info: any) => Promise<any>;
        sendOtp: (_: any, { email }: {
            email: string;
        }) => Promise<{
            status: number;
            message: any;
        }>;
        verifyOtp: (_: any, { email, otp }: {
            email: string;
            otp: number;
        }) => Promise<{
            status: number;
            message: any;
        }>;
        register: (_: any, { fullname, email, password, number, }: {
            fullname: string;
            email: string;
            password: string;
            number: string;
        }) => Promise<{
            status: number;
            message: any;
        }>;
        logIn: (_: any, { email, password, remember, }: {
            email: string;
            password: string;
            remember: boolean;
        }) => Promise<{
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
        forgotSendMail: (_: any, { email }: {
            email: string;
        }) => Promise<{
            status: number;
            message: any;
        }>;
        forgotPassword: (_: any, { newPassword, confirmPassword, token, }: {
            newPassword: string;
            confirmPassword: string;
            token: string;
        }) => Promise<{
            status: number;
            message: any;
        }>;
        refreshToken: (_: any, { token }: {
            token: string;
        }) => Promise<{
            status: number;
            message: string;
            accessToken: never;
        } | {
            status: number;
            message: any;
            accessToken?: never;
        }>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map