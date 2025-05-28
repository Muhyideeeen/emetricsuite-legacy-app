import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";





export type LeaveType ={
    "leave_choice": "annual"|'sick'|'maternity'|'paternity'|'bereavement'|'compensatory'|'sabbatical'|'others',
        "duration": number,
        "leave_allowance": string,
        "leave_formula": number,
        "grade_level": number,
        "id"?: number
}

type createLeavePayload={
    data:LeaveType,
    org_name:string,
    handleError:(value:any)=>void;
    forAll?:boolean
}
export const createLeaveApi = createAsyncThunk('leave/createLeave',async ({data,org_name,handleError,forAll=false}:createLeavePayload,thunkApi)=>{

    try{
        // this to avoid sending a valid grade level to the backend when forAll is active
        if(forAll){
            data['grade_level'] = -10
        }
        console.log({data})
        const resp = await axios.post(`client/${org_name}/leave-management/hr-leave-management/${forAll?'?for_all_level=True':''}`,data);
        console.log({resp})
        return resp.data.data
    }   
    catch(err:any){
        if(err.response.status==401){
            handleError(err)
        }

        return err.response.data
    }
})

type getLeavePayload={
    org_name:string,
    handleError:(value:any)=>void
}
export const getLeaveApi  = createAsyncThunk('leave/getLeaveApi',async ({org_name,handleError}:getLeavePayload,thunkApi)=>{
    // /
    try{
        const resp = await axios.get(`client/${org_name}/leave-management/hr-leave-management/`);

        return resp.data.data as LeaveType[]
    }   
    catch(err:any){
        if(err.response.status==401){
            handleError(err)
        }

        return err.response.data
    }
})