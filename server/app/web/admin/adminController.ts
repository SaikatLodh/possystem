import { col, fn, Op } from "sequelize";
import Booking from "../../models/bookingModel.ts";
import Food from "../../models/foodModel.ts";
import Table from "../../models/tableModel.ts";
import User from "../../models/userModel.ts";
import Payment from "../../models/paymentModel.ts";
import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import sendEmail from "../../helpers/sendmail.ts";
import { createLectureValidation } from "../../helpers/validator/admin/adminValidation.ts";
import bcrypt from "bcryptjs";

// 6 - 2 9 - 6 10 - 7 2 - 10
class AdminController {
  async dashboardData() {
    try {
      // const users = await User.findAll();
      // const tables = await Table.findAll();
      // const foods = await Food.findAll();

      // total number of table bookings
      // const bookings = await Booking.findAll({
      //     attributes: [
      //         "tableId",
      //         [fn("COUNT", col("tableId")), "numberOfBookings"]
      //     ],
      //     group: ["tableId"]
      // });
      // console.log(JSON.parse(JSON.stringify(bookings)))
      //output
      // [
      //     {
      //         tableId: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b',
      //         numberOfBookings: 1
      //     }
      // ]

      // total number of users bookings
      // const bookins = await Booking.findAll({
      //     attributes: [
      //         "userId",
      //         [fn("COUNT", col("userId")), "numberOfBookings"],
      //     ],
      //     group: ["userId"]
      // })
      // console.log(JSON.parse(JSON.stringify(bookins)))
      //output
      // [
      //     {
      //         userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
      //         numberOfBookings: 1
      //     }
      // ]

      // total number of foods orders
      // const foods = await Food.findAll({
      //     attributes: [
      //         "id",
      //         [fn("COUNT", col("id")), "numberOfOrders"],
      //     ],
      //     group: ["id"]
      // })
      // console.log(JSON.parse(JSON.stringify(foods)))
      //output
      // [
      //     {
      //         id: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b',
      //         numberOfOrders: 1
      //     }
      // ]

      // total foods count by each booking
      // const foodsCount = await Booking.findAll({
      //     attributes: [
      //         "id",
      //         [fn("COUNT", col("foods.id")), "numberOfFoods"],
      //     ],
      //     include: [
      //         {
      //             model: Food,
      //             as: "foods",
      //             attributes: [],
      //             through: { attributes: [] }
      //         }
      //     ],
      //     group: ["Booking.id"]
      // })
      // console.log(JSON.parse(JSON.stringify(foodsCount)))
      //output
      // [
      //     { id: '04c288dc-0913-494d-ac17-4f4a40950f97', numberOfFoods: 3 }
      // ]

      // total foods perchesed by per user
      // const foodsPerchesedByUser = await Booking.findAll({
      //     attributes: [
      //         "userId",
      //         [fn("COUNT", col("foods.id")), "numberOfFoods"]
      //     ],
      //     include: [
      //         {
      //             model: Food,
      //             as: "foods",
      //             attributes: [],
      //             through: { attributes: [] }
      //         }
      //     ],
      //     group: ["Booking.userId"]
      // })
      // console.log(JSON.parse(JSON.stringify(foodsPerchesedByUser)))
      //output
      // [
      //     { userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65', numberOfFoods: 3 }
      // ]

      // foods for per table
      // const foodsPertable = await Table.findAll({
      //     attributes: [
      //         "id",
      //         [fn("COUNT", col("foods.id")), "numberOfFoods"]
      //     ],
      //     include: [
      //         {
      //             model: Food,
      //             as: "foods",
      //             attributes: [],
      //             through: { attributes: [] }
      //         }
      //     ],
      //     group: ["Table.id"]
      // })
      // console.log(JSON.parse(JSON.stringify(foodsPertable)))
      //output
      // [
      //     { id: '020d08ba-fe20-4f38-b0b4-46a7ccafd17b', numberOfFoods: 3 },
      //     { id: '04ea15b3-8776-4aa4-89d0-e54090ca193b', numberOfFoods: 0 }
      // ]

      // booking payments details
      // const payments = await Booking.findAll({
      //     where: { id: "041c57f7-34d0-4381-962b-fe580373aac7" },
      //     include: [
      //         {
      //             model: Payment,
      //             as: "payment",
      //             attributes: ["amount", "paymentMethod", "paymentStatus"]
      //         }
      //     ]
      // })
      // console.log(JSON.parse(JSON.stringify(payments)))
      //output
      // [
      //     {
      //         id: '04c288dc-0913-494d-ac17-4f4a40950f97',
      //         bookingId: '04c288dc-0913-494d-ac17-4f4a40950f97',
      //         userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
      //         amount: 100,
      //         paymentMethod: 'cash',
      //         paymentStatus: 'paid'
      //     }
      // ]

      // user payments details
      // const userPayments = await User.findAll({

      //     include: [
      //         {
      //             model: Payment,
      //             as: "payments",
      //             attributes: ["amount", "paymentMethod", "paymentStatus"]
      //         }
      //     ]
      // })
      // console.dir(JSON.parse(JSON.stringify(userPayments)), { depth: null });

      //output
      // [
      //     {
      //         id: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
      //         name: 'saikat',
      //         email: [EMAIL_ADDRESS]',
      //         role: 'user',
      //         createdAt: '2026-04-14T06:43:24.000Z',
      //         updatedAt: '2026-04-14T06:43:24.000Z',
      //         payments: [
      //             {
      //                 id: '041c57f7-34d0-4381-962b-fe580373aac7',
      //                 bookingId: '041c57f7-34d0-4381-962b-fe580373aac7',
      //                 userId: '7d90f668-bc05-48b9-8d7a-e4a7167baa65',
      //                 amount: 100,
      //                 paymentMethod: 'cash',
      //                 paymentStatus: 'paid',
      //                 createdAt: '2026-04-14T06:43:24.000Z',
      //                 updatedAt: '2026-04-14T06:43:24.000Z'
      //             }
      //         ]
      //     }
      // ]

      const payments = await Payment.findAll({
        attributes: [
          "id",
          "amount",
          "paymentMethod",
          "paymentStatus",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "fullname",
              "email",
              "number",
              "role",
              "isDeleted",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            model: Booking,
            as: "booking",
            attributes: ["id", "tableId"],
            include: [
              {
                model: Table,
                as: "table",
                attributes: ["id", "tableNumber", "capacity", "status"],
              },
            ],
          },
        ],
      });

      // Now convert to plain JSON safely
      const plainPayments = payments.map((p) => p.get({ plain: true }));

      const populerDishes = await Food.findAll({
        where: {
          numberOfOrders: {
            [Op.gt]: 0
          },
          isDeleted: false
        },
        order: [
          ["numberOfOrders", "DESC"],

        ],
        attributes: [
          "id",
          "name",
          "price",
          "image",
          "description",
          "numberOfOrders",
          "category",
          "createdAt",
          "updatedAt",
        ],

      });
      const plainPopulerDishes = populerDishes.map((p) => p.get({ plain: true }));

      const formattedPopulerDishes = plainPopulerDishes.map((item) => {
        const plainItem = item;
        let imageUrl = null;
        if (plainItem.image) {
          const imageObj =
            typeof plainItem.image === "string"
              ? JSON.parse(plainItem.image)
              : plainItem.image;
          imageUrl = imageObj.url || null;
        }
        return {
          ...plainItem,
          image: imageUrl,
        };
      });

      const allData = {
        recentOrder: plainPayments,
        popularDishes: formattedPopulerDishes,
      };


      return {
        status: STATUS_CODES.OK,
        message: "Dashboard data fetched successfully",
        data: allData,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async createWaiter({
    fullname,
    email,
    password,
    number,
  }: {
    fullname: string;
    email: string;
    password: string;
    number: string;
  }) {
    try {
      const { error } = createLectureValidation({
        fullname,
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

      const checkUser = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { number: number }],
        },
      });

      if (checkUser) {
        logger.error("Email or phone number already exists");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Email or phone number already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newPassword = hashedPassword;

      const createUser = await User.create({
        fullname: fullname.toLowerCase(),
        email: email,
        password: newPassword,
        number: Number(number),
        role: "waiter",
        isVerified: true,
      });

      if (!createUser) {
        logger.error("Failed to create user");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to create user",
        };
      }

      const options = {
        email: email,
        subject:
          "Your account is created successfully! Please verify your email address to login.",
        message: `
              <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; color: #333">
        <div
          style="
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
          "
        >
          <h2 style="color: #4caf50">Welcome to POSS 🎉</h2>
          <p>Dear <strong>${fullname}</strong>,</p>
          <p>
            Your account has been successfully created. Below are your login
            credentials:
          </p>
    
          <div
            style="
              background: #f9f9f9;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #ddd;
            "
          >
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
    
          <p style="color: #d9534f; font-size: 14px">
            <strong>Important:</strong> Please change your password after your first
            login to keep your account secure.
          </p>
    
          <p>
            You can log in here:
            <a href=${process.env.CLIENT_URL} style="color: #4caf50">${process.env.CLIENT_URL}</a>
          </p>
    
          <p>
            Thank you,<br />
            <strong>Powered by Team</strong>
          </p>
        </div>
      </body>
    </html>
    `,
      };

      try {
        await sendEmail(options);

        logger.info("Waiter created and email sent successfully");
        return {
          status: STATUS_CODES.CREATED,
          message: "Waiter created and email sent successfully",
        };
      } catch (error: any) {
        logger.error(error.message);
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

  async getAllWaiters() {
    try {
      const waiters = await User.findAll({
        where: { role: "waiter" },
        attributes: {
          exclude: [
            "password",
            "isVerified",
            "forgotPasswordToken",
            "forgotPasswordExpiry",
          ],
        },
        order: [["createdAt", "DESC"]],
      });
      if (!waiters) {
        logger.error("Waiters not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Waiters not found",
        };
      }
      const planeWaiters = JSON.parse(JSON.stringify(waiters)).map(
        (w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt).toISOString(),
          updatedAt: new Date(w.updatedAt).toISOString(),
        }),
      );
      logger.info("Waiters fetched successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
        waiters: planeWaiters,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async deleteWaiter({ id }: { id: string }) {
    try {
      const waiter = await User.findOne({ where: { id: id, role: "waiter" } });
      if (!waiter) {
        logger.error("Waiter not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Waiter not found",
        };
      }
      await waiter.update({ isDeleted: true });
      logger.info("Waiter deleted successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Waiter deleted successfully",
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

export default new AdminController();
