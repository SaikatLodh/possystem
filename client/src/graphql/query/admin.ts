export const dashboardData = `#graphql
query DashboardData {
  dashboardData {
    status
    message
    data {
      recentOrder {
        amount
        paymentMethod
        id
        paymentStatus
        createdAt
        updatedAt
        user {
          id
          fullname
          email
          number
          profilePicture
          role
          isDeleted
          createdAt
          updatedAt
        }
        booking {
          id
          table {
            id
            tableNumber
            status
            capacity
          }
        }
      }
      popularDishes {
        id
        name
        description
        price
        image
        category
        numberOfOrders
        createdAt
        updatedAt
      }
    }
  }
}
`;

export const createWaiter = `#graphql
mutation Mutation($fullname: String!, $email: String!, $password: String!, $number: String!) {
  createWaiter(fullname: $fullname, email: $email, password: $password, number: $number) {
    status
    message
  }
}
`;

export const getWaiters = `#graphql
query Waiters {
  waiters {
    status
    message
    waiters {
      id
      fullname
      email
      number
      role
      createdAt
    }
  }
}
`;

export const deleteWaiter = `#graphql
mutation DeleteWaiter($id: ID!) {
  deleteWaiter(id: $id) {
    status
    message
  }
}
`;
