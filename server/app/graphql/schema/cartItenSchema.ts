export const cartItemSchema = `#graphql
type cartItemsResponse {
    status: Int!
    message: String!
    cartItems: [CartItem!]!
}
type Query {
  getCartItemsByUserId: cartItemsResponse!
}

type Mutation {
  createCartItem( foodId: String!, quantity: Int!): response!
  increaseCartItemQuantity(cartItemId: String!, quantity: Int!): response!
  decreaseCartItemQuantity(cartItemId: String!, quantity: Int!): response!
  deleteCartItem(cartItemId: String!): response!
  
}

`;
