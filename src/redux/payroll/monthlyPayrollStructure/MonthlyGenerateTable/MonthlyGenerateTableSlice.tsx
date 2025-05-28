import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import errorMessageGetter from "../../../../utils/errorMessages";
import { RootState } from "../../../store";
import { getMonthlyGenerateTable, getMonthlyGenerateTableResponse, MonthlyGenerateTableType } from "./MonthlyGenerateTableApi";

type State={
    status:'pending'|'created'|'creating'|'update'|'updateing'|'delete'|'deleting'|'idle'|'success'|'error',
    errMessage:any;
    data:MonthlyGenerateTableType[]
}
const initialState:State ={
    status:'idle',
    errMessage:null,
    data:[],
}  

const monthly_generate_table = createSlice({
    name:'monthly_generate_table',
    initialState,
    reducers:{
        setMonthlyGenerateTableIdle:(state,action)=>{state.status='idle'}
    },
    extraReducers:({addCase})=>{
        //
        addCase(getMonthlyGenerateTable.pending,(state,action)=>{
            state.status='pending'
        })

        addCase(getMonthlyGenerateTable.fulfilled,(state,{payload}:PayloadAction<getMonthlyGenerateTableResponse>)=>{
            if(payload.status!==400){
                state.status='success'
                state.data = payload.data
                
            }
        })

        addCase(getMonthlyGenerateTable.rejected,(state,{payload}:PayloadAction<any>)=>{
            state.status='error'
            const err:any = payload.response.data
            if(err.error.error){
                state.errMessage=err.error.error
            }else{
                // errorMessageGetter
                state.errMessage=errorMessageGetter(err)
            }
        })
    }
})



export const selectMonthlyGenerateTable =  (state:RootState)=>state.monthly_generate_table
export default monthly_generate_table.reducer