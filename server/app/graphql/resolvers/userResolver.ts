import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withRole } from "../../middleware/authUtils.ts";
import userController from "../../web/user/userController.ts";

export const userResolver = {
  Query: {
    getUser: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(
      (_: any, args: any, context: GraphQLContext) => {
        return userController.getUsers(context?.req?.user?.id as string);
      },
    ),
  },
  Mutation: {
    updateUser: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(
      (
        _: any,
        args: {
          fullname: string;
          file: {
            filename: string;
            mimetype: string;
            encoding: string;
            data: string;
          } | null;
        },
        context: GraphQLContext,
      ) => {
        return userController.updateUser(
          context?.req?.user?.id as string,
          args.fullname,
          args.file,
        );
      },
    ),
    changePassword: withRole([ROLES.ADMIN, ROLES.WAITER, ROLES.CUSTOMER])(
      (
        _: any,
        args: {
          oldPassword: string;
          confirmPassword: string;
          newPassword: string;
        },
        context: GraphQLContext,
      ) => {
        return userController.changePassword(
          context?.req?.user?.id as string,
          args.oldPassword,
          args.confirmPassword,
          args.newPassword,
        );
      },
    ),
    deleteUser: withRole([ROLES.ADMIN, ROLES.CUSTOMER, ROLES.WAITER])(
      (_: any, args: any, context: GraphQLContext) => {
        return userController.deleteUser(context?.req?.user?.id as string);
      },
    ),
  },
};
