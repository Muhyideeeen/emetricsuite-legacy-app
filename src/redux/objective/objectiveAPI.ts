import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddObjectiveInputs } from "../../drawers/AddObjective";
import axios from "../../services/api";
import moment from "moment";

import { UpdateObjectiveInputs } from "../../drawers/UpdateObjective";


export const getObjectives = createAsyncThunk(
  "objective/getObjectives",
  async ({ORG_NAME,pagenum=1,handleError,start_date_after,start_date_before}:{ORG_NAME: string,pagenum?:number,handleError:(e:any)=>void,
    start_date_before?:string,start_date_after?:string,
  }) => {
    try {
      let url =`/client/${ORG_NAME}/objective/?page=${pagenum}`
      if(start_date_before&&start_date_after){
        url=`/client/${ORG_NAME}/objective/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&page=${pagenum}`
      }
      

      const response = await axios.get(url);
      console.log({
        response
      })
      return response.data;
    } catch (err: any) {
      
      if(err.response.status==401){
        handleError(err)
      }
      return err.response;
    }
  }
);

export const addObjective = createAsyncThunk(
  "objective/addObjective",
  async ({data, ORG_NAME}: { ORG_NAME: string; data: AddObjectiveInputs },thunk) => {
    // i need to reformat the date with moment.js
    let newLyupdatedData = {...data}
    if(data.start_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,start_date:moment(newLyupdatedData.start_date).format("YYYY-MM-DD")}
    }

    if(data.end_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,end_date:moment(newLyupdatedData.end_date).format("YYYY-MM-DD")}
    }
    try {
      const response = await axios.post(
        `/client/${ORG_NAME}/objective/`,
        newLyupdatedData
      );
      console.log("One Objective", response.data);
      let resp_data:any
      resp_data = response.data.data
      return resp_data ;
    } catch (err: any) {
      console.log("obj err", err);
      // let error:any
      return thunk.rejectWithValue(err.response.data) ;
    }
  }
);



export const deleteObjective= createAsyncThunk(
  "objective/deleteObjective",
  async ({uuid, ORG_NAME,recurring=false}: { ORG_NAME: string; uuid:string,recurring?:boolean },thunk) => {
    // i need to reformat the date with moment.js
   
    try {
      const response = await axios.delete(
        `/client/${ORG_NAME}/objective/${uuid}/${recurring?'?recurring=True':''}`,
      );
      
      return uuid;
    } catch (err: any) {
      console.log("obj err", err);
      // let error:any
      return thunk.rejectWithValue(err) ;
    }
  }

)

export const deleteBulkObjective= createAsyncThunk(
  "objective/deleteBulkObjective",
  async ({ ORG_NAME,data}: { ORG_NAME: string; data:string[]},thunk) => {
    // i need to reformat the date with moment.js
   
    try {
      const response = await axios.post(
        `/client/${ORG_NAME}/objective/bulk-delete/`,{
          'objective':data
        }
      );
      console.log({response})
      return {'data':response.data,'listOfDeletedId':data} as  {data:any,listOfDeletedId:string[]};
    } catch (err: any) {
      console.log("obj err", err);
      // let error:any
      console.log({err})

      return err.response.data;
    }
  }

)

export const updateObjective = createAsyncThunk(
  "objective/updateObjectiveapi",
  async ({data, ORG_NAME , id,is_recurring}: { ORG_NAME: string; data: UpdateObjectiveInputs,id:string, is_recurring:boolean },thunk) => {
    // i need to reformat the date with moment.js
    let newLyupdatedData = {...data}
    if(data.start_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,start_date:moment(newLyupdatedData.start_date).format("YYYY-MM-DD")}
    }

    if(data.end_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,end_date:moment(newLyupdatedData.end_date).format("YYYY-MM-DD")}
    }
    try {
      const response = await axios.put(
        `/client/${ORG_NAME}/objective/${id}/${is_recurring?'?recurring=True':''}`,
        newLyupdatedData
      );
      console.log("One Objective", response.data);
      let resp_data:any
      resp_data = response.data.data
      return resp_data ;
    } catch (err: any) {
      console.log("obj err", err);
      // let error:any
      return thunk.rejectWithValue(err.response.data) ;
    }
  }
);