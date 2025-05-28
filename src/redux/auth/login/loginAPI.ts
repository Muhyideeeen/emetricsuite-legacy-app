import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginInputs } from "../../../pages/login";
import axios from "../../../services/api";
import { AxiosError } from 'axios'
import { saveLoggedInEmployeeNames } from "../tenantLogin/tenantLoginAPI";

interface LoginSuccessPayload {
  status: number;
  message: string;
  data: {
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

// pass in a type to rejectValue and return rejectWithValue(knownPayload) in the action creator
// since we have an excpected error & success format
export const loginUser = createAsyncThunk<
  LoginSuccessPayload,
  LoginInputs,
  {
    rejectValue: string;
  }
>("auth/login", async (data, thunkApi) => {
  try {
    const response = await axios.post("/auth/login/", data);
    if (response.status === 200) {
      localStorage.setItem("tokens", JSON.stringify(response.data.data.tokens));
    }
    saveLoggedInEmployeeNames(
     response.data.data.tokens.access,
     "we dont need the orgName refactor by using objects"
      ,
      "token")
    return response.data as LoginSuccessPayload;
  } catch (err:any) {
    if (!err.response) {
      return thunkApi.rejectWithValue(err.message);
    } else {
      return thunkApi.rejectWithValue(err.response.data.message)
    }
  }
});

interface RefreshTokenSuccessPayload {
  status: number;
  message: string;
  data: {
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

interface RefreshTokenErrorPayload {
  status: number;
  message: string;
  error: any[];
}
interface RefreshTokenInput {
  refresh_token: string;
}

// pass in a type to rejectValue and return rejectWithValue(knownPayload) in the action creator
// since we have an excpected error & success format
// export const refreshToken = createAsyncThunk<
//   RefreshTokenSuccessPayload,
//   RefreshTokenInput,
//   {
//     rejectValue: RefreshTokenErrorPayload;
//   }
// >("auth/refreshToken", async (data, thunkApi) => {
//   try {
//     const response = await axios.post("/auth/refresh/token/", data);
//     console.log("Refresh token: I am being called");

//     if (response.status === 200) {
//       return response.data as RefreshTokenSuccessPayload;
//     } else {
//       return thunkApi.rejectWithValue(
//         response.data as RefreshTokenErrorPayload
//       );
//     }
//     // why does the err below have to be typed any
//   } catch (err: any) {
//     console.log("There was an error refreshing your token", err.response.data);
//     return thunkApi.rejectWithValue(
//       err.response.data as RefreshTokenErrorPayload
//     );
//   }
// });
