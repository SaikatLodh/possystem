export const createCartItem = `#graphql
mutation Mutation($foodId: String!, $quantity: Int!) {
  createCartItem(foodId: $foodId, quantity: $quantity) {
    status
    message
  }
}
`
export const getCartItems = `#graphql
query Query {
  getCartItemsByUserId {
    status
    message
    cartItems {
      id
      food {
        id
        name
        description
        price
        image
  }
      quantity
      isDeleted
      createdAt
      updatedAt
    }
  }
}
`

export const increaseCartItemQuantity = `#graphql
mutation Mutation($cartItemId: String!, $quantity: Int!) {
  increaseCartItemQuantity(cartItemId: $cartItemId, quantity: $quantity) {
    status
    message
  }
}
`

export const decreaseCartItemQuantity = `#graphql
mutation Mutation($cartItemId: String!, $quantity: Int!) {
  decreaseCartItemQuantity(cartItemId: $cartItemId, quantity: $quantity) {
    status
    message
  }
}
`

export const deleteCartItem = `#graphql
mutation Mutation($cartItemId: String!) {
  deleteCartItem(cartItemId: $cartItemId) {
    status
    message
  }
}
`