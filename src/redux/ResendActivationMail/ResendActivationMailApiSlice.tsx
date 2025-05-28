import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { sendActivationMail } from "./ResendActivationMailApi";




interface State{
    status: "idle" | "loading" | "adding" | "succeeded" | "added" |
    "failed"|'deleted'|'deleting'|'updated'; 
    errorMessage: string | undefined;
    message: string;

}
const initialState={
    status:'idle',
}as State
const ResendActivationMail= createSlice({
    'name':'resendactivationmail',
    initialState,
    reducers:{
        setStatusToIdle:(state,action)=>{
            //this help avoid duplicate message
            state.status='idle'
        }
    },
    extraReducers:({addCase})=>{
        //

        addCase(sendActivationMail.pending,(state,action)=>{
            state.status ='loading';
        })

        addCase(sendActivationMail.fulfilled,(state,{type,payload})=>{
            state.status ='succeeded';

            state.message=payload.message
        })

        addCase(sendActivationMail.rejected,(state,{type,payload})=>{
            state.status ='failed';

            state.errorMessage='some error occured'
        })
        
    }
})

export const { setStatusToIdle } = ResendActivationMail.actions
export const selectResendActivationMail = (state:RootState)=> state.resendActivationMail
 

export default ResendActivationMail.reducer