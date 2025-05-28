import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddPerspectiveInputs } from "../../drawers/AddPerspective";
import axios from "../../services/api";
export const getPerspectives = createAsyncThunk(
  "perspective/getPerspectives",
  async ({ORG_NAME,pagenum=1,handleError}:{ORG_NAME: string,pagenum?:number,handleError:any}) => {
    try {
      const response = await axios.get(`/client/${ORG_NAME}/perspective/?page=${pagenum}`);
      // console.log("Perspectives", response.data);
      return response.data;
    } catch (err: any) {
      console.log("pers err", err);
      if(err.response.status==401){
        handleError(err)
      }
    
      return err.response;
    }
  }
);
export interface PerspectiveParameter{
  "name":string;"perspective_id":string;target_point:string;
}
export const addPerspective = createAsyncThunk(
  "perspective/addPerspective",
  async ({data, ORG_NAME,handleError}: {ORG_NAME:string, data:AddPerspectiveInputs,handleError:any}) => {
    try {
      const response = await axios.post(`/client/${ORG_NAME}/perspective/`, data);
      console.log("One Perspective", response.data);
      return response.data;
    } catch (err: any) {
      console.log("single err", err);
      if(err.response.status==401){
        handleError(err)
      }
      return err.response;
    }
  }
);

export const deletePerspective=createAsyncThunk(
  "perspective/deletePerspective",
  async ({ORG_NAME,perspective}:{ORG_NAME:string,perspective:PerspectiveParameter})=>{
    const response = await axios.delete(`/client/${ORG_NAME}/perspective/${perspective.perspective_id}/`)
    try{
      return  perspective

    }
    catch(err:any){
      return err.response
    }
  }
)


export const UpdatePerspective=createAsyncThunk(
  'perspective/UpdatePerspective',
  async({ORG_NAME,updated_perspective}:{ORG_NAME:string,updated_perspective:PerspectiveParameter})=>{
    const response = await axios.put(`/client/${ORG_NAME}/perspective/${updated_perspective.perspective_id}/`,{
      name:updated_perspective.name
    })

    try{
      return  updated_perspective

    }
    catch(err:any){
      return err.response
    }


  }
)
// Set the ORG_Name in a global state so it can be accessible
//everywhere
//call dispatches with the org name
//replace all places where org name was gotten from local storage with the one in state
// change form data inputs to inputs in redux
