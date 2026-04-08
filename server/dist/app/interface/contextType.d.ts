import type { Request, Response } from "express";
export interface User {
    id?: string;
    fullname: string;
    email: string;
    password: string;
    number: number;
    profilePicture?: string;
    role?: "customer" | "admin" | "waiter";
    isVerified: boolean;
    forgotPasswordToken?: string | null;
    forgotPasswordExpiry?: Date | null;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
type GraphQLContext = {
    req: Request & {
        user: User;
    };
    res: Response;
};
export default GraphQLContext;
//# sourceMappingURL=contextType.d.ts.map