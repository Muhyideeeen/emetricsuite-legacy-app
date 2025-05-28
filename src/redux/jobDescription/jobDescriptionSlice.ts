import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { createJobDescription } from "./jobDescriptionAPI";

interface JobDescriptionState {
  status: "idle" | "loading" | "succeeded" | "failed";
  errorMessage: string | undefined;
  message: string;
}

const initialState = {
  status: "idle",
  errorMessage: "",
  message: "",
} as JobDescriptionState;

export const jobDescription = createSlice({
  name: "jobDescription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createJobDescription.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createJobDescription.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload.message;
    });
    builder.addCase(createJobDescription.rejected, (state, { payload }) => {
      const errors = payload?.errors[0]
      console.log("okayy err",errors?.message?.name[`${errors.field}.name`]);
      state.status = "failed";
      state.errorMessage = errors?.message?.name[`${errors.field}.name`];
    });
  },
});
export const selectJobDescription = (state: RootState) => state.jobDescription;
export default jobDescription.reducer;
