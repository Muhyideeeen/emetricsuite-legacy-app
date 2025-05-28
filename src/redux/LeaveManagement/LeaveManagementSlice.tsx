import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import { RootState } from "../store";
import { createLeaveApi, getLeaveApi, LeaveType } from "./LeaveManagementApi";


type State ={
    status:'pending'|'created'|'creating'|'update'|'updateing'|'delete'|'deleting'|'idle'|'success'|'error',
    data:LeaveType[],
    errMessage:any,
}

const initialState:State ={
    status:'idle',
    data:[],
    errMessage:null,
}
const leave = createSlice({
    name:'leave',
    initialState,
    reducers:{
        setLeaveStatusToIdle:(state,action)=>{
            state.status='idle'
        }
    },
    extraReducers:({addCase})=>{
        //


        addCase(createLeaveApi.pending,(state,action)=>{
            state.status='pending'
        })

        addCase(createLeaveApi.fulfilled,(state,action)=>{
            if(action.payload.status===400){
                //show error
                state.status='error'

                state.errMessage = errorMessageGetter(action.payload)
            }else{
                state.status='created'
                if(action.payload instanceof Array){
                    
                }else {
                    state.data = [...state.data,action.payload]
                }
            }
        })

        addCase(createLeaveApi.rejected,(state,action)=>{
            state.status='error'
            console.log({'rejected payload':action.payload})
        })

        addCase(getLeaveApi.pending,(state,action)=>{

            state.status = 'pending'
        })

        addCase(getLeaveApi.fulfilled,(state,action)=>{

            if(action.payload.status===400){
                state.errMessage = errorMessageGetter(action.payload)
            }else{
                state.status='success'
                state.data =action.payload
            }
        })
        addCase(getLeaveApi.rejected,(state,action)=>{
            state.status='error'
            console.log({'rejected payload':action.payload})
            state.errMessage = errorMessageGetter(action.payload)
            
        })

    }
})


export const {setLeaveStatusToIdle} = leave.actions
export const selectLeave = (state:RootState)=> state.leave

export default leave.reducer