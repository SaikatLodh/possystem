
import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withAuth, withRole } from "../../middleware/authUtils.ts";
import foodController from "../../web/food/foodController.ts";

export const foodResolver = {
  Query: {
    getFoods: withAuth((_: any, args: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      return foodController.getFoods(args);
    }),
    getFood: withAuth(
      (_: any, args: { id: string }) => {
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
      ) => {
        return foodController.updateFood(args);
      },
    ),
    deleteFood: withRole([ROLES.ADMIN])(
      (_: any, args: { id: string }) => {
        return foodController.deleteFood(args.id);
      },
    ),
  },
};
