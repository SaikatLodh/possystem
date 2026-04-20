export const paymentSchema = `#graphql

type responsekeys{
    status:Int!
    message:String!
    data:responsekeysData!
}
type responsekeysData{
    key:String!
}
type Query{
    getKeys:responsekeys!
}
type Mutation {
    makePayment(bookingId: ID!, amount: Float!, paymentMethod: String!): response!
    verifyPayment(paymentId: ID!,  tableId: ID!, foodsId: [ID!]!): response!
}

`