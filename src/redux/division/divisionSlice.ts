import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import { Division, getDivisions, setupDivision,updateDivision,deleteDivision } from "./divisionAPI";


interface DivisionState {
  status: "idle" | "loading" | "succeeded"|"adding" | "failed"|'updated'|"deleting"|"deleted";
  errorMessage: string | undefined;
  message: string;
  divisions: Division[];
  count:number;
  next:null|number;
  previous:null|number;
  num_of_pages:number;
}

const initialState: DivisionState = {
  status: "idle",
  errorMessage: "",
  message: "",
  divisions: [],
  count:0,
  next:null,
  previous:null,
  num_of_pages:0
};

export const division = createSlice({
    name: "division",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setupDivision.pending, (state) => {
            state.status = "loading";
          });
          builder.addCase(setupDivision.fulfilled, (state, { payload }) => {
            state.status = "succeeded";
            state.message = payload.message;
            state.divisions.push(payload.data);
          });
          builder.addCase(setupDivision.rejected, (state, { payload }) => {
            state.status = "failed";
            state.errorMessage = payload?.errors[0].message;
          });
      
          builder.addCase(getDivisions.pending, (state) => {
            state.status = 'loading';
          })
          builder.addCase(getDivisions.fulfilled, (state, {type,payload}) => {
            console.log({payload})
            if(payload.status==200){
              state.status = 'succeeded';
            state.divisions = payload.data
            state.count = payload.count
            state.next = payload.next
            state.previous = payload.previous
            state.num_of_pages=payload.page_count
            }
          })
          builder.addCase(getDivisions.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message
          })



















          builder.addCase(updateDivision.pending,(state)=>{
            state.status='adding';
          })
          builder.addCase(updateDivision.fulfilled,(state,{payload})=>{
      
            // "this payload contains the Updated Object"
            console.log(payload.data,"division upload")
            state.divisions=state.divisions.map(data=>{
              if(data.uuid==payload.uuid){
                return payload
              }
              else{return data}
            })  
            state.status="updated";
            state.message=`Updated "${payload.name}"  Successfully`   
          })
      
          builder.addCase(updateDivision.rejected,(state,action)=>{
            state.status='failed';
            state.errorMessage="Error!";
          });
      
      
      
           // delete 
           builder.addCase(deleteDivision.pending,(state,{payload})=>{
            state.status="deleting"
          });
      
          builder.addCase(deleteDivision.fulfilled,(state,{payload})=>{
           
            state.divisions=[...state.divisions.filter(data=>{
              // "payload in the case is uuid that was deleted"
             
              return data.uuid !== payload;
            })]
            state.status="deleted"
            state.message="Deleted Successfully";
      
          });
          builder.addCase(deleteDivision.rejected,(state,{payload})=>{
            state.status="failed";
            state.errorMessage= errorMessageGetter(payload)
            
          })
        
    }
});

export const selectDivision = (state: RootState) => state.division;
export default division.reducer;