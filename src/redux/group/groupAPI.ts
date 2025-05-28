import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { Downline } from "../corporate/corporateAPI";

export interface Group {
  name: string;
  organisation_short_name: string;
  slug: string;
  uuid: string;
  employee_count: number;
  corporate_level: null | {
    slug: string;
    uuid: string;
  };
  division: null | {
    slug: string;
    uuid: string;
  };
  department: Downline[]
  team_lead: null | {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_role: string;
  };
}

interface GroupSuccessPayload {
    status: number;
    message: string;
    data: Group;
  }
  interface GroupErrorPayload {
    status: number;
    message: string;
    errors: any[];
  }

  type getGroupsPayloadType={
    status:number;
    message:string;
    data:Group[]
    count:number;
    next:null|number;
    previous:null|number;
    page_count:number;
  }
  export const getGroups = createAsyncThunk(
    "group/getGroups",
    async ({ORG_NAME,handleError,pagenum=1}:{ORG_NAME: string,handleError:(err:any)=>void,pagenum?:number}) => {
      try {
        const response = await axios.get(`/organization/setup/group-level/list/${ORG_NAME}/?page=${pagenum}`);
        return response.data as getGroupsPayloadType;
      } catch (err: any) {
        console.log("group err", err);
        if(err.response.status==401){
          handleError(err)
        }
        return err.response;
      }
    }
  );




  export const updateGroup = createAsyncThunk(
    "group/updateGroup", async ({org_name,name,uuid,handleError}:{org_name:string,name:string,uuid:string,handleError:(err:any)=>void})=>{
      
      try{
        const response =await axios.put(
          `/organization/setup/group-level/detail/${org_name}/${uuid}/`,{
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
  
  
  export const deleteGroup=createAsyncThunk(
    "group/deleteGroup", async ({org_name,uuid,handleError}:{org_name:string,uuid:string,handleError:(err:any)=>void},thunkApi)=>{
      
      try{
        const response =await axios.delete(
          `/organization/setup/group-level/detail/${org_name}/${uuid}/`);
          console.log(response.data,'from group deleted stuff')
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
  