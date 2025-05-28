import { Designation } from "../redux/designation/DesignationAPI";
import { EmployeeData } from "../redux/employees/employeesAPI";
import axios from "./api";

class ListService {
  async getDesignationList(org_name: string): Promise<Designation[]> {
    try {
      const response = await axios.get(`/client/${org_name}/designation/`);
      return response.data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getUnitList(org_name: string): Promise<{}[]> {
    try {
      const response = await axios.get(`/organization/setup/unit-level/list/${org_name}/`);
      return response.data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getEmployeesList(org_name:string):Promise<EmployeeData[]>{
    try {
      const response = await axios.get(`/client/${org_name}/employee/`);
      return response.data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}


export default new ListService();

export interface CurrentOrgnisationSettingsType{
  "company_name": string;
  "owner_email": string;
  "owner_first_name": string;
  "owner_last_name": string;
  "company_short_name": string
  "owner_phone_number": string;
  "work_start_time": string;
  "work_stop_time": string;
  "work_break_start_time": string;
  "work_break_stop_time": string;
  "work_days": number[],
  "timezone": string
}


export const getOrganisationWorkInfo = async ()=>{

  const ORG_NAME = localStorage.getItem('current_organization_short_name');


  const response = await axios.get(`/client/${ORG_NAME}/organisation/current/`)

  console.log(response,'testing the getOrganisation')
  if(response?.status==200){
    localStorage.setItem("org_info",JSON.stringify(response.data))
  }

}