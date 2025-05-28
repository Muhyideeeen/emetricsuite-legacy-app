import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";
import { Task } from "./taskSlice";






export const getTasks= createAsyncThunk(
    'task/gettasks',
   async ({org_name,pagenum=1,owner_email,handleError,start_date_before,start_date_after}:{org_name:string,owner_email:string,pagenum?:number,handleError:(err:any)=>void,
    start_date_before?:string,start_date_after?:string,
  }) => {
      let url=""
      

        url =`/client/${org_name}/task/?owner_email=${owner_email}&start_date_before=${start_date_before}&start_date_after=${start_date_after}&page=${pagenum}`
    

       if(TypeVerifierUserChecker(["admin","super_admin"])){
         //if it a admin or super admin show everybody task
        url=`/client/${org_name}/task/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&page=${pagenum}`
       }

       console.log(
        "start date url from get task",
        {url}
      )
      try {
        const response = await axios.get(url);
        // console.log("Perspectives", response.data);
        console.log(response.data.data,"gotten the data")
        return response.data;
      } catch (err: any) {
        console.log("all_task err", err);
        if(err.response.status==401){
          handleError(err)
        }
  
        return err.response;
      }

   }
)




export const createTaskApi= createAsyncThunk(
  'task/createtasks',
  async ({formData,handleError}:{formData:any,handleError:(err:any)=>void} )=>{

    const ORG_NAME = localStorage.getItem('current_organization_short_name');
    
    try{
      const response =await axios.post(`/client/${ORG_NAME}/task/`,formData)
      // if{response.data}
      // console.log()
      

        return response.data;
    
    }

    catch (err: any) {
      //we passing in the data obj of the error response
      if(err.response.status === 401){
        handleError(err)
        return err.response.data;
      }
      return err.response.data;
    }
  }
);

export const deleteTask=createAsyncThunk(
  "task/deleteTask",
  async ({ORG_NAME,uuid}:{ORG_NAME:string,uuid:string})=>{
    const response = await axios.delete(`/client/${ORG_NAME}/task/${uuid}/`)
    try{
      return  uuid

    }
    catch(err:any){
      return err.response
    }
  }
)