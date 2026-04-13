import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import sendEmail from "../../helpers/sendmail.ts";
import {
  forgotrestpasswordValidation,
  forgotsendemailValidation,
  loginValidation,
  registerValidation,
  sendOtpValidation,
  validateOtpValidation,
} from "../../helpers/validator/auth/authValidation.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Otp from "../../models/otpModel.ts";
import User from "../../models/userModel.ts";
import generateAccessAndRefreshToken from "../../config/generatedToken.ts";
import { Op } from "sequelize";

class AuthController {
  async sendOtp(email: string) {
    const { error } = sendOtpValidation({ email });
    if (error) {
      logger.error(error?.details[0]?.message || error?.message);
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: error?.details[0]?.message,
      };
    }

    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
      logger.error("Email already exists");
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: "Email already exists",
      };
    }

    const checkEmail = await Otp.findOne({ where: { email: email } });

    if (checkEmail) {
      await Otp.destroy({ where: { email: email } });
    }

    const generateOtp = Math.floor(1000 + Math.random() * 9000);

    const createOtp = await Otp.create({
      email: email,
      otp: generateOtp,
      otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (!createOtp) {
      logger.error("Failed to send otp");
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: "Failed to send otp",
      };
    }

    const mailOption = {
      email: email,
      subject: "OTP for email verification",
      message: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f4f4f4"
    >
      <tr>
        <td align="center" style="padding: 20px">
          <table
            role="presentation"
            width="600"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td style="padding: 30px">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 20px">
                    <h2 style="color: green;">Athena</h2>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <h1 style="color: #333333; margin: 0; font-size: 24px">
                        One-Time OTP (OTP)
                      </h1>
                    </td>
                  </tr>
                </table>

                <table
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin-top: 20px"
                >
                  <tr>
                    <td
                      style="color: #666666; font-size: 16px; line-height: 1.6"
                    >
                      <p>Hello,</p>
                      <p>
                        You are two steps away from completing your registration. Use the following One-Time OTP to verify
                        your identity.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0">
                      <div
                        style="
                          background-color: #f0f0f0;
                          border: 1px solid #e0e0e0;
                          border-radius: 4px;
                          display: inline-block;
                          padding: 15px 30px;
                        "
                      >
                        <h2
                          style="
                            color: #007bff;
                            margin: 0;
                            font-size: 32px;
                            letter-spacing: 5px;
                          "
                        >
                          ${createOtp.otp}
                        </h2>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="color: #666666; font-size: 16px; line-height: 1.6"
                    >
                      <p>
                        This code is valid for
                        <strong>2</strong> minutes. Please enter it on the
                        verification screen to proceed.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px">
                      <hr style="border: none; border-top: 1px solid #dddddd" />
                      <p
                        style="
                          color: #888888;
                          font-size: 14px;
                          margin-top: 20px;
                        "
                      >
                        <strong>Security Notice:</strong> Do not share this code
                        with anyone. We will never ask you for your password or
                        this code in an email or phone call. If you did not
                        request this, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table
            role="presentation"
            width="600"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="margin-top: 20px"
          >
            <tr>
              <td
                align="center"
                style="color: #999999; font-size: 12px; line-height: 1.5"
              >
                <p>&copy; 2025 LMS APP. All rights reserved.</p>
                <p>123 Main Street, Anytown, USA 12345</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    };

    try {
      await sendEmail(mailOption);
      createOtp.isotpsend = true;
      await createOtp.save({ validate: false });
      logger.info("Otp sent successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Otp sent successfully",
      };
    } catch (error: any) {
      createOtp.isotpsend = false;
      await createOtp.save({ validate: false });
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async verifyOtp(email: string, otp: number) {
    try {
      const { error } = validateOtpValidation({ email, otp });

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const findOtp = await Otp.findOne({ where: { email } });

      if (!findOtp) {
        logger.error("Email not found");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email not found",
        };
      }

      if (!findOtp.isotpsend) {
        logger.error("Otp not sent");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Otp not sent",
        };
      }

      if (findOtp.otp !== Number(otp)) {
        logger.error("Invalid otp");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Invalid otp",
        };
      }

      if (findOtp.otpExpire && findOtp.otpExpire.getTime() < Date.now()) {
        logger.error("Otp expired");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Otp expired",
        };
      }

      findOtp.isotpsend = false;
      findOtp.otpVerified = true;
      await findOtp.save({ validate: false });
      logger.info("Otp verified");

      return {
        status: STATUS_CODES.OK,
        message: "Otp verified",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async register(
    fullname: string,
    email: string,
    password: string,
    number: string,
  ) {
    try {
      const { error } = registerValidation({
        fullName: fullname,
        email,
        password,
        number,
      });

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const verifyEmail = await Otp.findOne({ where: { email } });

      if (!verifyEmail) {
        logger.error("Enter the verified email");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Enter the verified email",
        };
      }

      if (!verifyEmail.otpVerified) {
        logger.error("Otp not verified");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Otp not verified",
        };
      }

      const checkEmail = await User.findOne({ where: { email } });
      if (checkEmail) {
        logger.error("Email already exists");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email already exists",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);
      password = hashPassword;

      const createUser = await User.create({
        email,
        fullname: fullname.toLowerCase(),
        password,
        number: Number(number),
        isVerified: true,
      });

      if (!createUser) {
        logger.error("Failed to register user");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to register user",
        };
      }
      await Otp.destroy({ where: { email } });
      logger.info("User register successfully");
      return {
        status: STATUS_CODES.CREATED,
        message: "User register successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async logIn(password: string, email: string, remember: boolean) {
    try {
      const { error } = loginValidation({ email, password, remember });

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const checkUser = await User.findOne({
        where: { email: email },
      });

      if (!checkUser) {
        logger.error("Email does not exist");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email does not exist",
        };
      }

      if (!checkUser.isVerified) {
        logger.error("Email is not verified");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email is not verified",
        };
      }

      if (checkUser.role === "admin") {
        logger.error("Admin can not login");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Admin can not login",
        };
      }

      if (checkUser.isDeleted) {
        logger.error("User is deleted");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "User is deleted",
        };
      }

      const comparePassword = await bcrypt.compare(
        password,
        checkUser.password as string,
      );

      if (!comparePassword) {
        logger.error("Password is incorrect");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Password is incorrect",
        };
      }

      if (comparePassword) {
        const tokens = await generateAccessAndRefreshToken(
          checkUser.id as string,
          remember,
        );

        if (!tokens?.accessToken && !tokens?.refreshToken) {
          logger.error("Failed to generate tokens");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Failed to generate tokens",
          };
        }

        const { accessToken, refreshToken } = tokens;

        logger.info("User login successfully");
        return {
          status: STATUS_CODES.OK,
          accessToken,
          refreshToken,
          message: "User login successfully",
        };
      }
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async forgotSendMail(email: string) {
    try {
      logger.info(`Password reset request for email: ${email}`);

      const { error } = forgotsendemailValidation({ email });

      if (error) {
        logger.warn(
          `Password reset validation failed for email: ${email}: ${error?.details[0]?.message}`,
        );
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const checkEmail = await User.findOne({ where: { email } });
      if (!checkEmail) {
        logger.warn(`Invalid email for password reset: ${email}`);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Invalid email for password reset",
        };
      }

      const generateToken = crypto.randomBytes(32).toString("hex");
      const token = crypto
        .createHash("sha256")
        .update(generateToken)
        .digest("hex");
      checkEmail.forgotPasswordToken = token;
      checkEmail.forgotPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await checkEmail.save({ validate: false });

      const resetPasswordUrl = `${process.env.CLIENT_URL}/forgot-send-email/${token}`;

      const message = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 30px;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <h2 style="color: green;">Athena</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="color: #333333; margin: 0; font-size: 24px;">Password Reset</h1>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>Hello ${checkEmail.fullname},</p>
                                        <p>We received a request to reset the password for your account associated with this email address. If you made this request, click the button below to set a new password.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <a href="${resetPasswordUrl}" target="_blank" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666666; font-size: 16px; line-height: 1.6;">
                                        <p>This password reset link is valid for **15 minutes**. After that, it will expire and you will need to request a new one.</p>
                                        <p>If the button above doesn't work, you can copy and paste this URL into your web browser:</p>
                                        <p><a href="${resetPasswordUrl}" target="_blank" style="color: #007bff; word-break: break-all;">${resetPasswordUrl}</a></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <hr style="border: none; border-top: 1px solid #dddddd;">
                                        <p style="color: #888888; font-size: 14px; margin-top: 20px;">
                                            <strong>Didn't request this?</strong> If you did not request a password reset, please ignore this email. Your password is safe and will not be changed.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center" style="color: #999999; font-size: 12px; line-height: 1.5;">
                            <p>&copy; 2025 LMS APP. All rights reserved.</p>
                            <p>[Your Company Address, e.g., 123 Main Street, Anytown, USA 12345]</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

      try {
        await sendEmail({
          email: checkEmail.email,
          subject: "Possystem Reset Password",
          message: message,
        });

        logger.info(`Password reset email sent successfully to: ${email}`);
        return {
          status: STATUS_CODES.OK,
          message: "Password reset email sent successfully",
        };
      } catch (error: any) {
        checkEmail.forgotPasswordToken = null;
        checkEmail.forgotPasswordToken = null;
        await checkEmail.save({ validate: false });
        logger.error(
          `Failed to send password reset email to ${email}: ${error.message}`,
        );
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: error.message || "Internal Server Error",
        };
      }
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async forgotPassword(
    newPassword: string,
    confirmPassword: string,
    token: string,
  ) {
    try {
      if (!token) {
        logger.error("Token is required");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Token is required",
        };
      }

      if (typeof token !== "string") {
        logger.error("Token must be string");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Token must be string",
        };
      }

      const { error } = forgotrestpasswordValidation({
        newPassword,
        confirmPassword,
      });

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      if (newPassword !== confirmPassword) {
        logger.error("Password and confirm password is not same");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "New password and confirm password is not same",
        };
      }

      const checkValidation = await User.findOne({
        where: {
          forgotPasswordToken: token,
          forgotPasswordExpiry: { [Op.gt]: Date.now() },
        },
      });

      if (!checkValidation) {
        logger.error("Token is invalid");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Token is invalid",
        };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const password = hashedPassword;

      checkValidation.password = password;
      checkValidation.forgotPasswordToken = null;
      checkValidation.forgotPasswordExpiry = null;

      await checkValidation.save({ validate: false });

      logger.info("Password reset successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Password reset successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async refreshToken(token: string) {
    try {
      if (!token) {
        logger.error("Unauthorized");
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          message: "Unauthorized",
        };
      }

      const decode = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as any;

      if (!decode) {
        logger.error("Invalid token");
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          message: "Invalid token",
        };
      }

      const user = await User.findByPk(decode.id);

      if (!user) {
        logger.error("User not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      const tokens = await generateAccessAndRefreshToken(user.id as string);

      if (!tokens || !tokens.accessToken) {
        logger.error("Failed to generate tokens");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to generate tokens",
        };
      }

      const { accessToken } = tokens;

      logger.info("Refresh token successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Refresh token successfully",
        accessToken,
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

export default new AuthController();
