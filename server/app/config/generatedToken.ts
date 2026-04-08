import logger from "../helpers/logger.ts";
import User from "../models/userModel.ts";
import jwt from "jsonwebtoken";
import STATUS_CODES from "./httpStatusCode.ts";

const generateAccessAndRefreshToken = async (
  userId: string,
  remember: boolean = false,
) => {
  try {
    const findUser = await User.findByPk(userId);

    if (!findUser) {
      logger.error("User not found");
      return {
        status: STATUS_CODES.NOT_FOUND,
        message: "User not found",
      };
    }

    const accessToken = jwt.sign(
      {
        id: findUser?.id,
        email: findUser?.email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME! as string },
    );

    const refreshToken = jwt.sign(
      {
        id: findUser?.id,
        email: findUser?.email,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: remember
          ? (process.env.LONG_REFRESH_TOKEN_EXPIRATION_TIME! as string)
          : (process.env.REFRESH_TOKEN_EXPIRATION_TIME! as string),
      },
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export default generateAccessAndRefreshToken;
