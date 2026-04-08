import tableController from "../../web/table/tableController.ts";
import { withRole } from "../../middleware/authUtils.ts";
import { ROLES } from "../../config/userRoles.ts";

export const tableResolvers = {
  Query: {
    getTables: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(() => {
      return tableController.getTables();
    }),
  },
  Mutation: {
    createTable: withRole([ROLES.ADMIN])(
      (_: any, args: { tableNumber: number; capacity: number }) => {
        return tableController.createTable(args);
      },
    ),
    updateTable: withRole([ROLES.ADMIN])(
      (_: any, args: { tableNumber: number; capacity: number; id: string }) => {
        return tableController.updateTable(args);
      },
    ),
    deleteTable: withRole([ROLES.ADMIN])((_: any, args: { id: string }) => {
      return tableController.deleteTable(args);
    }),
    toggleTableStatus: withRole([ROLES.ADMIN, ROLES.WAITER])(
      (_: any, args: { id: string }) => {
        return tableController.toggleTableStatus(args);
      },
    ),
  },
};
