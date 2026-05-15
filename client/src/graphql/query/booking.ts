export const CREATE_BOOKING = `#graphql
  mutation CreateBooking($tableId: String!, $foodsId: [String!]!) {
    createBooking(tableId: $tableId, foodsId: $foodsId) {
      status
      message
    }
  }
`;

export const getBookings = `#graphql
query GetBookings {
  getBookings {
    status
    message
    bookings {
      id
      updatedAt
      createdAt
      isDeleted
      table {
        id
        tableNumber
        status
        capacity
      }
      paymentStatus
      confirmStatus
       foods {
        id
        name
        description
        price
        image
        category

      }
      user {
        id
        fullname
        email
        profilePicture
        role
      }
    }
  }
}
`

export const getUserBookings = `#graphql
query Query {
  getUserBookings {
    status
    message
    bookings {
      id
      updatedAt
      createdAt
      isDeleted
      table {
        id
        tableNumber
        status
        capacity
      }
      paymentStatus
      confirmStatus
      foods {
        id
        name
        description
        price
        image
        category

      }
      user {
        id
        fullname
        email
        profilePicture
        role
      }
    }
  }
}
`;
