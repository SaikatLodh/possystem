import STATUS_CODES from "../../config/httpStatusCode.js";
import logger from "../../helpers/logger.js";
import { updatePasswordSchema, updateUserSchema, } from "../../helpers/validator/user/userValidator.js";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { saveAndUploadFile } from "../../helpers/fileUpload.js";
class UserController {
    async getUsers(id) {
        try {
            logger.info(`Fetching profile for user: userId=${id}`);
            const user = await User.findByPk(id, {
                attributes: {
                    exclude: [
                        "password ",
                        "isVerified",
                        "forgotPasswordToken",
                        "forgotPasswordExpiry",
                    ],
                },
            });
            if (!user) {
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: "User not found",
                };
            }
            logger.info(`Profile fetched successfully for user: userId=${id}`);
            return {
                status: STATUS_CODES.OK,
                message: "success",
                user,
            };
        }
        catch (error) {
            logger.error(error.message);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error.message || "Internal Server Error",
            };
        }
    }
    async updateUser(id, fullname, file) {
        try {
            const { error } = updateUserSchema.validate({ fullname });
            logger.info(`Updating user profile: userId=${id}`);
            const user = await User.findByPk(id);
            if (!user) {
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: "User not found",
                };
            }
            if (fullname) {
                user.fullname = fullname;
            }
            if (file && file.data) {
                const uploadedFile = await saveAndUploadFile(file, "uploads");
                if (uploadedFile) {
                    user.profilePicture = {
                        publicId: uploadedFile.publicId,
                        url: uploadedFile.url,
                    };
                }
            }
            await user.save({ validate: false });
            logger.info(`User profile updated successfully: userId=${id}`);
            return {
                status: STATUS_CODES.OK,
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    role: user.role,
                },
            };
        }
        catch (error) {
            logger.error(error.message);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error.message || "Internal Server Error",
            };
        }
    }
    async changePassword(id, oldPassword, confirmPassword, password) {
        try {
            logger.info(`Updating password for user: userId=${id}`);
            const { error } = updatePasswordSchema.validate({
                oldPassword,
                password,
                confirmPassword,
            });
            if (error) {
                logger.warn(`Validation error for password update: ${error?.details[0]?.message}`);
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: error?.details[0]?.message,
                };
            }
            if (password !== confirmPassword) {
                logger.warn("Password confirmation mismatch for user: userId=${userId}");
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: "Password confirmation mismatch",
                };
            }
            const finduser = await User.findByPk(id);
            const comparePassword = await bcrypt.compare(oldPassword, finduser.password);
            if (!comparePassword) {
                logger.warn(`Incorrect old password for user: userId=${id}`);
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: "Incorrect old password",
                };
            }
            const hashPassword = await bcrypt.hash(confirmPassword, 10);
            finduser.password = hashPassword;
            await finduser.save({ validate: false });
            logger.info(`Password updated successfully for user: userId=${id}`);
            return {
                status: STATUS_CODES.OK,
                message: "Password updated successfully",
            };
        }
        catch (error) {
            logger.error(error.message);
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error.message || "Internal Server Error",
            };
        }
    }
}
export default new UserController();
//# sourceMappingURL=userController.js.map