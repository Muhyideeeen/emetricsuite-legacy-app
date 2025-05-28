import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";
import { useErrorHandler } from "react-error-boundary";

export const getTaskSubmission= createAsyncThunk(
    'task/gettasksSubmmision',
   async ({org_name,pagenum=1,task_id,handleError}:{org_name:string,task_id:string,pagenum?:number,handleError:(err:any)=>void}) => {
     
        let url=`/client/${org_name}/task/${task_id}/task-submission`
    
        try {
        const response = await axios.get(url);
        // console.log("Perspectives", response.data);
        console.log(response,"gotten the data")
        return response.data.data;
      } catch (err: any) {
        console.log("all_task err", err);
        handleError(err)
        return err.response;
      }

   }
)




export const createTaskSubmission = createAsyncThunk(
    'task/createTaskSubmission',
    async ({formData,handleError}:{formData:any,handleError:(err:any)=>void} )=>{
  
      const ORG_NAME = localStorage.getItem('current_organization_short_name');
      
      try{
        const response =await axios.post(`/client/${ORG_NAME}/task-submission/`,formData)
        // if{response.data}
        // console.log()
        
  
          return response.data.data;
      
      }
  
      catch (err: any) {
        // handleError(err)
        if(err.response.data.status===401){
         handleError(err)
        }
        //we passing in the data obj of the error response
        console.log(err.response,"errr")
        return err.response.data;
      }
    }
  );

export interface handleCreateErrorType{
  field:string;
  message:string;
}
export const handleCreateError = (errorData:any):handleCreateErrorType[]=>{
  console.log({
    errorData
  })
  const errrorlist=[]
  if(errorData.errors && errorData.errors.length!==0){
      for(let i of errorData.errors)
      errrorlist.push({
              'field':i.field,
              //if it an instance of array bro let pick the first value else get the string
              message:i.message instanceof Array?i.message[0]:i.message
      })
  }

  else{
      errrorlist.push({
          "field":"",
          message:errorData.message
      })
  }
  // else if()
  console.log({
   errrorlist
  })
  return errrorlist
}
