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

`;
//# sourceMappingURL=baseSchema.js.map