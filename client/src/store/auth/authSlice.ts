import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interface";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  email: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    removeEmail: (state) => {
      state.email = null;
    },
    loginUser: (state) => {
      state.isAuthenticated = true;
    },
    setuser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginUser, logout, setEmail, setuser, removeEmail } =
  authSlice.actions;
export default authSlice.reducer;
