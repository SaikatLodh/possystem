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

type categoryCountResponse {
  status: Int!
  message: String!
  categories: [CategoryCount!]!
}

type CategoryCount {
  category: String!
  count: Int!
}

type Query {
  getFoods(page: Int, limit: Int, search: String, category: String, sortBy: String, sortOrder: String): foodsResponse!
  getFood(id: ID!): foodResponse!
  getCategoriesCount: categoryCountResponse!
}

type Mutation {
createFood(name: String!, description: String!, price: Float!, category: String!, file: FileUploadInput): response!
updateFood(id: ID!, name: String, description: String, price: Float, category: String, file: FileUploadInput): response!
deleteFood(id: ID!): response!
}

`;
