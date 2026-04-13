export const baseSchema = `#graphql
  scalar DateTime
  scalar Upload

input FileUploadInput {
  filename: String!
  mimetype: String!
  encoding: String!
  data: String!
}

  type response {
    status: Int!
    message: String!
  }

  type ProfilePicture {
    public_id: String
    url: String
  }

  type User {
    id: ID!
    fullname: String!
    email: String!
    profilePicture: ProfilePicture
    role: String!
    isDeleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Food {
    id: ID!
    name: String!
    description: String!
    price: Int!
    image: ProfilePicture
    slug: String!
    category: String!
    numberOfOrders: Int!
    isDeleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Table {
    id: ID!
    tableNumber: Int!
    status: String!
    capacity: Int!
    confirmedByWaiters: [User!]!
    isDeleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Booking {
    id: String!
    table: Table!
    foods: [Food!]!
    user: User!
    isDeleted: Boolean!
    createdAt: String!
    updatedAt: String!
}

`;
