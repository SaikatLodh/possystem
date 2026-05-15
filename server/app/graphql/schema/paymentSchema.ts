export const paymentSchema = `#graphql

type responsekeys{
    status:Int!
    message:String!
    data:responsekeysData!
}
type responsekeysData{
    key:String!
}

type RazorpayOrder {
    id: String!
    amount: Int!
    currency: String!
}

type makePaymentData {
    createRazorpayorder: RazorpayOrder
    paymentId: String
}

type makePaymentResponse {
    status: Int!
    message: String!
    data: makePaymentData
}

type Query{
    getKeys:responsekeys!
}
type Mutation {
    makePayment(bookingId: ID!, amount: Float!, paymentMethod: String!,foodsId:[ID!]! , tableId: ID!): makePaymentResponse!
    verifyPayment(paymentId: ID!, tableId: ID!, foodsId: [ID!]!, bookingId: ID!, razorpay_payment_id: String!, razorpay_order_id: String!, razorpay_signature: String!): response!
}

`