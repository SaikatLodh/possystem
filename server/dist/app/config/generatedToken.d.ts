declare const generateAccessAndRefreshToken: (userId: string) => Promise<{
    status: number;
    message: string;
    accessToken?: never;
    refreshToken?: never;
} | {
    accessToken: never;
    refreshToken: never;
    status?: never;
    message?: never;
} | undefined>;
export default generateAccessAndRefreshToken;
//# sourceMappingURL=generatedToken.d.ts.map