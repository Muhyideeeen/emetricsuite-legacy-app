import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { signUpUser } from "./signUpAPI";

interface SignUpState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
  errorMessage: string | undefined;
  errors: { field: string, message: any }[];
}

const initialState: SignUpState = {
  status: "idle",
  errorMessage: "",
  message: "",
  errors: [{field: "", message: "" }]
};

export const signUp = createSlice({
  name: "signUp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.message = action.payload.message;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload?.message;
    });
  },
});

export const selectSignUp = (state: RootState) => state.signUp;
export default signUp.reducer;
