import logger from "../../helpers/logger.ts";
import Payment from "../../models/paymentModel.ts"
import STATUS_CODES from "../../config/httpStatusCode.ts";
import razorpay from "../../helpers/razorpay.ts";
import crypto from "crypto";
import Table from "../../models/tableModel.ts";
import Food from "../../models/foodModel.ts";
import { Op } from "sequelize";

class PaymentController {
    async makePayment({ bookingId, userId, amount, paymentMethod }: {
        bookingId: string,
        userId: string,
        amount: number,
        paymentMethod: "cash" | "card" | "upi",
    }) {
        try {


            const options = {
                amount: amount * 100,
                currency: "INR",
            };

            if (!razorpay) {
                logger.error("Razorpay is not initialized");
                return {
                    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: "Razorpay is not initialized",
                };
            }

            const createRazorpayorder = await razorpay.orders.create(options);

            if (!createRazorpayorder) {
                logger.error("Failed to create Razorpay order");
                return {
                    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: "Failed to create Razorpay order",
                };
            }
            // console.log(bookingId, userId, amount);
            if (!bookingId || !userId || !amount) {
                logger.error("Please provide bookingId, userId and amount");
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: "Please provide bookingId, userId and amount",
                };
            }

            const payment = await Payment.create({
                bookingId,
                userId,
                amount,
                paymentMethod

            });

            if (!payment) {
                logger.error("Payment not created");
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    message: "Payment not created",
                };
            }

            logger.info("Payment created successfully");
            return {
                status: STATUS_CODES.OK,
                message: "Payment created successfully",
                data: {
                    payment: { id: payment.id },
                    createRazorpayorder
                }
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

    async verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId, userId, tableId, foodsId }: {
        razorpay_payment_id: string,
        razorpay_order_id: string,
        razorpay_signature: string
        paymentId: string
        userId: string
        tableId: string
        foodsId: string[]
    }) {
        try {
            logger.info(`Verifying subscription: subscriptionId=${paymentId}, userId=${userId}, paymentId=${razorpay_payment_id}`);
            const body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
                .update(body.toString())
                .digest("hex");

            const payment = await Payment.findByPk(paymentId);

            if (!payment) {
                logger.warn(`Payment not found for verification: paymentId=${paymentId}`);
                return {
                    status: STATUS_CODES.NOT_FOUND,
                    message: "Payment not found",
                };
            }

            if (razorpay_signature !== expectedSignature) {
                logger.warn(`Payment signature verification failed: paymentId=${paymentId}`);
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

            await Table.update({ status: "available" }, { where: { id: tableId } });
            await Food.increment("numberOfOrders", {
                by: 1,
                where: { id: { [Op.in]: foodsId } }
            })

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

export default new PaymentController()