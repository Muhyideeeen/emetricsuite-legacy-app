import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignUpInputs } from "../../../pages/signUp";
import axios from "../../../services/api";

interface SignUpSuccessPayload {
  status: number;
  message: string;
  data: [];
}

interface SignUpErrorPayload {
  status: number;
  message: string;
  errors: any[];
}

// pass in a type to rejectValue and return rejectWithValue(knownPayload) in the action creator
// since we have an excpected error & success format
export const signUpUser = createAsyncThunk<
  SignUpSuccessPayload,
  SignUpInputs,
  {
    rejectValue: SignUpErrorPayload;
  }
>("auth/signUp", async (data, thunkApi) => {
  try {
    const response = await axios.post("/auth/register/", data);
    if (response.status === 201) {
      return response.data as SignUpSuccessPayload;
    } else {
      return thunkApi.rejectWithValue(response.data as SignUpErrorPayload);
    }
    // why does the err below have to be typed any
  } catch (err: any) {
    console.log("There was an error signing up", err.response.data);
    return thunkApi.rejectWithValue(err.response.data as SignUpErrorPayload);
  }
});
