import User from "../../models/userModel.ts";
declare class UserController {
    getUsers(id: string): Promise<{
        status: number;
        message: string;
        user: User;
    } | {
        status: number;
        message: any;
        user?: never;
    }>;
    updateUser(id: string, fullname: string, file: {
        filename: string;
        mimetype: string;
        encoding: string;
        data: string;
    } | null): Promise<{
        status: number;
        message: string;
        user: {
            id: string;
            fullname: string;
            email: string;
            profilePicture: {
                publicId: string;
                url: string;
            } | null | undefined;
            role: "customer" | "admin" | "waiter";
        };
    } | {
        status: number;
        message: any;
        user?: never;
    }>;
    changePassword(id: string, oldPassword: string, confirmPassword: string, password: string): Promise<{
        status: number;
        message: any;
    }>;
}
declare const _default: UserController;
export default _default;
//# sourceMappingURL=userController.d.ts.map