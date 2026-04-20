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
        makePayment: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async (_: any, { bookingId, amount, paymentMethod }: {

            bookingId: string,
            amount: number,
            paymentMethod: "cash" | "card" | "upi",
        }, context: GraphQLContext) => {
            const transformData = {
                bookingId: bookingId,
                userId: context.req.user?.id as string,
                amount: amount,
                paymentMethod: paymentMethod,
            }
            return paymentController.makePayment(transformData)
        }),
        verifyPayment: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async (_: any, { paymentId, tableId, foodsId }: {
            paymentId: string,
            tableId: string,
            foodsId: string[],
        }, context: GraphQLContext) => {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = context.req.body
            const transformData = {
                paymentId: paymentId,
                userId: context.req.user?.id as string,
                tableId: tableId,
                foodsId: foodsId,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_order_id: razorpay_order_id,
                razorpay_signature: razorpay_signature,
            }
            return paymentController.verifyPayment(transformData)
        })
    }
}