export const authSchema = `#graphql

type loginResponse {
status: Int!
accessToken: String
refreshToken: String
message: String!
}


type refreshTokenResponse {
status: Int!
accessToken: String
message: String!
}

type Mutation {
sendOtp(email: String!): response!
verifyOtp(email: String!, otp: Int!): response!
register(fullname: String!, email: String!, password: String!, number: String!): response!
logIn(email: String!, password: String!,remember: Boolean!): loginResponse!
forgotSendMail(email: String!): response!
forgotPassword(newPassword: String!, confirmPassword: String!, token: String!): response!
refreshToken(token: String!): refreshTokenResponse!
}
`;
//# sourceMappingURL=authSchema.js.map