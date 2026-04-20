import { ROLES } from "../../config/userRoles.ts";
import type GraphQLContext from "../../interface/contextType.ts";
import { withRole } from "../../middleware/authUtils.ts";
import cartItemController from "../../web/cartItem/cartItemController.ts";

export const cartItemResolver = {
  Query: {
    getCartItemsByUserId: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (_: any, __: any, context: GraphQLContext) => {
        return await cartItemController.getCartItemsByUserId(
          context.req.user?.id as string,
        );
      },
    ),
  },
  Mutation: {
    createCartItem: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (
        _: any,
        { foodId, quantity }: { foodId: string; quantity: number },
        context: GraphQLContext,
      ) => {
        const userId = context.req.user?.id as string;
        return await cartItemController.createCartItem({
          userId,
          foodId,
          quantity,
        });
      },
    ),
    increaseCartItemQuantity: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (
        _: any,
        { cartItemId, quantity }: { cartItemId: string; quantity: number },
      ) => {
        return await cartItemController.increaseCartItemQuantity({
          cartItemId,
          quantity,
        });
      },
    ),
    decreaseCartItemQuantity: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (
        _: any,
        { cartItemId, quantity }: { cartItemId: string; quantity: number },
      ) => {
        return await cartItemController.decreaseCartItemQuantity({
          cartItemId,
          quantity,
        });
      },
    ),
    deleteCartItem: withRole([ROLES.CUSTOMER, ROLES.ADMIN])(
      async (_: any, { cartItemId }: { cartItemId: string }) => {
        return await cartItemController.deleteCartItem({
          cartItemId,
        });
      },
    ),
  },
};
