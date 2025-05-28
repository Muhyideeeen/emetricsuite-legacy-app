import { createAsyncThunk } from '@reduxjs/toolkit';
import { DesignationInputsType } from '../../drawers/AddDesignation';
import axios from '../../services/api';



export type levelsubObject  ={
    name:string;
    organisation_short_name:string;
    uuid:string;
    slug:string;
    
  }
  export type UpdateDegsination = {
    name: string;
    designation_id: string;
  
    corporate_level?:levelsubObject,
    department?: levelsubObject,
    division?:levelsubObject,
    group?: levelsubObject,
    unit?: levelsubObject,
    handleError:(er:any)=>void;
  };
  



interface DesignationInputsTypeWIthErrorFunc{
    name: string;
  level: string;
  level_id: string;
  handleError:any;
}


export type Designation = {
    name: string;
    designation_id: string;

    corporate_level?:string| null,
    department?: string|null,
    division?: string|null,
    group?: string|null,
    unit?: string|null,
  };

interface DesignationSuccessPayload {
    status: number;
    message:string;
    data: Designation;
}

interface DesignationErrorPayload {
    status: number;
    message: string;
    error: any[]
}
export const addDesignation = createAsyncThunk<DesignationSuccessPayload,
DesignationInputsTypeWIthErrorFunc, {
    rejectValue: DesignationErrorPayload
}>('designation/addDesignation', async (data, thunkApi) => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");    
    let orignalLevelObject:any= {
        "corporate-level":"corporate_level",
        "divisional-level":"division",
        "group-level":"group",
        "departmental-level":"department",
        "unit-level":"unit",
    }
    
    const getLevel=orignalLevelObject[data.level]
    const newData = {
        name:data.name,
        [getLevel]: {
            uuid: data.level_id
        } 
    }
    console.log(newData);

    try {
        const response = await axios.post(`/client/${ORG_NAME}/designation/`, newData);
        return response.data as DesignationSuccessPayload;
    } catch (err:any) {
        //this is for the error Boundary
        if(err.response.status==401){
            
            data.handleError(err)
          }
        return thunkApi.rejectWithValue(err.response.data as DesignationErrorPayload)
    }
})


export const deleteDesignation =createAsyncThunk(
    'designation/deleteDesignation',async({nameToDelete,designation_id,handleError}:{nameToDelete:string,designation_id:string,handleError:any})=>{
        const ORG_NAME = localStorage.getItem("current_organization_short_name");    
        try{
            const response = await axios.delete(`/client/${ORG_NAME}/designation/${designation_id}/`)

            return {nameToDelete,designation_id}
        }
        catch(err:any){
            handleError(err)
            return err.response.data
        }

    }
)


export const getDesignation=createAsyncThunk(
    'designation/getDesignation',async ({pagenum=1,handleError}:{pagenum:number,handleError:(er:any)=>void})=>{
        const ORG_NAME = localStorage.getItem("current_organization_short_name");
        try {
          const response = await axios.get(`/client/${ORG_NAME}/designation/?page=${pagenum}`);
            
          return response.data
        } catch (err: any) {
            handleError(err)
         return err.response
        }
    }
)



export const updateDesignation = createAsyncThunk(
    'designation/updateDesignation',async(data:UpdateDegsination,thunkApi)=>{
        const ORG_NAME = localStorage.getItem("current_organization_short_name");

        try {
          const response = await axios.put(`/client/${ORG_NAME}/designation/${data.designation_id}/`,data);
          return response.data
        } catch (err: any) {
            if(err.status===401||err.response.status===401){
                data.handleError(err)
            }
         return thunkApi.rejectWithValue(err.response.data) 
        }


    }
)