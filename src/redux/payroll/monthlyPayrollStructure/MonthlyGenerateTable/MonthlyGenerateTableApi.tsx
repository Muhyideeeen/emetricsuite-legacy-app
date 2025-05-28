import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../services/api";

export type savedEmployeeOtherRecievables = {
    other_receivables_element:string;
    other_receivables_element_gross_percent:number;
    value:number
}
type savedEmployeeReceivablesType ={
    fixed_receivables_element:string;
    fixed_receivables_element_gross_percent:number;
    value:number
}
type savedEmployeeRegulatoryRecievablesType={
    Employee_regulatory_recievables:string;
    Employee_regulatory_recievables_gross_percent:number;
    regulatory_rates:number;
    value:number;
}
type savedEmployeeRegulatoryDeductables={
    "Employee_regulatory_deductables": string,
    "Employee_regulatory_deductables_gross_percent": number,
    "regulatory_rates": number,
    "value":number,
}
type savedEmployeeOtherDeductables={
    "Employee_other_deductables": string;
    "Employee_other_deductables_gross_percent": number;
    "value":number;
}
export type MonthlyGenerateTableType ={
    saved_employee_receivables:savedEmployeeReceivablesType[];
    saved_employee_regulatory_recievables:savedEmployeeRegulatoryRecievablesType[];
    saved_employee_regulatory_deductables:savedEmployeeRegulatoryDeductables[];
    saved_employee_other_deductables:savedEmployeeOtherDeductables[];
    saved_employee_other_recievables:savedEmployeeOtherRecievables[];
    id:number;
    "gross_money": string,
    "created_on": string,
    "generated_for":string,
    "updated_at": string,
    "grade_level": number,
    "employee": number,
    employee_full_name:string;
    annual_gross:number;
    total_gross:number;
    net_salary:number
}

type getMonthlyGenerateTableProp = {
    "generated_for":string,
    handleError:(value:any)=>void;
    org_name:string;
}
export type getMonthlyGenerateTableResponse={
    status:number;
    message:string;
    data:MonthlyGenerateTableType[]
}
export const getMonthlyGenerateTable = createAsyncThunk(
    'monthly_generate_table/getMonthlyGenerateTable',async(data:getMonthlyGenerateTableProp,thunkApi)=>{
        //
        try{
            const resp = await axios.get(`/client/${data.org_name}/payroll/monthly_generate/?generated_for=${data.generated_for}`)
            return resp.data as getMonthlyGenerateTableResponse
        }catch(err:any){
            if(err.response.status===401){
                data.handleError(err)
              }
              console.log({'err from create':err})
        
              return  thunkApi.rejectWithValue(err);
        }
    }
)