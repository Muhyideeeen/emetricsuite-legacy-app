import { createAsyncThunk } from "@reduxjs/toolkit";
import { CorporateInputs } from "../../pages/serviceAccount/setupCorporate";
import axios from "../../services/api";

export interface Downline {
  name: string;
  uuid: string;
  slug: string;
}

export interface Corporate {
  name: string;
  organisation_short_name: string;
  slug: string;
  uuid: string;
  department: Downline[];
  division: Downline[];
  employee_count: number;
  group: Downline[];
  unit: Downline[];
  team_lead: null | {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_role: string;
  };
}

interface CorporateSuccessPayload {
  status: number;
  message: string;
  data: Corporate;
}
interface CorporateErrorPayload {
  status: number;
  message: string;
}

export interface CorporateInputsWithFunc {
  corporateName: string;
  organizationShortName: string;
  handleError:(err:any)=>void
}


export const setupCorporate = createAsyncThunk<
  CorporateSuccessPayload,
  CorporateInputsWithFunc,
  {
    rejectValue: CorporateErrorPayload;
  }
>("corporate/setupCorporate", async (data, thunkApi) => {
  try {
    const response = await axios.post(
      "/organization/setup/corporate-level/create/",
      {
        name: data.corporateName,
        organisation_short_name: data.organizationShortName,
      }
    );
    return response.data as CorporateSuccessPayload;
  } catch (err: any) {
    console.log(err.response.data);
    if(err.response.status==401){
      data.handleError(err)                
      
    }
    return thunkApi.rejectWithValue(err.response.data);
  }
});

export const getCorporates = createAsyncThunk(
  "corporate/getCorporate",
  async ({ORG_NAME,pagenum=1,handleError}:{ORG_NAME: string,pagenum?:number,handleError:(err:any)=>void}) => {
    console.log(pagenum,"pagenum")
    try {
      const response = await axios.get(
        `/organization/setup/corporate-level/list/${ORG_NAME}/?page=${pagenum}`
      );
      console.log("Corporates", response);
      return response.data;
    } catch (err: any) {
      console.log("corp err", err);
       if(err.response.status==401){
        handleError(err)
      }
      return err.response;
    }
  }
);
export const updateCorporate = createAsyncThunk(
  "corporate/updateCorporate", async ({org_name,name,uuid,handleError}:{org_name:string,name:string,uuid:string,handleError:(err:any)=>void})=>{
    
    try{
      const response =await axios.put(
        `/organization/setup/corporate-level/detail/${org_name}/${uuid}/`,{
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


export const deleteCoporate=createAsyncThunk(
  "corporate/deleteCoporate", async ({org_name,uuid,handleError}:{org_name:string,uuid:string,handleError:(err:any)=>void},thunkApi)=>{
    
    try{
      const response =await axios.delete(
        `/organization/setup/corporate-level/detail/${org_name}/${uuid}/`);
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
