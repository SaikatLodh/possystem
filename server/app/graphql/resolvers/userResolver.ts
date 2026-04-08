import type GraphQLContext from "../../interface/contextType.ts";
import { withAuth } from "../../middleware/authUtils.ts";
import userController from "../../web/user/userController.ts";

export const userResolver = {
  Query: {
    getUser: withAuth((_: any, args: any, context: GraphQLContext) => {
      return userController.getUsers(context?.req?.user?.id as string);
    }),
  },
  Mutation: {
    updateUser: withAuth(
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
    changePassword: withAuth(
      (
        _: any,
        args: {
          oldPassword: string;
          confirmPassword: string;
          password: string;
        },
        context: GraphQLContext,
      ) => {
        return userController.changePassword(
          context?.req?.user?.id as string,
          args.oldPassword,
          args.confirmPassword,
          args.password,
        );
      },
    ),
  },
};
