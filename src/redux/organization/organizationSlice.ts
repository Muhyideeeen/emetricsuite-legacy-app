import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { createOrganization, getAllOrganizations, SingleErrorObject } from "./organizationAPI";

interface Organization {
  company_name: string;
  company_short_name: string;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone_number: string;
}

interface OrganizationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  errorMessage: string | undefined;
  errors: SingleErrorObject[];
  message: string;
  org_name: string;
  org_shortName: string;
  organizations: Organization[];
}

const initialState: OrganizationState = {
  status: "idle",
  errorMessage: "",
  errors: [],
  message: "",
  org_name: "",
  org_shortName: "",
  organizations: []
};

export const organization = createSlice({
  name: "organization",
  initialState,
  reducers: {
    //   clearState: state => {
    //     // state.status = 'idle';
    //     state.errorMessage = '';
    //     state.message = '';
    //     state.success = false;
    //     return state;
    //   }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrganization.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createOrganization.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload.message;
      state.org_shortName = payload.data.company_short_name;
    });
    builder.addCase(createOrganization.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload?.errors[0].message;
      // state.errors.push(...action.payload?.errors);
    });

      builder.addCase(getAllOrganizations.pending, state => {
        state.status = 'loading';
      });
      builder.addCase(getAllOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
      });
      builder.addCase(getAllOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message;
      });
  },
});

//   export const { clearState } = organization.actions;
export const selectOrganization = (state: RootState) => state.organization;

export default organization.reducer;
