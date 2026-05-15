export const adminSchema = `#graphql

type WaiterResponse {
    status: Int!
    message: String!
    waiters: [User]
}

type DashboardData {
  recentOrder: [Payment]
  popularDishes: [Food]
}

type DashboardDataResponse {
    status: Int!
    message: String!
    data: DashboardData
}

type Query {
    dashboardData: DashboardDataResponse!
    waiters: WaiterResponse!
}

type Mutation {
    createWaiter(
        fullname: String!
        email: String!
        password: String!
        number: String!
    ): response!
    
    deleteWaiter(id: ID!): response!
}

`;
