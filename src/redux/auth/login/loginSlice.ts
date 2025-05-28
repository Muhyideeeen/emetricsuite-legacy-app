import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { loginUser } from "./loginAPI";

interface LoginState {
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoggedIn: boolean;
  errorMessage: string | undefined;
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
}

const initialState = {
  status: "idle",
  isLoggedIn: false,
  errorMessage: "",
  message: "",
} as LoginState;

export const login = createSlice({
  name: "login",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload.message;
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.status = "failed";
      state.errorMessage = payload;
    });
  },
});

export const {} = login.actions;
export const selectLogin = (state: RootState) => state.login;
export default login.reducer;
