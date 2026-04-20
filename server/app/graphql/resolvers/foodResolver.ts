import { ROLES } from "../../config/userRoles.ts";
import { withAuth, withRole } from "../../middleware/authUtils.ts";
import foodController from "../../web/food/foodController.ts";

export const foodResolver = {
  Query: {
    getFoods: withRole([ROLES.ADMIN, ROLES.CUSTOMER])(
      (
        _: any,
        {
          page,
          limit,
          search,
          category,
          sortBy,
          sortOrder,
        }: {
          page?: number;
          limit?: number;
          search?: string;
          category?: string;
          sortBy?: string;
          sortOrder?: string;
        },
      ) => {
        return foodController.getFoods({
          page,
          limit,
          search,
          category,
          sortBy,
          sortOrder,
        });
      },
    ),
    getFood: withRole([ROLES.ADMIN, ROLES.CUSTOMER])((_: any, args: { id: string }) => {
      return foodController.getFood(args.id);
    }),
    getCategoriesCount: withRole([ROLES.ADMIN, ROLES.CUSTOMER])(() => {
      return foodController.getCategoriesCount();
    }),
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
    deleteFood: withRole([ROLES.ADMIN])((_: any, args: { id: string }) => {
      return foodController.deleteFood(args.id);
    }),
  },
};
