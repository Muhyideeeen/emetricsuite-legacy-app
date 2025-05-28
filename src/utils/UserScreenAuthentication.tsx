import jwt_decode from "jwt-decode";
import { decode } from "querystring";
// import { useHistory } from "react-router-dom";
// jwt_decode is a funtion that Helps to Decode A Token For Me returning a Useful Object
//decoded contains that usefull object
import TokenService from "../services/token.service";

//this are the expected input that will Be Passed in the function telling the function to allow only this user Type

type  userTypeForThisPageInput = 'team_lead' | "super_admin" |"admin"| "employee"|'admin_hr'
interface decodedUserObjectType {
    token_type: string;
    exp: number;
    jti:string;
    user_id: number;
    email:string;
    uuid: string;
    user_role:userTypeForThisPageInput;
  }

type tokenTypeInput = "tokens" | "client_tokens"
const TypeVerifierUserChecker = (userTypeForThisPage:userTypeForThisPageInput[],tokenType:tokenTypeInput="tokens"):boolean|undefined=>{
    
    let accessToken:string;
    
    accessToken= TokenService.getLocalAccessToken(tokenType);
  

    






    try{
        const decoded = jwt_decode<decodedUserObjectType>(accessToken);
        
        if(userTypeForThisPage.includes(decoded.user_role)){// this means is the current user role inline with what we specified in userTypeForThisPage
            return true
        }
        
    }
    catch{
            // this means there something erong eith the token in genreall take the person back so he can re-login
            if(userTypeForThisPage.includes('super_admin') || userTypeForThisPage.includes('admin')){
             //   history.push('/admin/login')//take this guys to admin login so we can re-get the token 
            }
            else{
            //    history.push('/login')//just take the rest to normal login page
            }
            return false
    }

    
}






export default TypeVerifierUserChecker