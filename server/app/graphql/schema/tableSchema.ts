export const tableSchema = `#graphql

type tablesResponse {
status: Int!
message: String!
table: [Table!]!
}


type Query {
getTables: tablesResponse!
}

type Mutation {
createTable(tableNumber: Int!, capacity: Int! ): response!
updateTable(tableNumber: Int, capacity: Int): response!
deleteTable(id: ID!): response!
toggleTableStatus(id: ID!): response!
}

`;
