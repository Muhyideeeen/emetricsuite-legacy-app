import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { Downline } from "../corporate/corporateAPI";

export interface Department {
  name: string;
  organisation_short_name: string;
  slug: string;
  uuid: string;
  corporate_level: null | {
    slug: string;
    uuid: string;
  };
  group: null | {
    slug: string;
    uuid: string;
  };
  unit: Downline[];
  employee_count: number;
  team_lead: null | {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_role: string;
  };
}


type getDepartmentsPayloadType ={
  status:number;
  message:string;
  data:Department[],
  count:number;
  next:string|null;
  previous:string|null;
  page_count:number;
}
export const getDepartments = createAsyncThunk(
    "department/getDepartments",
    async ({ORG_NAME,handleError,pagenum=1}:{ORG_NAME:string,handleError:(err:any)=>void,pagenum?:number}) => {
      try {
        const response = await axios.get(`/organization/setup/departmental-level/list/${ORG_NAME}/?page=${pagenum}`);
        console.log("Departmental", response.data);
        return response.data as getDepartmentsPayloadType ;
      } catch (err: any) {
        console.log("departmental err", err);
        if(err.response.status==401){
          handleError(err)
        }
        return err.response;
      }
    }
  );





  export const updateDepartment= createAsyncThunk(
    "departmental/updateDepartment", async ({org_name,name,uuid,handleError}:{org_name:string,name:string,uuid:string,handleError:(err:any)=>void})=>{
      
      try{
        const response =await axios.put(
          `/organization/setup/departmental-level/detail/${org_name}/${uuid}/`,{
            "name": name,
            "organisation_short_name":org_name
          });
          console.log(response.data)
          return response.data.data;  
      }
    
      catch(err:any){
        console.log("corp err", err);
        if(err.response.status==401){
          handleError(err)
        }
        return err.response;
      }
  
  
    }
  )
  
  
  export const deleteDepartment=createAsyncThunk(
    "departmental/deleteDepartment", async ({org_name,uuid,handleError}:{org_name:string,uuid:string,handleError:(err:any)=>void},thunkApi)=>{
      
      try{
        const response =await axios.delete(
          `/organization/setup/departmental-level/detail/${org_name}/${uuid}/`);
          console.log(response.data,'from deleted stuff')
          return uuid;  
      }
    
      catch(err:any){
        console.log("corp err", err);
        if(err.response.status==401){
          handleError(err)
        }
         console.log(err.response)
        return thunkApi.rejectWithValue(err.response.data);
  
      }
  
  
    }
  )
  