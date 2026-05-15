import { ROLES } from "../../config/userRoles.ts"
import type GraphQLContext from "../../interface/contextType.ts"
import { withRole } from "../../middleware/authUtils.ts"
import paymentController from "../../web/payment/paymentController.ts"


export const paymentResolvers = {
    Query: {
        getKeys: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async () => {
            return paymentController.getKeys()
        })
    },
    Mutation: {
        makePayment: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async (_: any, { bookingId, amount, paymentMethod, foodsId, tableId }: {

            bookingId: string,
            amount: number,
            paymentMethod: "cash" | "online",
            foodsId: string[],
            tableId: string
        }, context: GraphQLContext) => {
            const transformData = {
                bookingId: bookingId,
                userId: context.req.user?.id as string,
                amount: amount,
                paymentMethod: paymentMethod,
                tableId: tableId,
                foodsId: foodsId,
            }
            return paymentController.makePayment(transformData)
        }),
        verifyPayment: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async (_: any, { paymentId, tableId, foodsId, bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature }: {
            paymentId: string,
            tableId: string,
            foodsId: string[],
            bookingId: string,
            razorpay_payment_id: string,
            razorpay_order_id: string,
            razorpay_signature: string,
        }, context: GraphQLContext) => {
            const transformData = {
                paymentId,
                userId: context.req.user?.id as string,
                tableId,
                foodsId,
                bookingId,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
            }
            return paymentController.verifyPayment(transformData)
        })
    }
}