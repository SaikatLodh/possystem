export default interface UserAttributes {
    id?: string;
    fullname: string;
    email: string;
    password: string;
    number: number;
    profilePicture?: {
        publicId: string;
        url: string;
    } | null;
    role?: "customer" | "admin" | "waiter";
    isVerified: boolean;
    forgotPasswordToken?: string | null;
    forgotPasswordExpiry?: Date | null;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=userInterface.d.ts.map