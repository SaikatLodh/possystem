export const paymentSchema = `#graphql

type Mutation {
    makePayment(bookingId: ID!, amount: Float!): response!
}

`