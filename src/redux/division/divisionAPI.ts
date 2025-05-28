import { createAsyncThunk } from "@reduxjs/toolkit";
import { DivisionInputs } from "../../components/serviceAccount/form/Division";
import axios from "../../services/api";
import { Downline } from "../corporate/corporateAPI";




interface DivisionInputForApi{
  divisionName: string;
  organizationShortName: string;
  corporate: string;
  handleError:any;
}
export interface Division {
  name: string;
  organisation_short_name: string;
  slug: string;
  uuid: string;
  employee_count: number;
  corporate_level: {
    slug: string;
    uuid: string;
    name:string;
  };
  group: Downline[];
  team_lead: null | {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_role: string;
  };
}

interface DivisionSuccessPayload {
  status: number;
  message: string;
  data: Division;
}
interface DivisionErrorPayload {
  status: number;
  message: string;
  errors: any[];
}
export const setupDivision = createAsyncThunk<
  DivisionSuccessPayload,
  DivisionInputForApi,
  {
    rejectValue: DivisionErrorPayload;
  }
>("division/setupDivision", async (data, thunkApi) => {
  try {
    const response = await axios.post(
      "/organization/setup/divisional-level/create/",
      {
        name: data.divisionName,
        organisation_short_name: data.organizationShortName,
        corporate_level: {
          name: data.corporate,
          organisation_short_name: data.organizationShortName,
        },
      }
    );
    return response.data as DivisionSuccessPayload;
  } catch (err: any) {
    console.log("Division error is", err.response.data);
    if(err.response.status==401){
            
      data.handleError(err)
    }
    return thunkApi.rejectWithValue(err.response.data as DivisionErrorPayload);
  }
});

type getDivisionPayloadType={
  status: number;
  message: string;
  count:number;
  next:null|number;
  previous:null|number;
  data:Division[];
}
export const getDivisions = createAsyncThunk(
  "division/getDivisions",

  async ({ORG_NAME,handleError,pagenum=1}:{ORG_NAME:any,handleError:any,pagenum?:number}) => {
    try {
      const response = await axios.get(
        `/organization/setup/divisional-level/list/${ORG_NAME}/?page=${pagenum}`
      );
      console.log("Divisions", response.data);
      return response.data as getDivisionPayloadType;
    } catch (err: any) {
      console.log("division err", err);
      if(err.response.status==401){
        handleError(err)
      }

      return err.response;
    }
  }
);




export const updateDivision = createAsyncThunk(
  "division/updateDivision", async ({org_name,name,uuid,handleError,corporate_levelName}:{org_name:string,name:string,uuid:string,handleError:(err:any)=>void,corporate_levelName:string,})=>{
  const org_namE = localStorage.getItem("current_organization_short_name");
    if(!org_namE)return 
   const data = {
    //note we only editing the name
    "name":name,
    "organisation_short_name":org_namE,
    "corporate_level": {
        "name":corporate_levelName,
        "organisation_short_name": org_namE
    }
}
console.log(data,'from corp end point')
    try{
      const response =await axios.put(
        `/organization/setup/divisional-level/detail/${org_namE}/${uuid}/`,
       data
        );
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


export const deleteDivision=createAsyncThunk(
  "corporate/deleteDivision", async ({org_name,uuid,handleError}:{org_name:string,uuid:string,handleError:(err:any)=>void},thunkApi)=>{
    
    try{
      const response =await axios.delete(
        `/organization/setup/divisional-level/detail/${org_name}/${uuid}/`);
        console.log({'deletedStuff':response },'from deleted stuff')
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
