import jwt from "jsonwebtoken";
import type { Request } from "express";
import ApiError from "../config/apiError.ts";
import STATUS_CODES from "../config/httpStatusCode.ts";
import User from "../models/userModel.ts";
import type { Role } from "../config/userRoles.ts";

export const authenticateUser = async (req: Request) => {
  const token =
    req?.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.headers["x-access-token"];

  if (!token) {
    throw new ApiError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
  }

  const decode = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
  ) as jwt.JwtPayload;

  if (!decode || typeof decode === "string" || !decode.id) {
    throw new ApiError("Invalid token", STATUS_CODES.UNAUTHORIZED);
  }

  const user = await User.findByPk(decode.id);

  if (!user) {
    throw new ApiError("User not found", STATUS_CODES.NOT_FOUND);
  }

  return user;
};

export const withAuth = (resolver: Function) => {
  return async (parent: any, args: any, context: any, info: any) => {
    try {
      const user = await authenticateUser(context.req);
      context.req.user = user;
      return await resolver(parent, args, context, info);
    } catch (error: any) {
      throw new Error(error.message || "Authentication failed");
    }
  };
};

export const withRole = (allowedRoles: Role[]) => (resolver: Function) => {
  return async (parent: any, args: any, context: any, info: any) => {
    try {
      const user = await authenticateUser(context.req);
      context.req.user = user;

      if (!user.role || !allowedRoles.includes(user.role)) {
        throw new ApiError(
          "Forbidden: You do not have permission to access this resource",
          STATUS_CODES.FORBIDDEN,
        );
      }

      return await resolver(parent, args, context, info);
    } catch (error: any) {
      throw new Error(error.message || "Authorization failed");
    }
  };
};
