import { createSlice } from "@reduxjs/toolkit";
import TokenService from "../../../services/token.service";
import type { RootState } from "../../store";
import { refreshAdminToken, refreshTenantToken } from "./refreshTokenAPI";

interface RefreshTokenState {
  status: "idle" | "loading" | "succeeded" | "failed";
  errorMessage: string | undefined;
  tokens: {
    access: string;
    refresh: string;
  };
}

const initialState = {
  status: "idle",
  errorMessage: "",
  tokens: {
    access: "",
    refresh: "",
  },
} as RefreshTokenState;

const refreshToken = createSlice({
  name: "refreshToken",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(refreshTenantToken.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(refreshTenantToken.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.errorMessage = "";
      state.tokens = payload.data.tokens;
      TokenService.updateLocalTenantTokens(payload.data.tokens);
    });
    builder.addCase(refreshTenantToken.rejected, (state, { payload }) => {
      console.log("login error", payload);
      state.status = "failed";
      state.errorMessage = payload?.message;
    });

    builder.addCase(refreshAdminToken.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(refreshAdminToken.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.errorMessage = "";
      state.tokens = payload.data.tokens;
      TokenService.updateLocalAdminTokens(payload.data.tokens);
    });
    builder.addCase(refreshAdminToken.rejected, (state, { payload }) => {
      console.log("login error", payload);
      state.status = "failed";
      state.errorMessage = payload?.message;
    });
  },
});

export const selectRefreshToken = (state: RootState) => state.refreshToken;
export default refreshToken.reducer;
