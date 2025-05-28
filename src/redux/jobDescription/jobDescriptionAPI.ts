import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../services/api';
import { JobDescriptionInputs } from "../../drawers/AddJD";
import { Designation } from "../designation/DesignationAPI";

interface JobDescriptionSuccessPayload {
  status: number;
  message: string;
  data: {
    description: string;
    job_description_id: string;
    upline: string | null;
    target_point: string;
    designation:Designation;
    staff_count: number;
  };
}

interface JobDescriptionErrorPayload {
  status: number;
  message: string;
  errors: {
    field: string;
    message: {
      name: any
    }
  }[];
}
export const createJobDescription = createAsyncThunk<
  JobDescriptionSuccessPayload,
  JobDescriptionInputs,
  {
    rejectValue: JobDescriptionErrorPayload;
  }
>("jobDescription/createJobDescription", async (data, thunkApi) => {
  const ORG_NAME = localStorage.getItem("current_organization");
  console.log("transformed",data);
  try {
    const response = await axios.post(`/client/${ORG_NAME}/job-description/`, data);
    console.log("res???", response);
    
    return response.data as JobDescriptionSuccessPayload;
  } catch (err: any) {
    const errors =  err.response.data.errors[0];
    // console.log("errrr??", errors.field);
    // console.log("errrr??", errors.message.name[`${errors.field}.name`]);
    console.log("error is", err.response);
    
    
    return thunkApi.rejectWithValue(
      err.response.data as JobDescriptionErrorPayload
    );
  }
});
