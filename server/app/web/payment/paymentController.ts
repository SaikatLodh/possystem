import logger from "../../helpers/logger.ts";
import Payment from "../../models/paymentModel.ts"
import STATUS_CODES from "../../config/httpStatusCode.ts";

class PaymentController {
    async makePayment({ bookingId, userId, amount }: {
        bookingId: string,
        userId: string,
        amount: number,
    }) {
        try {
            console.log(bookingId, userId, amount);
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