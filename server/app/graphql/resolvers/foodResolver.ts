
import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withAuth, withRole } from "../../middleware/authUtils.ts";
import foodController from "../../web/food/foodController.ts";

export const foodResolver = {
  Query: {
    getFoods: withAuth((_: any, args: any, context: GraphQLContext) => {
      return foodController.getFoods();
    }),
    getFood: withAuth(
      (_: any, args: { id: string }, context: GraphQLContext) => {
        return foodController.getFood(args.id);
      },
    ),
  },
  Mutation: {
    createFood: withRole([ROLES.ADMIN])(
      (
        _: any,
        args: {
          name: string;
          description: string;
          price: number;
          category: string;
          file?: {
            filename: string;
            mimetype: string;
            encoding: string;
            data: string;
          };
        },
        context: GraphQLContext,
      ) => {
        return foodController.createFood(args);
      },
    ),
    updateFood: withRole([ROLES.ADMIN])(
      (
        _: any,
        args: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          file?: {
            filename: string;
            mimetype: string;
            encoding: string;
            data: string;
          };
        },
        context: GraphQLContext,
      ) => {
        return foodController.updateFood(args);
      },
    ),
    deleteFood: withRole([ROLES.ADMIN])(
      (_: any, args: { id: string }, context: GraphQLContext) => {
        return foodController.deleteFood(args.id);
      },
    ),
  },
};
