export const getUser = `#graphql
query Foods {
  getUser {
    status
    message
    user {
      id
      fullname
      email
      profilePicture
      role
      isDeleted
      createdAt
      updatedAt
    }
  }
}
`

export const updateUser = `#graphql
mutation Mutation($fullname: String, $file: FileUploadInput) {
  updateUser(fullname: $fullname, file: $file) {
    message
    status
  }
}
`

export const changePassword = `#graphql
mutation Mutation($oldPassword: String!, $confirmPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, confirmPassword: $confirmPassword, newPassword: $newPassword) {
    message
    status
  }
}
`

export const deleteUser = `#graphql
mutation Mutation {
  deleteUser {
    status
    message
  }
}
`