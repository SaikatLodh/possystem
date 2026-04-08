import type { Request } from "express";
import User from "../models/userModel.ts";
export declare const authenticateUser: (req: Request) => Promise<User>;
export declare const withAuth: (resolver: Function) => (parent: any, args: any, context: any, info: any) => Promise<any>;
//# sourceMappingURL=authUtils.d.ts.map