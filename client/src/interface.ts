

export interface User {
  id: string;
  fullname: string;
  email: string;
  number: number;
  role: "customer" | "admin" | "waiter";
  profilePicture?: string;
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

export interface Table {
  id: string;
  tableNumber: number;
  status: string;
  capacity: number;
  confirmedByWaiters: User[]
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  image: string;
  numberOfOrders: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}


export interface CartItem {
  id: string;
  quantity: number;
  food: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  updateUser: {
    status: number;
    message: string;
  };
  changePassword: {
    status: number;
    message: string;
  };
  deleteUser: {
    status: number;
    message: string;
  };
  createTable: {
    status: number;
    message: string;
  };
  updateTable: {
    status: number;
    message: string;
  };
  deleteTable: {
    status: number;
    message: string;
  };
  createFood: {
    status: number;
    message: string;
  };
  updateFood: {
    status: number;
    message: string;
  };
  deleteFood: {
    status: number;
    message: string;
  };
  createCartItem: {
    status: number;
    message: string;
  };
  increaseCartItemQuantity: {
    status: number;
    message: string;
  };
  decreaseCartItemQuantity: {
    status: number;
    message: string;
  };
  deleteCartItem: {
    status: number;
    message: string;
  };
}



export interface GraphqlQuery {
  getUser: {
    user: User;
    status: number,
    message: string
  };
  getTables: {
    tables: Table[];
    message: string;
    status: number;
  };
  getFoods: {
    status: number;
    message: string;
    foods: Food[];
    pagination: Pagination;
  };
  getCategoriesCount: {
    status: number;
    message: string;
    categories: {
      category: string;
      count: number;
    }[];
  };
  getCartItemsByUserId: {
    status: number;
    message: string;
    cartItems: CartItem[];
  }
}
