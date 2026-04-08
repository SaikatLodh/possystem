export interface ICourseImage {
  publicid: string;
  url: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  number: number;
  role: "customer" | "admin" | "waiter";
  profilePicture?: ICourseImage;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthFormValues extends User {
  password: string;
  confirmPassword: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
}

export interface GraphqlMutation {
  sendOtp: {
    status: number;
    message: string;
  };
  verifyOtp: {
    status: number;
    message: string;
  };
  register: {
    status: number;
    message: string;
  };
  logIn: {
    status: number;
    message: string;
    accessToken: string;
    refreshToken: string;
  };
  forgotSendMail: {
    status: number;
    message: string;
  };
  forgotPassword: {
    status: number;
    message: string;
  };
  refreshToken: {
    status: number;
    message: string;
    accessToken: string;
  };
}

export interface GraphqlQuery {
  getUser: {
    user: User;
  };
}
