import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAllTenantsApi, TenantDataType, UpdateTenatsApi } from "./TenantAdminManagerApi";





type TenantAdminManagerStateType = {
        status: "idle" | "loading" | "adding" | "succeeded" | "added" |
        "failed"|'deleted'|'deleting'|'updated'; 
        errorMessage: string | undefined;
        message: string;
        data:TenantDataType[];
}



const initialState:TenantAdminManagerStateType = {
    status:'idle',
    errorMessage: '',
    message: '',
    data: [],
}


const tenant_admin_management = createSlice({
    name:'tenant_admin_management',
    initialState,
    reducers:{},
    extraReducers:({addCase})=>{

        addCase(getAllTenantsApi.pending,(state,action)=>{
            state.status='loading'
        })

        addCase(getAllTenantsApi.fulfilled,(state,{payload}:PayloadAction<TenantDataType[]>)=>{
            state.status='succeeded'
            state.data=payload
        })

        addCase(getAllTenantsApi.rejected,(state,action)=>{
            state.errorMessage='Some Error occured'
        })

        addCase(UpdateTenatsApi.pending,(state,action)=>{
            //
            state.status='loading'
        })
        addCase(UpdateTenatsApi.fulfilled,(state,{payload}:PayloadAction<TenantDataType>)=>{
            //
            state.status='updated'
            state.data = state.data.map(d=>{
                if(d.company_short_name==payload.company_short_name){
                    return payload
                }
                return d
            })
            // payload
        })

        addCase(UpdateTenatsApi.rejected,(state,action)=>{
            state.status='failed'
            state.message ="Some Error Occured"
        })
    }
})


export const selectTenant_admin_management= (state:RootState)=>state.tenant_admin_management
export default tenant_admin_management.reducer