import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import CartItem from "../../models/cartItemsModel.ts";
import Food from "../../models/foodModel.ts";

class CartItemController {
  async createCartItem({
    userId,
    foodId,
    quantity,
  }: {
    userId: string;
    foodId: string;
    quantity: number;
  }) {
    try {
      if (!userId || !foodId || !quantity) {
        logger.warn("Missing required fields: userId, foodId, or quantity");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "User ID and Food ID are required",
        };
      }

      if (quantity <= 0) {
        logger.warn("Quantity must be greater than zero");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Quantity must be greater than zero",
        };
      }

      const existingCartItem = await CartItem.findOne({
        where: { userId, foodId, isDeleted: false },
      });

      if (existingCartItem) {
        logger.warn("Cart item already exists for this user and food");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message:
            "Cart item already exists for this user and food. Consider updating the quantity instead.",
        };
      }

      const existingCartItemChangeValue = await CartItem.findOne({
        where: { userId, foodId, isDeleted: true },
      });

      if (existingCartItemChangeValue) {
        existingCartItemChangeValue.isDeleted = false;
        await existingCartItemChangeValue.save({ validate: false });
        logger.info(
          `Cart item restored successfully for user: ${userId} and food: ${foodId}`,
        );
        return {
          status: STATUS_CODES.OK,
          message: "Cart item added",
        };
      }

      const newCartItem = await CartItem.create({ quantity, foodId, userId });

      if (!newCartItem) {
        logger.error("Failed to create cart item");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to create cart item",
        };
      }
      logger.info(`Cart item created successfully with ID: ${newCartItem.id}`);
      return {
        status: STATUS_CODES.CREATED,
        message: "Cart item added",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async getCartItemsByUserId(userId: string) {
    try {
      if (!userId) {
        logger.warn("User ID is required");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "User ID is required",
          cartItems: [],
        };
      }

      const cartItems = await CartItem.findAll({
        where: { userId, isDeleted: false },
        attributes: ["id", "quantity", "isDeleted", "createdAt", "updatedAt"],
        include: [
          {
            model: Food,
            as: "food",
            attributes: ["id", "name", "description", "price", "image"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!cartItems || cartItems.length === 0) {
        logger.warn("Cart items not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart items not found",
          cartItems: [],
        };
      }

      const formattedCartItems = cartItems.map((item: any) => {
        const plainItem = item.get({ plain: true });
        if (plainItem.food && plainItem.food.image) {
          try {
            const imageData =
              typeof plainItem.food.image === "string"
                ? JSON.parse(plainItem.food.image)
                : plainItem.food.image;
            plainItem.food.image = imageData.url || plainItem.food.image;
          } catch (error) {
            logger.error("Error parsing food image JSON:", error);
          }
        }
        return plainItem;
      });

      logger.info(`Cart items retrieved successfully for user: ${userId}`);

      return {
        status: STATUS_CODES.OK,
        message: "Cart items retrieved successfully",
        cartItems: formattedCartItems,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
        cartItems: [],
      };
    }
  }

  async increaseCartItemQuantity({
    cartItemId,
    quantity,
  }: {
    cartItemId: string;
    quantity: number;
  }) {
    try {
      if (!cartItemId) {
        logger.warn("Cart item ID is required");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cart item ID is required",
        };
      }

      if (quantity <= 0) {
        logger.warn("Quantity must be greater than zero");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Quantity must be greater than zero",
        };
      }
      const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

      if (!cartItem) {
        logger.warn("Cart item not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart item not found",
        };
      }

      if (cartItem.isDeleted) {
        logger.warn("Cannot update quantity of a deleted cart item");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cannot update quantity of a deleted cart item",
        };
      }

      cartItem.quantity += quantity;
      await cartItem.save({ validate: false });

      logger.info(
        `Cart item quantity updated successfully for item: ${cartItemId}`,
      );

      return {
        status: STATUS_CODES.OK,
        message: "Cart item quantity updated successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async decreaseCartItemQuantity({
    cartItemId,
    quantity,
  }: {
    cartItemId: string;
    quantity: number;
  }) {
    try {
      if (!cartItemId) {
        logger.warn("Cart item ID is required");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cart item ID is required",
        };
      }

      if (quantity <= 0) {
        logger.warn("Quantity must be greater than zero");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Quantity must be greater than zero",
        };
      }

      const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

      if (!cartItem) {
        logger.warn("Cart item not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart item not found",
        };
      }

      if (cartItem.isDeleted) {
        logger.warn("Cannot update quantity of a deleted cart item");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cannot update quantity of a deleted cart item",
        };
      }

      cartItem.quantity -= quantity;
      await cartItem.save({ validate: false });

      logger.info(
        `Cart item quantity updated successfully for item: ${cartItemId}`,
      );

      return {
        status: STATUS_CODES.OK,
        message: "Cart item quantity updated successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async deleteCartItem({ cartItemId }: { cartItemId: string }) {
    try {
      if (!cartItemId) {
        logger.warn("Cart item ID is required");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cart item ID is required",
        };
      }

      const cartItem = await CartItem.findOne({ where: { id: cartItemId } });

      if (!cartItem) {
        logger.warn("Cart item not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart item not found",
        };
      }

      if (cartItem.isDeleted) {
        logger.warn("Cart item is already marked as deleted");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Cart item is already marked as deleted",
        };
      }

      cartItem.isDeleted = true;
      cartItem.quantity = 1;
      await cartItem.save({ validate: false });

      logger.info(`Cart item deleted successfully for item: ${cartItemId}`);

      return {
        status: STATUS_CODES.OK,
        message: "Remove from the cart",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }
}

export default new CartItemController();
