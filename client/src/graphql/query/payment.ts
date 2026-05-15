export const makePayment = `#graphql
mutation MakePayment($bookingId: ID!, $amount: Float!, $paymentMethod: String!, $foodsId: [ID!]!, $tableId: ID!) {
  makePayment(bookingId: $bookingId, amount: $amount, paymentMethod: $paymentMethod, foodsId: $foodsId, tableId: $tableId) {
    status
    message
    data {
      paymentId
      createRazorpayorder {
        id
        amount
        currency
      }
    }
  }
}
`;

export const getRazorpayKeys = `#graphql
query Query {
  getKeys {
    status
    message
    data {
      key
    }
  }
}
`;

export const verifyPayment = `#graphql
mutation VerifyPayment(
  $paymentId: ID!
  $tableId: ID!
  $foodsId: [ID!]!
  $bookingId: ID!
  $razorpay_payment_id: String!
  $razorpay_order_id: String!
  $razorpay_signature: String!
) {
  verifyPayment(
    paymentId: $paymentId
    tableId: $tableId
    foodsId: $foodsId
    bookingId: $bookingId
    razorpay_payment_id: $razorpay_payment_id
    razorpay_order_id: $razorpay_order_id
    razorpay_signature: $razorpay_signature
  ) {
    status
    message
  }
}
`;
