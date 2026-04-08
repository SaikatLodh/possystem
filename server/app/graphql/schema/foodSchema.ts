export const foodSchema = `#graphql

type foodsResponse {
status: Int!
message: String!
food: [Food!]!
}

type foodResponse {
status: Int!
message: String!
food: Food!
}

type Query {
getFoods(page: Int!, limit: Int!): foodsResponse!
getFood(id: ID!): foodResponse!
}

type Mutation {
createFood(name: String!, description: String!, price: Float!, category: String!, file: FileUploadInput): response!
updateFood(name: String, description: String, price: Float, category: String, file: FileUploadInput): response!
deleteFood(id: ID!): response!
}


`;
