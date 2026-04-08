export const sendOtp = `#graphql
mutation Mutation($email: String!) {
  sendOtp(email: $email) {
    message
    status
  }
}
`;

export const verifyOtp = `#graphql
mutation Mutation($email: String!, $otp: Int!) {
  verifyOtp(email: $email, otp: $otp) {
    message
    status
  }
}
`;

export const register = `#graphql
mutation Mutation($fullname: String!, $email: String!, $password: String!, $number: String!) {
  register(fullname: $fullname, email: $email, password: $password, number: $number) {
    message
    status
  }
}
`;

export const login = `#graphql
mutation Mutation($email: String!, $password: String!, $remember: Boolean!) {
  logIn(email: $email, password: $password, remember: $remember) {
    message
    refreshToken
    accessToken
    status
  }
}
`;

export const forgotSendMail = `#graphql
mutation Mutation($email: String!) {
  forgotSendMail(email: $email) {
    message
    status
  }
}
`;

export const forgotPassword = `#graphql
mutation Mutation($newPassword: String!, $confirmPassword: String!, $token: String!) {
  forgotPassword(newPassword: $newPassword, confirmPassword: $confirmPassword, token: $token) {
    message
    status
  }
}
`;

export const refreshToken = `#graphql
mutation Mutation($token: String!) {
  refreshToken(token: $token) {
    message
    accessToken
    status
  }
}
`;
