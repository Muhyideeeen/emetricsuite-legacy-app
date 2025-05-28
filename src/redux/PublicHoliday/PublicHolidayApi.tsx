import { createAsyncThunk } from "@reduxjs/toolkit";
import axios,{baseURL} from "../../services/api";
import realAxios from 'axios'
import jwt_decode from "jwt-decode";



type getPublicHolidayPropType = {
    date_before?:string;
    date_after?:string;
}

export type PublicHolidayType ={
    "name": string;
    "date":string;
}

export const getPublicHoliday = createAsyncThunk(
    'getPublicHoliday/publicholiday',async ({date_after,date_before}:getPublicHolidayPropType)=>{
        const org_name = localStorage.getItem("current_organization_short_name");
        let client_tokens:any = localStorage.getItem('client_tokens')

        if(!client_tokens) return 
        client_tokens = JSON.parse(client_tokens)

        try {
            let customUrl=`client/${org_name}/calendar/holiday/`

            if(date_after&&date_before){
                customUrl = `client/${org_name}/calendar/holiday/?date_before=${date_before}&date_after=${date_after}`
            }
        

            const resp = await realAxios(
                {method:'get',url:baseURL+customUrl,
                    headers:{
                        "Authorization": "Bearer " +client_tokens.access
                      },
                    },)

            console.log({customUrl,resp})

            return resp.data as PublicHolidayType
        } catch (err:any) {
            console.log({err})

            if(err.response.status==401){
                // use the handle error stuff
            }
            return err.response.data

        }

    }
)

type createPublicHolidayProp = {
    data:PublicHolidayType
    handleError?:(e:any)=>void
}
export const createPublicHoliday = createAsyncThunk(
    'createPublicHoliday/publicholiday',async (data:createPublicHolidayProp)=>{
        const org_name = localStorage.getItem("current_organization_short_name");
        let client_tokens:any = localStorage.getItem('client_tokens')

        if(!client_tokens) return 
        client_tokens = JSON.parse(client_tokens)

        try {
            //
            const resp =await realAxios({method:'post',url:baseURL+`/client/${org_name}/calendar/holiday/`,data:{
            name:data.data.name,date:data.data.date
            },
            headers:{
                "Authorization": "Bearer " +client_tokens.access
              },
            },)
            console.log({'dd':resp})
            let somedata=  resp.data.data
                    //  await axios.post(`/client/${org_name}/calendar/holiday/`,data.data)
            return resp.data
        } catch (err:any) {
            //
            if(err.response.status==401){
                if(data.handleError) data.handleError(err)
            }
            console.log({err})
            return err.response.data
        }

    }
)


export const deletePublicHoliday = createAsyncThunk(
    'deletePublicHoliday/publicholiday', async (date:string)=>{
        const org_name = localStorage.getItem("current_organization_short_name");
        let client_tokens:any = localStorage.getItem('client_tokens')

        if(!client_tokens) return 
        client_tokens = JSON.parse(client_tokens)

        try{
            const resp =await realAxios({method:'delete',url:baseURL+`/client/${org_name}/calendar/holiday/${date}`,
                headers:{
                    "Authorization": "Bearer " +client_tokens.access
                  },
                },)
            let data = resp.data.data
            console.log({'deletedMessage':data})
            return date as string
        }
        catch(err:any){


            return err.response.data
        }
    }
)