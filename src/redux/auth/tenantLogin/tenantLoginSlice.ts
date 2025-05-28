import { createSlice } from "@reduxjs/toolkit";
import TokenService from "../../../services/token.service";
import type { RootState } from "../../store";
import { loginTenant ,ResetLoginState} from "./tenantLoginAPI";

interface TenantLoginState {
  status: "idle" | "loading" | "succeeded" | "failed";
  errorMessage: string | undefined;
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
}

const initialState: TenantLoginState = {
  status: "idle",
  errorMessage: "",
  message: "",
  tokens: {
    access: "",
    refresh: ""
  }
};

export const tenantLogin = createSlice({
  name: "tenantLogin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginTenant.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginTenant.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload.message;
      state.errorMessage = "";
      state.tokens = payload.data.tokens;
      TokenService.updateLocalTenantTokens(payload.data.tokens)
    });
    builder.addCase(loginTenant.rejected, (state, { payload }) => {
      state.status = "failed";
      // state.message = "";
      console.log({payload})
      if(payload?.response?.data?.message){
                         
        if(payload?.response?.data?.status === 401){

          state.errorMessage =payload.response.data.message?payload.response.data.message: 'Check your username and password';
        }else{
          state.errorMessage = payload?.message;
        }
      }
     else if(payload?.response?.status === 404){
       
       state.errorMessage = 'Invalid Organization Name';
      }
      
      else{
        
        state.errorMessage = 'Check Your Internet Connection';
      }
    });

    builder.addCase(ResetLoginState.fulfilled,(state,action)=>{
       state.status="idle"
       state.message =""
       state.errorMessage=""
       
    })
  },
});

export const {} = tenantLogin.actions;
export const selectTenantLogin = (state: RootState) => state.loginTenant;
export default tenantLogin.reducer;