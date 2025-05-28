import { createAsyncThunk } from "@reduxjs/toolkit";
import { TenantUpdateFormType } from "../../components/TenantManage/TenantUpdateManage";
import axios from "../../services/api";



export type TenantDataType = {
    "company_name": string,
    "company_logo": string,
    "owner_email": string,
    "owner_first_name": string,
    "owner_last_name": string,
    "company_short_name": string,
    "owner_phone_number":string,
    "work_start_time": string,
    "work_stop_time": string,
    "work_break_start_time": string,
    "work_break_stop_time": string,
    "work_days": number[],
    "timezone": string,
    "employee_limit":number,
    "lincence": number,
    "start_date": null|string,
    "end_date": null|string,
    "activate": boolean,
    "poc": number,
    "addresse": string,
    "name_of_account_manager": null|string,
    "tel_of_account_manager": null|string,
    "email_of_account_manager": null|string,
    "name_of_account_HRmanager": null|string,
    "tel_of_account_HRmanager": null|string,
    "email_of_account_HRmanager": null|string
}

type getAllTenantsApiType = {
    handleError:(value:any)=>void
}
export const getAllTenantsApi = createAsyncThunk(
    'tenant_admin_management/getAllTenantsApi',async (data:getAllTenantsApiType,thunkApi)=>{
        try {
            const resp = await axios.get('/client-management/manager/')
            return resp.data.data as TenantDataType[]
        } catch (err:any) {

            if(err.response.status == 401){
                data.handleError(err)
              }
            return thunkApi.rejectWithValue(err)
        }
    }
)





type UpdateTenatsApiType = {
    data:TenantUpdateFormType,
    handleError:(value:any)=>void

}
export const UpdateTenatsApi = createAsyncThunk(
    'tenant_admin_management/UpdateTenatsApi',async ({data,handleError}:UpdateTenatsApiType,thunkApi)=>{
        //


        try {
            const resp = await axios.patch(`/client-management/manager/${data.company_short_name}/`,data)
            console.log({resp})

            return resp.data as TenantDataType
        } catch (err:any) {
            if(err.response.status == 401){
                handleError(err)
              }
            return thunkApi.rejectWithValue(err)
        }

    }
)