import { ROLES } from "../../config/userRoles.ts";
import { withRole } from "../../middleware/authUtils.ts";
import adminController from "../../web/admin/adminController.ts";

export const adminResolvers = {
  Query: {
    dashboardData: withRole([ROLES.ADMIN])(async (_: any, __: any) => {
      return await adminController.dashboardData();
    }),
    waiters: withRole([ROLES.ADMIN])(async (_: any, __: any) => {
      return await adminController.getAllWaiters();
    }),
  },

  Mutation: {
    createWaiter: withRole([ROLES.ADMIN])(
      async (
        _: any,
        {
          fullname,
          email,
          password,
          number,
        }: {
          fullname: string;
          email: string;
          password: string;
          number: string;
        },
      ) => {
        return await adminController.createWaiter({
          fullname,
          email,
          password,
          number,
        });
      },
    ),

    deleteWaiter: withRole([ROLES.ADMIN])(
      async (_: any, { id }: { id: string }) => {
        return await adminController.deleteWaiter({ id });
      },
    ),
  },
};
