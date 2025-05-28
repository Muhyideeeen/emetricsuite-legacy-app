import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { CareerPathInputs } from "../../drawers/AddCareerPath";

export interface CareerPath {
  name: string;
  level: string;
  career_path_id: string;
  educational_qualification: string;
  years_of_experience_required: string;
  min_age: number;
  max_age: number;
  position_lifespan: number;
  slots_available: number;
  annual_package: number;
}

export interface CareerPathInputsWithFunc {
  level: number;
  name: string;
  educational_qualification: string;
  years_of_experience_required: string;
  min_age: number;
  max_age: number;
  position_lifespan: number;
  slots_available: number;
  annual_package: number;
  handleError:(err:any)=>void,
  uuid?:string;
}

interface CareerPathSuccessPayload {
  status: number;
  message: string;
  data: CareerPath;
}

interface CareerPathErrorPayload {
  status: number;
  message: string;
  errors: {
    field: string;
    message: {
      name: any;
    };
  }[];
}


export const getCareerPaths = createAsyncThunk(
  "careerPath/getCareerPaths",
  async ({ORG_NAME,pagenum=1,handleError}:{ORG_NAME:string,pagenum:number,handleError:(err:any)=>void},) => {
    try {
      const response = await axios.get(`/client/${ORG_NAME}/career-path/?page=${pagenum}`);
      return response.data;
    } catch (err: any) {
      console.error("err", err);
      if(err.response.status==401){
        handleError(err)
      }
      return err.response;
    }
  }
);

export const addCareerPath = createAsyncThunk<
  CareerPathSuccessPayload,
  CareerPathInputsWithFunc,
  { rejectValue: CareerPathErrorPayload }
>("careerPath/addCareerPath", async (data, thunkApi) => {
  const ORG_NAME = localStorage.getItem("current_organization_short_name");
  try {
    const response = await axios.post(`/client/${ORG_NAME}/career-path/`, data);
    return response.data as CareerPathSuccessPayload;
  } catch (err: any) {
    if(err.response.status == 401){
      data.handleError(err)
    }
    return thunkApi.rejectWithValue(
      err.response.data as CareerPathErrorPayload
    );
  }
});



export const updateCareerPath = createAsyncThunk<
  CareerPathSuccessPayload,
  CareerPathInputsWithFunc,
  { rejectValue: CareerPathErrorPayload }
>("careerPath/updateCareerPath", async (data, thunkApi) => {
  const ORG_NAME = localStorage.getItem("current_organization");
  try {
    const structureData ={
      "grade_level": {
          "level_value": data.level
      },
      "educational_qualification": data.educational_qualification,
      "years_of_experience_required": data.years_of_experience_required,
      "min_age": data.min_age,
      "max_age": data.max_age,
      "position_lifespan":data.position_lifespan,
      "slots_available": data.slots_available,
      "annual_package": data.annual_package,
      "name":data.name
  }
    const response = await axios.put(`/client/${ORG_NAME}/career-path/${data?.uuid}/`, structureData);
    console.log({
      response,structureData
    })
    return response.data as CareerPathSuccessPayload;
  } catch (err: any) {
    if(err.response.status == 401){
      data.handleError(err)
    }
    return thunkApi.rejectWithValue(
      err.response.data as CareerPathErrorPayload
    );
  }
});





export const deleteCareerPath=createAsyncThunk(
  "careerPath/deleteCareerPath",
  async ({uuid}:{uuid:string})=>{
    
    const ORG_NAME = localStorage.getItem("current_organization_short_name");    
    if(!ORG_NAME) return 
    try{
      const response = await axios.delete(`/client/${ORG_NAME}/career-path/${uuid}/`)
      console.log({
        response
      })
      let checkDatw = response.data.data
      return  uuid

    }
    catch(err:any){
      return err.response.data
    }
  }
)
