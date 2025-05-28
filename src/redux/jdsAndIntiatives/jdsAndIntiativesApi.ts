import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddJDAndInitiativeInputs } from "../../drawers/AddJDAndInitiative";
import axios from "../../services/api";






export const getJDandintiatives=createAsyncThunk(
    "jdsAndIntiatives/getJDandintiatives",
    async ({handleError}:{handleError:any})=>{

        try{
            const response = await axios.get(``)

            console.log("JDANdIntiaitives", response.data);
            return response.data.data;
        }
        catch(err:any){
            if(err.response.status==401){
                handleError(err)
              }
            console.log("Error from Add JD And Initiative Apis",err)
            return err.response;
        }

    }
);


export const addJDandInitiative=createAsyncThunk(
    'jdsAndIntiatives/addJDandintiatives',

    async({data,ORG_NAME}:{ORG_NAME:string,data:any})=>{
        
        try{
      const response = await axios({
        method:"post",
        url:`/client/${ORG_NAME}/initiative/`,
        "data":data,
        headers: {  'Content-Type': `multipart/form-data; boundary=${data._boundary}` },}
        );
            // console.log("JDANdIntiaitives", response.data);
            return  response.data;
        }
        catch(err:any){
            console.log("Error from Add JD And Initiative Apis", err.response)
            return err.response;
        }

    }
)


export const updateJDandInitiative=createAsyncThunk( 
    'jdsAndIntiatives/updateJDandintiatives',
    async({data,ORG_NAME,uuid,handleError}:{ORG_NAME:string,uuid:string;data:FormData,handleError:(e:any)=>void},thunkApi)=>{
        try {
            console.log(data)
            const response = await axios.put(`/client/${ORG_NAME}/initiative/${uuid}/`,data);
            console.log(response.data,"form updating initiative api")
            return response.data ;
          } catch (err: any) {
            if(err.response.status === 401 ){
              handleError(err)
            } 
            console.log("Employee err", err.response.data);
            return thunkApi.rejectWithValue(err.response.data);
          }
    }
)



export const DeleteJDandInitiativeApi=createAsyncThunk("jdsAndIntiatives/DeleteJDandInitiativeApi",
  async({uuid,org_name,handleError,reOccuring=false}: { uuid: string; org_name: string;handleError:any,reOccuring:boolean  },thunkApi)=>{


    try {
      const response = await axios.delete(`/client/${org_name}/initiative/${uuid}/${reOccuring?'?recurring=True':''}`);
      console.log(response.data,"form deleteing employee api")
      return uuid ;
    } catch (err: any) {
      if(err.response.status === 401 ){
        handleError(err)
      } 
      console.log("Initiative err", err.response.data);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
)




export const deleteBulkJDandInitiativeApi=createAsyncThunk("jdsAndIntiatives/deleteBulkJDandInitiativeApi",
  async({data,org_name,handleError}: { data: string[]; org_name: string;handleError:any },thunkApi)=>{


    try {
      const response = await axios.post(`/client/${org_name}/initiative/bulk-delete/`,{
        'initiative':data
      });
      console.log(response.data,"form deleteing initiative bulk api")
      return response.data;
    } catch (err: any) {
      if(err.response.status === 401 ){
        handleError(err)
      } 
      console.log("Initiative err", err.response.data);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
)