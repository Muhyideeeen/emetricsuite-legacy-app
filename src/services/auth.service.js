import api from "./api";
import TokenService from "./token.service";
import jwt_decode from "jwt-decode";




export const getLoggedin_userEmail=(tokenType='tokens')=>{


  let accessToken;
  accessToken=TokenService.getAvailableLocalAccessToken(tokenType)

  try{
    const decoded = jwt_decode(accessToken);


    return decoded.email
  }

  catch{
      return false
  }


}

export const getMyInfo = (tokenType='tokens')=>{

  let accessToken;
  accessToken=TokenService.getAvailableLocalAccessToken(tokenType)

  try{
    const decoded_object = jwt_decode(accessToken);


    return decoded_object
  }

  catch{
      return false
  }

}




class AuthService {
  login(username, password) {
    return api
      .post("/auth/login/", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.status === 200) {
          TokenService.setUser(response.data.data.tokens);
        }

        return response.data.data.tokens;
      });
  }

  logout() {
    TokenService.removeUser();
  }

  register(first_name, last_name, phone_number, email, password) {
    return api.post("/auth/register/", {
      first_name,
      last_name,
      phone_number,
      email,
      password,
    });
  }
}

export default new AuthService();
