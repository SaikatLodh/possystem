export const getUser = `#graphql
query Query {
  getUser {
    user {
      fullname
      id
      email
      role
      isDeleted
      createdAt
      updatedAt
      profilePicture {
        url
        public_id
      }
    }
  }
}
`