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
changePassword(oldPassword: String!, confirmPassword: String!, password: String!): response!
}
    
`;
//# sourceMappingURL=userSchema.js.map