import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withRole } from "../../middleware/authUtils.ts";
import bookingController from "../../web/booking/bookingController.ts";

export const bookResolvers = {
  Query: {
    getBookings: withRole([ROLES.WAITER, ROLES.ADMIN])(
      async (_: any, __: any) => {
        return await bookingController.geetBookings();
      },
    ),
    getBooking: withRole([ROLES.WAITER, ROLES.ADMIN])(
      async (_: any, { id }: { id: string }) => {
        return await bookingController.geetBooking({ id });
      },
    ),
    getUserBookings: withRole([ROLES.CUSTOMER])(
      async (_: any, __: any, context: GraphQLContext) => {
        return await bookingController.getUserBookings({ userId: context?.req?.user?.id as string });
      },
    ),
  },
  Mutation: {
    createBooking: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      (
        _: any,
        args: { tableId: string; foodsId: string[] },
        context: GraphQLContext,
      ) => {
        const convertedArgs = {
          ...args,
          userId: context?.req?.user?.id as string,
        };
        return bookingController.createBooking(convertedArgs);
      },
    ),
    updateBooking: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      (
        _: any,
        { id, confirmStatus }: { id: string; confirmStatus: "pending" | "confirmed" | "not confirmed" },
      ) => {
        return bookingController.updateBooking({ id, confirmStatus });
      },
    ),
  },
};
