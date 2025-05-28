import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/api";
import TokenService from "../../../services/token.service";

interface RefreshTenantTokenSuccessPayload {
  status: number;
  message: string;
  data: {
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

interface RefreshTenantTokenErrorPayload {
  status: number;
  message: string;
  error: any[];
}
interface RefreshTenantTokenInput {
  refresh_token: string;
}

// pass in a type to rejectValue and return rejectWithValue(knownPayload) in the action creator
// since we have an excpected error & success format
export const refreshTenantToken = createAsyncThunk<
  RefreshTenantTokenSuccessPayload,
  RefreshTenantTokenInput,
  {
    rejectValue: RefreshTenantTokenErrorPayload;
  }
>("auth/refreshTenantToken", async (data, thunkApi) => {
  try {
    const org_name = localStorage.getItem("current_organization");
    const response = await axios.post(
      `/client/${org_name}/auth/refresh/token/`,
      data
    );
    console.log("Refresh token is being called", response.data);
    return response.data as RefreshTenantTokenSuccessPayload;
    // why does the err below have to be typed any
  } catch (err: any) {
    console.log("There was an error refreshing your token", err.response.data);
    return thunkApi.rejectWithValue(
      err.response.data as RefreshTenantTokenErrorPayload
    );
  }
});

interface RefreshAdminTokenSuccessPayload {
  status: number;
  message: string;
  data: {
    tokens: {
      refresh: string;
      access: string;
    };
  };
}
interface RefreshAdminTokenErrorPayload {
  status: number;
  message: string;
  error: any[];
}
interface RefreshAdminTokenInput {
  refresh_token: string;
}

export const refreshAdminToken = createAsyncThunk<
  RefreshAdminTokenSuccessPayload,
  RefreshAdminTokenInput,
  {
    rejectValue: RefreshAdminTokenErrorPayload;
  }
>("auth/refreshAdminToken", async (data, thunkApi) => {
  try {
    const response = await axios.post(`/auth/refresh/token/`, data);
    console.log("Admin Refresh token was called", response.data);
    return response.data as RefreshAdminTokenSuccessPayload;
  } catch (err: any) {
    console.log(
      "There was an error refreshing your admin token",
      err.response.data
    );
    return thunkApi.rejectWithValue(
      err.response.data as RefreshAdminTokenErrorPayload
    );
  }
});
