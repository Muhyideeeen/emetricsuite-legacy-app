import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import { deleteUnit, getUnits, Unit, updateUnit } from "./unitAPI";


interface UnitState {
  status: "idle" | "loading" | "succeeded" | "failed" |'updated'|"deleting"|"deleted"| "adding" | "added";
  errorMessage: string | undefined;
  message: string;
  units: Unit[];
}

const initialState: UnitState = {
  status: "idle",
  errorMessage: "",
  message: "",
  units: [],
};

export const unit = createSlice({
  name: "unit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnits.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getUnits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.units = action.payload;
      });
      builder.addCase(getUnits.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message;
      });



      //upddate unit

      builder.addCase(updateUnit.pending,(state)=>{
        state.status='adding';
      })
      builder.addCase(updateUnit.fulfilled,(state,{payload})=>{
  
        // "this payload contains the Updated Object"
        console.log(payload.data,"corprate upload")
        state.units=state.units.map(data=>{
          if(data.uuid==payload.uuid){
            return payload
          }
          else{return data}
        })  
        state.status="updated";
        state.message=`Updated "${payload.name}"  Successfully`   
      })
  
      builder.addCase(updateUnit.rejected,(state,action)=>{
        state.status='failed';
        state.errorMessage="Error!";
      });
  
  
  
       // delete 
       builder.addCase(deleteUnit.pending,(state,{payload})=>{
        state.status="deleting"
      });
  
      builder.addCase(deleteUnit.fulfilled,(state,{payload})=>{
       
        state.units=[...state.units.filter(data=>{
          // "payload in the case is uuid that was deleted"
         
          return data.uuid !== payload;
        })]
        state.status="deleted"
        state.message="Deleted Successfully";
  
      });
      builder.addCase(deleteUnit.rejected,(state,{payload})=>{
        state.status="failed";
        state.errorMessage= errorMessageGetter(payload)
        
      })
  }
});

export const selectUnit = (state: RootState) => state.unit;
export default unit.reducer;
