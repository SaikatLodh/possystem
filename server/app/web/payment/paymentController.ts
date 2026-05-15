import logger from "../../helpers/logger.ts";
import Payment from "../../models/paymentModel.ts";
import STATUS_CODES from "../../config/httpStatusCode.ts";
import razorpay from "../../helpers/razorpay.ts";
import crypto from "crypto";
import Table from "../../models/tableModel.ts";
import Food from "../../models/foodModel.ts";
import { Op } from "sequelize";
import Booking from "../../models/bookingModel.ts";
import CartItem from "../../models/cartItemsModel.ts";
import BookingFood from "../../models/bookingFoodModel.ts";
import UserFood from "../../models/userFoodModel.ts";
import TableCustomer from "../../models/tableCustomerModel.ts";

class PaymentController {
  async makePayment({
    bookingId,
    tableId,
    foodsId,
    userId,
    amount,
    paymentMethod,
  }: {
    bookingId: string;
    tableId: string;
    userId: string;
    amount: number;
    paymentMethod: "cash" | "online";
    foodsId: string[];
  }) {
    try {
      if (
        !bookingId ||
        !tableId ||
        !userId ||
        !amount ||
        !paymentMethod ||
        !foodsId
      ) {
        logger.error("Please provide all the details");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Please provide all the details",
        };
      }

      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        logger.error("Booking not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Booking not found",
        };
      }

      if (booking.paymentStatus === "paid") {
        logger.error("Payment already done");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Payment already done",
        };
      }

      // ── CASH PAYMENT ──────────────────────────────────────────────
      if (paymentMethod === "cash") {
        booking.paymentStatus = "paid";
        await booking.save({ validate: false });

        const payment = await Payment.create({
          bookingId,
          userId,
          amount,
          paymentMethod,
          paymentStatus: "paid",
        });

        if (!payment) {
          logger.error("Payment not created");
          return {
            status: STATUS_CODES.BAD_REQUEST,
            message: "Payment not created",
          };
        }
        foodsId.forEach(async (foodId) => {
          await BookingFood.create({ bookingId, foodId });
          await UserFood.create({ userId, foodId });
        });
        await TableCustomer.create({ tableId: tableId, userId: userId });
        await Booking.update(
          { paymentStatus: "paid" },
          { where: { id: bookingId } },
        );
        await Table.update({ status: "available" }, { where: { id: tableId } });
        await Food.increment("numberOfOrders", {
          by: 1,
          where: { id: { [Op.in]: foodsId } },
        });
        await CartItem.update(
          { isDeleted: true },
          { where: { userId, foodId: { [Op.in]: foodsId } } },
        );

        logger.info("Cash payment created successfully");
        return {
          status: STATUS_CODES.OK,
          message: "Cash payment created successfully",
        };
      }

      // ── ONLINE PAYMENT — create Razorpay order ────────────────────
      if (!razorpay) {
        logger.error("Razorpay is not initialized");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Razorpay is not initialized",
        };
      }

      const options = {
        amount: Math.round(amount * 100),
        currency: "INR",
      };

      const createRazorpayorder = await razorpay.orders.create(options);

      if (!createRazorpayorder) {
        logger.error("Failed to create Razorpay order");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to create Razorpay order",
        };
      }

      // Create a pending Payment record so verifyPayment can find it
      const payment = await Payment.create({
        bookingId,
        userId,
        amount,
        paymentMethod,
      });

      if (!payment) {
        logger.error("Payment record not created");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Payment record not created",
        };
      }

      logger.info("Razorpay order created successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Razorpay order created successfully",
        data: {
          createRazorpayorder,
          paymentId: payment.id,
        },
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async getKeys() {
    try {
      logger.info("Fetching Razorpay keys");
      logger.info("Razorpay keys fetched successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Keys fetched",
        data: { key: process.env.RAZORPAY_KEY_ID },
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async verifyPayment({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    paymentId,
    userId,
    tableId,
    foodsId,
    bookingId,
  }: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    paymentId: string;
    userId: string;
    tableId: string;
    foodsId: string[];
    bookingId: string;
  }) {
    try {
      logger.info(
        `Verifying subscription: subscriptionId=${paymentId}, userId=${userId}, paymentId=${razorpay_payment_id}`,
      );
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      const payment = await Payment.findByPk(paymentId);

      if (!payment) {
        logger.warn(
          `Payment not found for verification: paymentId=${paymentId}`,
        );
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Payment not found",
        };
      }

      if (razorpay_signature !== expectedSignature) {
        logger.warn(
          `Payment signature verification failed: paymentId=${paymentId}`,
        );
        payment.paymentStatus = "failed";
        await payment.save({ validate: false });
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Payment signature verification failed",
        };
      }

      payment.paymentStatus = "paid";
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpayOrderId = razorpay_order_id;
      payment.razorpaySignature = razorpay_signature;
      await payment.save({ validate: false });

      logger.info(`Payment verified successfully: paymentId=${paymentId}`);
      foodsId.forEach(async (foodId) => {
        await BookingFood.create({ bookingId, foodId });
        await UserFood.create({ userId, foodId });
      });
      await TableCustomer.create({ tableId: tableId, userId: userId });
      await Booking.update(
        { paymentStatus: "paid" },
        { where: { id: bookingId } },
      );
      await Table.update({ status: "available" }, { where: { id: tableId } });
      await Food.increment("numberOfOrders", {
        by: 1,
        where: { id: { [Op.in]: foodsId } },
      });
      await CartItem.update(
        { isDeleted: true },
        { where: { userId, foodId: { [Op.in]: foodsId } } },
      );

      return {
        status: STATUS_CODES.OK,
        message: "Payment verified successfully",
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

export default new PaymentController();
