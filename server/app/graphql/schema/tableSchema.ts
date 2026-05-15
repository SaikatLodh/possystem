export const tableSchema = `#graphql

type tablesResponse {
status: Int!
message: String!
tables: [Table!]!
}


type Query {
getTables: tablesResponse!
}

type Mutation {
createTable(tableNumber: Int!, capacity: Int! ): response!
updateTable(tableNumber: Int!, capacity: Int! , id: ID!): response!
deleteTable(id: ID!): response!
toggleTableStatus(id: ID!, waiterId: String, bookingId: String): response!
}

`;
