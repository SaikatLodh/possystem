import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import {
  updatePasswordSchema,
  updateUserSchema,
} from "../../helpers/validator/user/userValidator.ts";
import User from "../../models/userModel.ts";
import bcrypt from "bcryptjs";
import { saveAndUploadFile } from "../../helpers/fileUpload.ts";

class UserController {
  async getUsers(id: string) {
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
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async updateUser(
    id: string,
    fullname: string,
    file: {
      filename: string;
      mimetype: string;
      encoding: string;
      data: string;
    } | null,
  ) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      logger.info(`Updating user profile: userId=${id}`);

      if (file && file.data) {
        const uploadedFile = await saveAndUploadFile(file, "uploads");

        if (!uploadedFile) {
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "File upload failed",
          };
        }

        if (uploadedFile) {
          user.profilePicture = {
            publicId: uploadedFile.publicId,
            url: uploadedFile.url,
          };
        }
      } else {
        const { error } = updateUserSchema.validate({ fullname });

        if (error) {
          logger.warn(
            `Validation error for profile update: ${error?.details[0]?.message}`,
          );
          return {
            status: STATUS_CODES.BAD_REQUEST,
            message: error?.details[0]?.message,
          };
        }
        user.fullname = fullname;
      }

      await user.save({ validate: false });

      logger.info(`User profile updated successfully: userId=${id}`);
      return {
        status: STATUS_CODES.OK,
        message: "Profile updated successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async changePassword(
    id: string,
    oldPassword: string,
    confirmPassword: string,
    password: string,
  ) {
    try {
      logger.info(`Updating password for user: userId=${id}`);

      const { error } = updatePasswordSchema.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      if (error) {
        logger.warn(
          `Validation error for password update: ${error?.details[0]?.message}`,
        );
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      if (password !== confirmPassword) {
        logger.warn(
          "Password confirmation mismatch for user: userId=${userId}",
        );
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Password confirmation mismatch",
        };
      }

      const finduser: any = await User.findByPk(id);

      const comparePassword = await bcrypt.compare(
        oldPassword,
        finduser.password,
      );

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
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }
}

export default new UserController();
