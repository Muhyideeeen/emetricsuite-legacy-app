import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";
import errorMessageGetter from "../../utils/errorMessages";
import { updateCorporate } from "../corporate/corporateAPI";
import type { RootState } from "../store";
import { addDesignation, deleteDesignation, Designation, getDesignation, updateDesignation } from "./DesignationAPI";

interface DesignationState {
  status: "idle" | "loading" | "succeeded" | "failed"|"deleting"|"deleted"|"updated";
  errorMessage: string | undefined;
  message: string;
  designations: Designation[];
  count?:number;
  next?:string|null;
  previous?:string|null;
  num_of_page:number
}

const initialState = {
  status: "idle",
  errorMessage: "",
  message: "",
  count:0,
  next:null,
  previous:null,
  designations:[],
  num_of_page:0
} as DesignationState;

export const designation = createSlice({
  name: "designation",
  initialState,
  reducers: {
    setStatusIdle:(state,action)=>{
      state.status="idle"
    }
  },
  extraReducers: (builder) => {
    // builder for geting data
    builder.addCase(getDesignation.pending,(state)=>{
      state.status = "loading";
    })

      builder.addCase(getDesignation.fulfilled,(state,action)=>{
        state.status="succeeded";

        state.designations=action.payload.data;

        state.count= action.payload.count
        state.next = action.payload.next
        state.previous = action.payload.previous
        state.num_of_page = action.payload.page_count

      })

      builder.addCase(getDesignation.rejected,(state)=>{
        state.status="failed";
        state.errorMessage="Error Please Check Your Internet";
        state.designations=[]
      })


      // builder for updating designation
      builder.addCase(updateDesignation.pending,(state,action)=>{
        state.status="loading"
        
      })
      builder.addCase(updateDesignation.fulfilled,(state,action)=>{
        state.status="updated"
        console.log(
          action.payload,"PadsuloD"
          )
          let previous_name='';
          state.designations =state.designations.map(data=>{
            if(data.designation_id===action.payload.data.designation_id){
              previous_name=data.name;
              // return {...data,"name":action.payload.data.name}
              return action.payload.data
            }
            
            return data
          })
          state.message=`"${previous_name}" Updated! `
          
        })
        builder.addCase(updateDesignation.rejected,(state,{type,payload})=>{
          state.status='failed'
          state.errorMessage = errorMessageGetter(payload)
          
        })
    builder.addCase(addDesignation.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addDesignation.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.designations = [payload.data,...state.designations]
      state.message = payload.message;
    });
    builder.addCase(addDesignation.rejected, (state, { payload }) => {
      state.status = "failed";
      state.errorMessage = payload?.message;
    });

    // builder for delete Designantions
    builder.addCase(deleteDesignation.pending,(state)=>{
      state.status ="deleting"
    })
    builder.addCase(deleteDesignation.fulfilled,(state,action)=>{
      state.status="deleted"
      // action.payload = contains a string of the DesignationDeleted
      state.designations = state.designations.filter(data=>data.designation_id!==action.payload.designation_id)
      state.message=`Deleted ${action.payload.nameToDelete}`
    })
  },
});

export const { setStatusIdle } = designation.actions;
export const selectDesignation = (state: RootState) => state.designation;
export default designation.reducer;
