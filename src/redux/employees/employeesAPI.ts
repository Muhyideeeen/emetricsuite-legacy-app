import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddEmployeeInputs } from "../../drawers/AddEmployee";
import { string_or_null } from "../../drawers/JdDetailDrawer";
import axios from "../../services/api";
import { Employee, LevelSchema } from "./employeesSlice";

export const getAllEmployees = createAsyncThunk(
  "employees/getAllEmployees",
  async ({org_name,pagenum=1,handleError,searchText=''}:{org_name: string,pagenum?:number,handleError:any,searchText?:string;}, thunkApi) => {
    try {
      // console.log(`/employee/list/${org_name}/?search=${searchText}&page=${pagenum}`)
      const response = await axios.get(`client/${org_name}/employee/?search=${searchText}&page=${pagenum}`);
      console.log("Employees", response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response.data);
      if(err.response.status==401){
        handleError(err)
      }

      return thunkApi.rejectWithValue(err.response);
    }
  }
);
export interface LevelInfo{
  "name":string;
  "organisation_short_name": string;
  "uuid": string;
  "slug": string;
}
export interface EmployeeData {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    "user_role":"team_lead"|"employee";
  };
  employee_date_employed: string;
  employee_team: string;
  employee_designation: string;
  uuid: string;
  slug: string;
  "department": null | LevelInfo;
  "division": null | LevelInfo;
  "group": null | LevelInfo;
  "unit": null | LevelInfo;
  corporate_level:null | LevelInfo;
  "employee_basic_information": {
    "designation": {
        "name":string;
        "designation_id": string;
    },
    profile_picture?:any,
    "basic_information_id": string;
    "date_of_birth": string;
    "brief_description":string,
    "education_details":{
      "institution": string,
                        "year": number,
                        "qualification": string
    }[]
},
"employee_employment_information":{
  "upline": {
    "user_id": string;
    "email": string;
    "first_name": string;
    "last_name": string;
},

"employment_information_id": string,
"date_employed": null|string,
"date_of_last_promotion": null|string,
status?:'active'|'on_leave'|'suspended'|'absent'|'dismissed'|'resigned'
}


"employee_contact_information": {
  "contact_information_id":string;
  "personal_email": string;
  "official_email": string;
  "phone_number": string;
  "address": string;
  "guarantor_one_first_name":string;
  "guarantor_one_last_name": string;
  "guarantor_two_first_name": string;
  "guarantor_two_last_name": string;

  "guarantor_one_address": string;
  "guarantor_one_occupation":string;
  "guarantor_one_age": string;
  "guarantor_one_id_card": string_or_null;
  "guarantor_one_passport": string|null;
  "guarantor_two_address": string;
  "guarantor_two_occupation": string;
  "guarantor_two_age": string;
  "guarantor_two_id_card": string_or_null;
  "guarantor_two_passport": string_or_null;
},

"career_path":null|{
  "level": number;
  "career_path_id": string;
"name": string;
},

removeAddDoc?:boolean;
}

interface AddEmployeeSuccessPayload {
  status: number;
  message: string;
  // change "EmployeeData Interface" to a more strucutre stuff late
  data: any;
}

export const addNewEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (
    { data, org_name ,handleError}: { data: AddEmployeeInputs; org_name: string,handleError:any },
    thunkApi
  ) => {
    const newData = {
      user: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
      },
      user_role: {
        role: data.role,
      },
      basic_information: {
        date_of_birth: data.date_of_birth,
        brief_description: data.brief_description,
        
      },
      contact_information: {
        personal_email: data.personal_email,
        phone_number: data.phone_number,
        address: data.address,
        guarantor_one_first_name: data.guarantor_one_first_name,
        guarantor_one_last_name: data.guarantor_one_last_name,
        guarantor_two_first_name: data.guarantor_two_first_name,
        guarantor_two_last_name: data.guarantor_two_last_name,
      },
      employment_information: {
        date_employed: data.date_employed,
      },
      [data.level]: {
        uuid: data.level_id,
      },
      designation: {
        name: data.designation_name,
      },
      career_path: {
        level: Number(data.career_path_level)
    }
    };
    // as of now we submiting form data
    
    const formData = new FormData();
    formData.append("user[first_name]",data.first_name)
    formData.append("user[last_name]",data.last_name)
    formData.append("user[phone_number]",data.phone_number)
    formData.append("user[email]",data.email)
    formData.append("user_role[role]",data.role)
    formData.append("basic_information[date_of_birth]",data.date_of_birth)
    formData.append(`${data.level}[uuid]`,data.level_id)
    formData.append('designation[name]',data.designation_name.toLowerCase())
formData.append('basic_information[brief_description]',data.brief_description)
formData.append('employment_information[date_employed]',data.date_employed)
formData.append("education_details",JSON.stringify(data.education_details))
formData.append('contact_information[personal_email]',data.personal_email)
formData.append('contact_information[phone_number]',data.phone_number)
formData.append('contact_information[address]',data.address)
formData.append('contact_information[guarantor_one_first_name]',data.guarantor_one_first_name)
formData.append('contact_information[guarantor_one_last_name]',data.guarantor_one_last_name)
formData.append("contact_information[guarantor_one_address]"
,data.guarantor_one_address)
formData.append("contact_information[guarantor_one_occupation]"
,data.guarantor_one_occupation)
formData.append("contact_information[guarantor_one_age]"
,JSON.stringify(data.guarantor_one_age))

// file for guranot one
formData.append('contact_information[guarantor_one_id_card]',data.guarantor_one_id_card)
formData.append('contact_information[guarantor_one_passport]',data.guarantor_one_passport)





formData.append('contact_information[guarantor_two_first_name]',data.guarantor_two_first_name)
formData.append('contact_information[guarantor_two_last_name]',data.guarantor_two_last_name)
formData.append("contact_information[guarantor_two_address]"
,data.guarantor_one_address)
formData.append("contact_information[guarantor_two_occupation]"
,data.guarantor_one_occupation)
formData.append("contact_information[guarantor_two_age]"
,JSON.stringify(data.guarantor_two_age))

// file for guranot two
formData.append('contact_information[guarantor_two_id_card]',data.guarantor_two_id_card)
formData.append('contact_information[guarantor_two_passport]',data.guarantor_two_passport)





    try {
      const response = await axios.post(`/client/${org_name}/employee/`, formData);
      console.log(response.data,"form creating employee api")
      return response.data as AddEmployeeSuccessPayload;
    } catch (err: any) {
      if(err.response.status === 401 ){
        handleError(err)
      } 
      console.log("Employee err", err.response.data);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);



export const EditEmployee=createAsyncThunk(
  "employees/editEmployee",
  async( { data, org_name ,handleError}: { data: AddEmployeeInputs; org_name: string,handleError:any },thunkApi)=>{


    const formData = new FormData();
    if(data.status){
      formData.append('employment_information[status]',data.status)
    }
    if(data.profile_picture){
      formData.append('basic_information[profile_picture]',data.profile_picture[0])
    }
    formData.append("user[first_name]",data.first_name)
    formData.append("user[last_name]",data.last_name)
    formData.append("user[phone_number]",data.phone_number)
    formData.append("user[email]",data.email)
    formData.append("user_role[role]",data.role)
    formData.append("basic_information[date_of_birth]",data.date_of_birth)
    formData.append(`${data.level}[uuid]`,data.level_id)
    console.log(data.designation_name,'tobe submited')
    formData.append('designation[name]',data.designation_name.toLowerCase())
formData.append('basic_information[brief_description]',data.brief_description)
formData.append('employment_information[date_employed]',data.date_employed)
formData.append("education_details",JSON.stringify(data.education_details))
formData.append('contact_information[personal_email]',data.personal_email)
formData.append('contact_information[phone_number]',data.phone_number)
formData.append('contact_information[address]',data.address)
formData.append('contact_information[guarantor_one_first_name]',data.guarantor_one_first_name)
formData.append('contact_information[guarantor_one_last_name]',data.guarantor_one_last_name)
formData.append("contact_information[guarantor_one_address]"
,data.guarantor_one_address)
formData.append("contact_information[guarantor_one_occupation]"
,data.guarantor_one_occupation)
formData.append("contact_information[guarantor_one_age]"
,JSON.stringify(data.guarantor_one_age))

// file for guranot one
if(data.guarantor_one_id_card){
  formData.append('contact_information[guarantor_one_id_card]',data.guarantor_one_id_card[0])
}
if(data.guarantor_one_passport){
  formData.append('contact_information[guarantor_one_passport]',data.guarantor_one_passport[0])
}





formData.append('contact_information[guarantor_two_first_name]',data.guarantor_two_first_name)
formData.append('contact_information[guarantor_two_last_name]',data.guarantor_two_last_name)
formData.append("contact_information[guarantor_two_address]"
,data.guarantor_one_address)
formData.append("contact_information[guarantor_two_occupation]"
,data.guarantor_one_occupation)
formData.append("contact_information[guarantor_two_age]"
,JSON.stringify(data.guarantor_two_age))

// file for guranot two
if(data.guarantor_two_id_card){
  formData.append('contact_information[guarantor_two_id_card]',data.guarantor_two_id_card[0])
}
if(data.guarantor_two_passport){
  formData.append('contact_information[guarantor__passport]',data.guarantor_two_passport[0])
}

formData.append('career_path[level]',data.career_path_level)


try {
  
  const response = await axios.put(`/client/${org_name}/employee/${data.employee_uuid}/`, formData);
  console.log(response.data,"form updating employee api")
  return response.data as AddEmployeeSuccessPayload;
} catch (err: any) {
  if(err.response.status === 401 ){
    handleError(err)
  } 
  console.log("Employee err", err.response.data);
  return thunkApi.rejectWithValue(err.response.data);
}

    
  }
)


export const DeleteEmployeeApi=createAsyncThunk("employee/editEmployee",
  async({uuid,org_name,handleError}: { uuid: string; org_name: string;handleError:any },thunkApi)=>{


    try {
      const response = await axios.delete(`/client/${org_name}/employee/${uuid}/`);
      console.log(response.data,"form updating employee api")
      return uuid ;
    } catch (err: any) {
      if(err.response.status === 401 ){
        handleError(err)
      } 
      console.log("Employee err", err.response.data);
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
)



type useGetEmployeeTeamResponse =LevelSchema | null

export const GetEmployeeTeam = (employee:Employee):useGetEmployeeTeamResponse=>{



    return employee.unit ||employee.corporate_level || employee.department || employee.division || employee.group
}