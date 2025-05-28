import axiosInstance from "./api";
import TokenService from "./token.service";
import { refreshAdminToken, refreshTenantToken } from "../redux/auth/refreshToken/refreshTokenAPI";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // check if request is made from tenant or service account
      let token;
      // if pathname contains /admin, then use admin token
      if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/tenant-management')) {
        //this will get the token for the admin it  called "token" -> the local storage
        token =  TokenService.getLocalAccessToken();
           // if pathname does not contains /admin and api request url contains /client then use client token
      } else if (config.url.includes("/client") && !window.location.pathname.includes('/admin')) {
        //this will get the token for the non-admin users it  called "client_tokens" -> the local storage

        token = TokenService.getLocalAccessToken("client_tokens");
      } else {
        //this will get the token for the non-admin users it  called "client_tokens" -> the local storage

        token = TokenService.getLocalAccessToken("client_tokens");
      }
      // Set the auth header before sending the request
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
        config.headers['Access-Control-Allow-Origin' ] =  '*'
        // config.headers['Access-Control-Allow-Methods'] =  'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
      return config;
    },
    (error) => {
      // Do something with request error
      console.log("This is request error", error);
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      // // if the url is not a login url and if it has not been retried 
      // if (
      //   !originalConfig.url.includes('/login') &&
      //   err.response
      // ) {
      //   // Access token was expired
      //   if (err.response.status === 401 && !originalConfig._retry) {
      //     originalConfig._retry = true;

      //     // For urls in the tenant acccount, use the refresh token for the tenant
      //     if (!window.location.pathname.includes('/admin')) {
      //       try {
      //         dispatch(refreshTenantToken({ refresh_token: TokenService.getLocalRefreshToken("client_tokens")}));
      //         return axiosInstance(originalConfig);
      //       } catch (err) {
      //         console.log(err);
      //         return Promise.reject(err);
      //       }
      //     } else {
      //       try {
      //         dispatch(refreshAdminToken({refresh_token: TokenService.getLocalRefreshToken()}))
      //         return axiosInstance(originalConfig);
      //       } catch (err) {
      //         console.log(err);
      //         return Promise.reject(err);
      //       }
      //     }
      //   }
      // }
      // console.log(err,"Token Expired Matthew Was HEre");
      return Promise.reject(err);
    }
  );
};

export default setup;
