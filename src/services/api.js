import * as axiosOriginal from 'axios';

// export const baseURL= process.env.REACT_APP_baseURL
// export const baseURL= 'http://localhost:8000/'
// export const baseURL= 'https://test.emetricapi.watchdoglogisticsng.com/'
export const baseURL= 'https://emetricapi.watchdoglogisticsng.com/'
// export const baseURL= 'https://e-metric-api-revamp-production.up.railway.app/'
const axios = axiosOriginal.create({
    baseURL,

})

export default axios;