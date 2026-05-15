import Booking from "../../models/bookingModel.ts";
import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import Table from "../../models/tableModel.ts";
import Food from "../../models/foodModel.ts";
import User from "../../models/userModel.ts";
import BookingFood from "../../models/bookingFoodModel.ts";
import TableFood from "../../models/tableFoodModel.ts";
import UserFood from "../../models/userFoodModel.ts";
import TableCustomer from "../../models/tableCustomerModel.ts";

class BookingController {
  async createBooking({
    tableId,
    foodsId,
    userId,
  }: {
    tableId: string;
    foodsId: string[];
    userId: string;
  }) {
    try {
      if (!tableId && !foodsId) {
        logger.error("Please provide tableId and foodsId");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Please provide tableId and foodsId",
        };
      }

      const table = await Table.findByPk(tableId);
      if (!table) {
        logger.error("Table not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Table not found",
        };
      }

      const user = await User.findByPk(userId);
      if (!user) {
        logger.error("User not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      const booking = await Booking.create({
        tableId,
        userId,
      });

      if (!booking) {
        logger.error("Booking not created");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Booking not created",
        };
      }

      const bookingFoodsData = foodsId.map((foodId) => ({
        bookingId: booking.id,
        foodId,
      }));
      const tableFoodsData = foodsId.map((foodId) => ({
        tableId: table.id,
        foodId,
      }));
      const userFoodsData = foodsId.map((foodId) => ({
        userId: user.id,
        foodId,
      }));

      await BookingFood.bulkCreate(bookingFoodsData);
      await TableCustomer.create({ tableId: table.id, userId: user.id });
      await TableFood.bulkCreate(tableFoodsData);
      await UserFood.bulkCreate(userFoodsData);

      table.status = "unavailable";
      await table.save({ validate: false });

      logger.info("Booking created successfully");
      return {
        status: STATUS_CODES.CREATED,
        message: "Booking created successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async geetBookings() {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Table,
            as: "table",
            attributes: ["id", "tableNumber", "capacity", "status"],
          },
          {
            model: Food,
            as: "foods",
            attributes: [
              "id",
              "name",
              "price",
              "description",
              "image",
              "category",
              "numberOfOrders",
            ],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "email", "role", "profilePicture"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!bookings) {
        logger.error("Bookings not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Bookings not found",
        };
      }
      logger.info("Bookings fetched successfully");
      const plainBookings = JSON.parse(JSON.stringify(bookings)).map(
        (b: any) => ({
          ...b,
          foods: b.foods?.map((food: any) => {
            let imageUrl = food.image;
            if (typeof food.image === "string") {
              try {
                const parsed = JSON.parse(food.image);
                imageUrl = parsed.url || food.image;
              } catch (error) {
                // keep as is if not a valid JSON string
              }
            } else if (food.image && food.image.url) {
              imageUrl = food.image.url;
            }
            return {
              ...food,
              image: imageUrl,
            };
          }),
          createdAt: new Date(b.createdAt).toISOString(),
          updatedAt: new Date(b.updatedAt).toISOString(),
        }),
      );

      return {
        status: STATUS_CODES.OK,
        message: "success",
        bookings: plainBookings,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async geetBooking({ id }: { id: string }) {
    try {
      const booking = await Booking.findByPk(id, {
        include: [
          {
            model: Table,
            as: "table",
            attributes: ["id", "tableNumber", "capacity", "status"],
          },
          {
            model: Food,
            as: "foods",
            attributes: ["id", "name", "price", "description"],
            through: { attributes: [] }, // Exclude join table columns
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "email", "role", "profilePicture"],
          },
        ],
      });
      if (!booking) {
        logger.error("Bookings not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Bookings not found",
        };
      }

      if (!booking) {
        logger.error("Bookings not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Bookings not found",
        };
      }

      logger.info("Bookings fetched successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
        booking,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async getUserBookings({ userId }: { userId: string }) {
    try {
      const bookings = await Booking.findAll({
        where: { userId: userId },
        attributes: {
          exclude: ["tableId", "userId"],
        },
        include: [
          {
            model: Table,
            as: "table",
            attributes: ["id", "tableNumber", "capacity", "status"],
          },
          {
            model: Food,
            as: "foods",
            attributes: ["id", "name", "price", "description", "image", "category"],
            through: { attributes: [] }, // Exclude join table columns
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "email", "role", "profilePicture"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!bookings) {
        logger.error("Bookings not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Bookings not found",
        };
      }
      logger.info("Bookings fetched successfully");
      const plainBookings = JSON.parse(JSON.stringify(bookings)).map(
        (b: any) => ({
          ...b,
          foods: b.foods?.map((food: any) => {
            let imageUrl = food.image;
            if (typeof food.image === "string") {
              try {
                const parsed = JSON.parse(food.image);
                imageUrl = parsed.url || food.image;
              } catch (error) {
                // keep as is if not a valid JSON string
              }
            } else if (food.image && food.image.url) {
              imageUrl = food.image.url;
            }
            return {
              ...food,
              image: imageUrl,
            };
          }),
          createdAt: new Date(b.createdAt).toISOString(),
          updatedAt: new Date(b.updatedAt).toISOString(),
        }),
      );

      return {
        status: STATUS_CODES.OK,
        message: "success",
        bookings: plainBookings,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async updateBooking({
    id,
    confirmStatus,
  }: {
    id: string;
    confirmStatus: "confirmed" | "not confirmed" | "pending";
  }) {
    try {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        logger.error("Booking not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Booking not found",
        };
      }
      booking.confirmStatus = confirmStatus;
      await booking.save({ validate: false });
      logger.info("Booking updated successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
        booking,
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

export default new BookingController();
