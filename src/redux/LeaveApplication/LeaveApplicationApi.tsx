import { createAsyncThunk } from "@reduxjs/toolkit";
import { MutatedCreateLeaveApplicationPayload } from "../../drawers/AddLeaveApplication";
import { string_or_null } from "../../drawers/JdDetailDrawer";
import axios from "../../services/api";
import { Employee } from "../employees/employeesSlice";


export type LeaveApplicationType = {
    "leave_type": {
        "id": 7,
        "leave_choice":  "annual"|'sick'|'maternity'|'paternity'|'bereavement'|'compensatory'|'sabbatical'|'others',
        "duration": 5,
        "leave_formula":string,
        "grade_level": number,
        "leave_allowance":number
    },
    "recorded_allowance": string
    "start_date": string,
    "end_date": string,
    "is_team_lead_can_see": boolean,
    "team_lead_approve": 'approved'|'disapproved'|'request_a_new_date'|'pending',
    "is_hradmin_can_see": boolean,
    "hradmin_lead_approve": 'approved'|'disapproved'|'request_a_new_date'|'pending',
    "employee":Employee[],
    "id": number,
    'deputizing_officer':string;
    'hand_over_report':string_or_null,
    'recorded_duration':number,
    'remark':string;
    
}
export type CreateLeaveApplicationPayload ={
    "recorded_allowance":number,
    "start_date":string,
    "end_date":string,
    "leave_type_id": number
}
type Prop ={
    data:MutatedCreateLeaveApplicationPayload,
    handleError:(value:any)=>void,
    org_name :string
}

export const createLeaveApplicationApi = createAsyncThunk('leave_application/createLeaveApplicationApi',async ({data,handleError,org_name}:Prop,thunkApi)=>{
    const form = new FormData()

    form.append('end_date',data.end_date)
    form.append('start_date',data.start_date)
    form.append('recorded_allowance',JSON.stringify(data.recorded_allowance))
    form.append('leave_type_id',JSON.stringify(data.leave_type_id))
    form.append('deputizing_officer',data.deputizing_officer)
    form.append('hand_over_report',data.hand_over_report)
    try {
            const resp = await axios.post(`client/${org_name}/leave-management/leave-application/`,form)
            console.log({resp})
            return resp.data.data as CreateLeaveApplicationPayload
    } catch (err:any) {
        console.log({err})
        if(err.response.status===401){
            handleError(err)
        }
        return err.response.data 
    }

})

 
type getLeaveApplicationApiProp ={
    handleError:(value:any)=>void,
    org_name :string,
    look_up:string;
}
export const getLeaveApplicationApi = createAsyncThunk('leave_application/getLeaveApplicationApi',async({handleError,org_name,look_up}:getLeaveApplicationApiProp)=>{
    //
    
    try{
        const url =`client/${org_name}/leave-management/leave-application/${look_up}`
        console.log({url})
        const resp = await axios.get(url)
        return resp.data.data as LeaveApplicationType
    }
    catch(err:any){
        if(err.response.status===401){
            handleError(err)
        }   

        return err.response.data 
    }

})