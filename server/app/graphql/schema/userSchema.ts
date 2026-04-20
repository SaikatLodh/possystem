export const userSchema = `#graphql

type userResponse {
status: Int!
message: String!
user: User
}

type Query {
getUser: userResponse!
}

type Mutation {
updateUser(fullname:String, file: FileUploadInput):response!
changePassword(oldPassword: String!, confirmPassword: String!, newPassword: String!): response!
deleteUser: response!
}
    
`;
