import {  createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import { RootState } from "../store";
import { createLeaveApplicationApi, getLeaveApplicationApi, LeaveApplicationType } from "./LeaveApplicationApi";




type State ={
    status:'pending'|'created'|'creating'|'update'|'updateing'|'delete'|'deleting'|'idle'|'success'|'error',
    data:LeaveApplicationType[],
    errMessage:any,
}

const initialState:State = {
    status:'pending',
    data:[],
    errMessage:null,
}

const leave_application = createSlice({
    name:'leave_application',
    initialState,
    reducers:{
        setLeaveApplicationToIdle:(state,action)=>{
            state.status='idle'
        }
    },
    extraReducers:({addCase})=>{

        //

        addCase(createLeaveApplicationApi.pending,(state,action)=>{
            state.status='pending'
        })

        addCase(createLeaveApplicationApi.fulfilled,(state,action)=>{
            if(action.payload.status ===400){
                state.status='error'
                state.errMessage = errorMessageGetter(action.payload)
            }else{
                state.status='created'
                //this means it went through
                // state.data =[...state.data,...action.payload]
            }
        })

        addCase(createLeaveApplicationApi.rejected,(state,action)=>{
            state.status='error'
            console.log({'error':action.payload})
            state.errMessage = errorMessageGetter(action.payload)
        })


        // getting data 
        addCase(getLeaveApplicationApi.pending,(state,action)=>{
            //
            state.status='pending'
        })

        addCase(getLeaveApplicationApi.fulfilled,(state,action)=>{
            //
            state.status='success'
            state.data = action.payload
        })

        addCase(getLeaveApplicationApi.rejected,(state,action)=>{
            state.status='error'
            state.errMessage = errorMessageGetter(action.payload)
        })
    }
})

export const selectLeaveApplication = (state:RootState)=>state.leave_application
export const {setLeaveApplicationToIdle} = leave_application.actions
export default leave_application.reducer