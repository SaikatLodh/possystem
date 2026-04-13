import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withRole } from "../../middleware/authUtils.ts";
import bookingController from "../../web/booking/bookingController.ts";

export const bookResolvers = {
  Query: {
    getBookings: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (_: any, __: any) => {
        return await bookingController.geetBookings();
      },
    ),
    getBooking: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (_: any, { id }: { id: string }) => {
        return await bookingController.geetBooking({ id });
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
  },
};
