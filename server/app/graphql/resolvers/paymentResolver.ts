import { ROLES } from "../../config/userRoles.ts"
import type GraphQLContext from "../../interface/contextType.ts"
import { withRole } from "../../middleware/authUtils.ts"
import paymentController from "../../web/payment/paymentController.ts"



export const paymentResolvers = {
    Mutation: {
        makePayment: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(async (_: any, { bookingId, amount }: {

            bookingId: string,
            amount: number,
        }, context: GraphQLContext) => {
            const transformData = {
                bookingId: bookingId,
                userId: context.req.user?.id as string,
                amount: amount,
            }
            return paymentController.makePayment(transformData)
        })
    }
}