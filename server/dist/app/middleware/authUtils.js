import jwt from "jsonwebtoken";
import ApiError from "../config/apiError.js";
import STATUS_CODES from "../config/httpStatusCode.js";
import User from "../models/userModel.js";
export const authenticateUser = async (req) => {
    const token = req?.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.headers["x-access-token"];
    if (!token) {
        throw new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decode || typeof decode === "string" || !decode.id) {
        throw new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED);
    }
    const user = await User.findByPk(decode.id);
    if (!user) {
        throw new ApiError("User not found", STATUS_CODES.NOT_FOUND);
    }
    return user;
};
export const withAuth = (resolver) => {
    return async (parent, args, context, info) => {
        try {
            const user = await authenticateUser(context.req);
            context.req.user = user;
            return await resolver(parent, args, context, info);
        }
        catch (error) {
            throw new Error(error.message || "Authentication failed");
        }
    };
};
//# sourceMappingURL=authUtils.js.map