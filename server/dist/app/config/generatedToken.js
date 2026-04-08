import logger from "../helpers/logger.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import STATUS_CODES from "./httpStatusCode.js";
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const findUser = await User.findByPk(userId);
        if (!findUser) {
            logger.error("User not found");
            return {
                status: STATUS_CODES.NOT_FOUND,
                message: "User not found",
            };
        }
        const accessToken = jwt.sign({
            id: findUser?.id,
            email: findUser?.email,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });
        const refreshToken = jwt.sign({
            id: findUser?.id,
            email: findUser?.email,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
    }
};
export default generateAccessAndRefreshToken;
//# sourceMappingURL=generatedToken.js.map