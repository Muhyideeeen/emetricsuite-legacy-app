import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";

export interface Unit {
  name: string;
  organisation_short_name: string;
  slug: string;
  uuid: string;
  corporate_level: null | {
    slug: string;
    uuid: string;
  };
  department: null | {
    slug: string;
    uuid: string;
  };
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

export const getUnits = createAsyncThunk(
    "unit/getUnits",
    async (ORG_NAME: string) => {
      try {
        const response = await axios.get(`/organization/setup/unit-level/list/${ORG_NAME}/`);
        console.log("Units", response.data);
        return response.data.data;
      } catch (err: any) {
        console.log("unit err", err);
        return err.response;
      }
    }
  );









  export const updateUnit = createAsyncThunk(
    "unit/updateUnit", async ({org_name,name,uuid,handleError}:{org_name:string,name:string,uuid:string,handleError:(err:any)=>void})=>{
      
      try{
        const response =await axios.put(
          `/organization/setup/unit-level/detail/${org_name}/${uuid}/`,{
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
  
  
  export const deleteUnit=createAsyncThunk(
    "unit/deleteUnit", async ({org_name,uuid,handleError}:{org_name:string,uuid:string,handleError:(err:any)=>void},thunkApi)=>{
      
      try{
        const response =await axios.delete(
          `/organization/setup/unit-level/detail/${org_name}/${uuid}/`);
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