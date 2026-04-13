export const bookingSchema = `#graphql

type bookingResponse {
    status: Int!
    message: String!
    booking: Booking!
}

type bookingsResponse {
    status: Int!
    message: String!
    bookings: [Booking!]
}

type Query {
    getBookings: bookingsResponse!
    getBooking(id: String!): bookingResponse!
}
type Mutation {
    createBooking(tableId: String!, foodsId: [String!]!): response!
    
}   
`

export default bookingSchema