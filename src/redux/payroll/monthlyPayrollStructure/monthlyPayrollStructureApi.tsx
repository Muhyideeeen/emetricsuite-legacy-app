import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/api";

export type employee_other_receivables ={
    "other_receivables_element":string;
    "other_receivables_element_gross_percent":number
}
export type employee_receivablesType ={
    "fixed_receivables_element": string,
    "fixed_receivables_element_gross_percent": number,
    "regulatory_rates": number
}
export type employee_regulatory_recievablesType = {
    "regulatory_receivables":string,
    "regulatory_receivables_gross_percent":number,
    "regulatory_rates":number;
}
export type employee_regulatory_deductablesType = {
    "regulatory_deductables":string,
    "regulatory_deductables_gross_percent":number,
    "regulatory_rates":number;
}
export type employee_other_deductablesType ={
    "other_deductables":string,
    "other_deductables_gross_percent":number
}

export type MonthlyPayrollStructureType = {
    "grade_level":string,
    "gross_money":number,
    "employee_receivables":employee_receivablesType[],
    "employee_regulatory_recievables":employee_regulatory_recievablesType[],
    "employee_regulatory_deductables":employee_regulatory_deductablesType[],
    "employee_other_deductables":employee_other_deductablesType[],
    'employee_other_receivables':employee_other_receivables[]
    id?:number;
    "structure_type":string;
    "rate"?:number;
    "number_of_work"?:number,
}

type createMonthlyPayrollStructureProp={
    org_name:string;
    data:MonthlyPayrollStructureType;
    handleError:(value:any)=>void;
}
export type createMonthlyPayrollStructureResponse={
    status:number;
    message:string;
    data:MonthlyPayrollStructureType,
}
export const createMonthlyPayrollStructure = createAsyncThunk('monthly_payroll_structure/createMonthlyPayrollStructure',async (data:createMonthlyPayrollStructureProp,thunkApi)=>{


    try{
        const resp =await axios.post(`/client/${data.org_name}/payroll/create/`,data.data);

        console.log({'resp from create':resp})
        return resp.data as createMonthlyPayrollStructureResponse
    }catch(err:any){

        if(err.response.status==401){
            data.handleError(err)
          }
          console.log({'err from create':err})
    
          return  thunkApi.rejectWithValue(err);
    }

})

type getMonthlyPayrollStructureProp ={
    handleError:(value:any)=>void;
    org_name:string;
    structure_type:'monthly'|'daily'|'hourly'
}
export type getMonthlyPayrollStructureSuccessResponse={
    status:number;
    message:string;
    data:MonthlyPayrollStructureType[],
}

export const getMonthlyPayrollStructure = createAsyncThunk('monthly_payroll_structure/getMonthlyPayrollStructure',async (data:getMonthlyPayrollStructureProp,thunkApi)=>{
    try {
        const resp =await axios.get(`/client/${data.org_name}/payroll/create/?structure_type=${data.structure_type}`);
        console.log({'get from create':resp})

        return resp.data as getMonthlyPayrollStructureSuccessResponse
    } catch (err:any) {
        if(err.response.status==401){
            data.handleError(err)
          }
        console.log({'get from create':err})
          return err.response.data;
    }
})