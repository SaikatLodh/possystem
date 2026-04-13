export const foodSchema = `#graphql

type Pagination {
  totalItems: Int!
  totalPages: Int!
  currentPage: Int!
  limit: Int!
}

type foodsResponse {
  status: Int!
  message: String!
  foods: [Food!]!
  pagination: Pagination
}

type foodResponse {
  status: Int!
  message: String!
  food: Food!
}

type Query {
  getFoods(page: Int, limit: Int, search: String, category: String, sortBy: String, sortOrder: String): foodsResponse!
  getFood(id: ID!): foodResponse!
}

type Mutation {
createFood(name: String!, description: String!, price: Float!, category: String!, file: FileUploadInput): response!
updateFood(name: String, description: String, price: Float, category: String, file: FileUploadInput): response!
deleteFood(id: ID!): response!
}


`;
