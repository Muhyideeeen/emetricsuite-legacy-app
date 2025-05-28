import { createAsyncThunk } from "@reduxjs/toolkit";
import { TenantLoginInputs } from "../../../pages/tenantLogin";
import axios,{baseURL} from "../../../services/api";
import   realAxios from "axios";
import jwt_decode from "jwt-decode";

interface EmployeeDecodedAccessToken{
  "token_type": string,
  "exp": number,
  "jti": string,
  "user_id": number,
  "email": string,
  "uuid": string,
  "user_role": string
}
interface TenantLoginSuccessPayload {
  status: number;
  message: string;
  data: {
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

interface TenantLoginErrorPayload {
  status: number;
  message: string;
  // error: any[];
}
type typeToken = "token" |"client_token"

export const saveLoggedInEmployeeNames =async (accessToken:string,org_name?:string,tokenType:typeToken="client_token")=>{
  let url=""
    try{
      const decodedData:EmployeeDecodedAccessToken = jwt_decode(accessToken)
      if(tokenType==="client_token"){
        url =`/client/${org_name}/employee/?user__email=${decodedData?.email}`
      }else if(tokenType==="token"){
        url ="/user/organisation/client/all/"
      }
     console.log(url)
        const resp = await realAxios.get(baseURL+url,{
          headers:{
            "Authorization": "Bearer " + accessToken
          }
        })
        const confirmInfo = resp.data.data[0];
        if(tokenType==="client_token"){
          //this should only happen if a admin/superadmin tries to login through Tenant Acct
          if(["admin","super_admin"].includes(decodedData.user_role)){
            //this means the user is admin,super_admin
            url = `/client/${org_name}/organisation/current/`
            const resp = await realAxios.get(baseURL+url,{
              headers:{
                "Authorization": "Bearer " + accessToken
              }
            })
            let confirmData = resp.data
            localStorage.setItem("userNames",JSON.stringify(
              {
                "first_name":confirmData.owner_first_name,
              "last_name":confirmData.owner_last_name,
            }
            ))
            return "Done!"
          }
        }
        console.log({
          "Names Response":resp
        })
        localStorage.setItem("userNames",JSON.stringify(
          {
            "first_name":tokenType==="client_token"?confirmInfo.user.first_name:confirmInfo.owner_first_name,
          "last_name":tokenType==="client_token"?confirmInfo.user.first_name:confirmInfo.owner_first_name,
        }
        ))
    }
    catch(err:any){
      console.log({err})
    }
}
// pass in a type to rejectValue and return rejectWithValue(knownPayload) in the action creator
// since we have an excpected error & success format
export const loginTenant = createAsyncThunk<
  TenantLoginSuccessPayload,
  TenantLoginInputs,
  {
    rejectValue: any;
  }
>("auth/loginTenant", async (data, thunkApi) => {
  const { org_name, ...rest } = data;
  try {
    const response = await axios.post(`/client/${org_name}/auth/login/`, rest);
    if (response.status === 200) {
      localStorage.setItem("current_organization", org_name);
      //here we call a function that get the user firstName and last name
      console.log({response})
      saveLoggedInEmployeeNames(response.data.data.tokens.access,org_name)
      return response.data as TenantLoginSuccessPayload;
    } else {
      return thunkApi.rejectWithValue(response.data as TenantLoginErrorPayload);
    }
    // why does the err below have to be typed any
  } catch (err: any) {
    console.log({"There was an error logging in":err});

    console.log({"There was an error login in": err.status});
    return thunkApi.rejectWithValue(
      err
    );
  }
});


export const ResetLoginState = createAsyncThunk('auth/ResetTenant', async()=>{
  const response = await 2*2;
  console.log("This will reset any unnessary message in the state")
  return {}
})