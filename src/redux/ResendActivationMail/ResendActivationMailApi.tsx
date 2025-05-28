import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";


type sendActivationMailProp = {
    users:string[];
    handleError:(err:any)=>void;
    org_name:string;

}
type sendActivationMailsuccessPayload ={
    status:number;
    message:string;
}

type wrongUUId ={
    "errors": [
        {
            "field": string,
            "message": string
        }
    ],
    "message": string,
    "status": number,
}

export const sendActivationMail = createAsyncThunk(
    'sendActivationMail/resendactivationmail', async ({handleError,users,org_name}:sendActivationMailProp,thunkApi)=>{
        //
        try {
            const response = await axios.post(`/client/${org_name}/auth/resend-activation-mail/`,{
                'user':users
            });
            // console.log("email sending response=", response.data);
            return response.data as sendActivationMailsuccessPayload;
          } catch (err: any) { 
            console.log("all_task err", err);
            if(err.response.status===401){
                
              handleError(err)
            }
          
      
            return err.response;
          }
    }
) 