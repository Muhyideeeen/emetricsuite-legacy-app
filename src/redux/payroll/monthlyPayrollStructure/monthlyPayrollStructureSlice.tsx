import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import errorMessageGetter from "../../../utils/errorMessages";
import { RootState } from "../../store";
import { getMonthlyPayrollStructureSuccessResponse,createMonthlyPayrollStructure, createMonthlyPayrollStructureResponse, getMonthlyPayrollStructure, MonthlyPayrollStructureType } from "./monthlyPayrollStructureApi";

type StateType = {
    status:'pending'|'created'|'creating'|'update'|'updateing'|'delete'|'deleting'|'idle'|'success'|'error',
    data:MonthlyPayrollStructureType[],
    errMessage:any,
}
const initialState:StateType = {
    status:'idle',
    data:[],
    errMessage:null
}

const monthly_payroll_structure = createSlice({
    name:'monthly_payroll_structure',
    initialState:initialState,
    reducers:{
        setMonthlyPayrollStructureStatusIdle:(state,action)=>{
            //
            state.status='idle'
        }
    },
    extraReducers:({addCase})=>{
        //

        addCase(createMonthlyPayrollStructure.pending,(state,action)=>{
            state.status='creating'
        })

        addCase(createMonthlyPayrollStructure.fulfilled,(state,{payload}:PayloadAction<createMonthlyPayrollStructureResponse>)=>{
            state.status='created';
            console.log({'in success':payload})
            if(payload.status===201){
                state.data = [payload.data,...state.data]
            }else{
                
            }
        })

        addCase(createMonthlyPayrollStructure.rejected,(state,{payload}:PayloadAction<any>)=>{
            state.status='error'
            const err:any = payload.response.data
            if(err.error.error){
                state.errMessage=err.error.error
            }else{
                // errorMessageGetter
                state.errMessage=errorMessageGetter(err)
            }
        })



        addCase(getMonthlyPayrollStructure.pending,(state,action)=>{
            state.status='pending';
        })

        addCase(getMonthlyPayrollStructure.fulfilled,(state,{payload}:PayloadAction<getMonthlyPayrollStructureSuccessResponse>)=>{
            if(payload.status === 200){
                state.status='success';
                state.data = payload.data

            }
        })
        addCase(getMonthlyPayrollStructure.rejected,(state,action)=>{
            state.status='error';
            state.errMessage='Some Error Occured';
        })
    }
})


export const {setMonthlyPayrollStructureStatusIdle} = monthly_payroll_structure.actions
export const selectMontlyPayRollStructure = (state:RootState)=>state.monthly_payroll_structure
export default monthly_payroll_structure.reducer