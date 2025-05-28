import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { CreateOrganizationInputs } from "../../pages/serviceAccount/createOrganization";

interface CreateOrganizationSuccessPayload {
  status: number;
  message: string;
  data: {
    company_name: string;
    owner_email: string;
    owner_first_name: string;
    company_short_name: string;
  };
}

export interface SingleErrorObject  {
    field: string,
    message: string
}

interface CreateOrganizationErrorPayload {
  status: number;
  message: string;
  errors: SingleErrorObject[]
}

export const createOrganization = createAsyncThunk<
CreateOrganizationSuccessPayload,
CreateOrganizationInputs,
{
    rejectValue: CreateOrganizationErrorPayload
}>(
  "user/createOrganization",
  async (data, thunkApi) => {
    console.log(data,"marko data")

    const form = new FormData();

    form.append("work_days",JSON.stringify(data.work_days))
    form.append('organisation_short_name',data.organisation_short_name)
    form.append('organisation_name',data.organisation_name)
    form.append('organisation_logo',data.organisation_logo[0])
    form.append('work_start_time',data.work_start_time)
    form.append('work_stop_time',data.work_stop_time)
    form.append('work_break_start_time',data.work_break_start_time)
    form.append('work_break_stop_time',data.work_break_stop_time)
    form.append('timezone',data.timezone)

    try {
      const response = await axios.post("user/organisation/create/", form);
      if (response.status === 201) {
        console.log("Create Org Response", response.data);
        return response.data as CreateOrganizationSuccessPayload;
      } else {
        return thunkApi.rejectWithValue(response.data as CreateOrganizationErrorPayload);
      }
    } catch (err:any) {
      console.log(data,"marko data")
      console.log("err", err.response.data);
      return thunkApi.rejectWithValue(err.response.data as CreateOrganizationErrorPayload);
    }
  }
);

export const getAllOrganizations = createAsyncThunk(
  "user/getAllOrganizations",
  async () => {
    try {
      const response = await axios.get("user/organisation/client/all/");
      if (response.status === 200) {
        console.log("All org res", response.data);
        return response.data.data;
      }
    } catch (err:any) {
      return err.response.data;
    }
  }
);
