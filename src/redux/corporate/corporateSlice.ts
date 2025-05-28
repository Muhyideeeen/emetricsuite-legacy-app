import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import { Corporate, getCorporates, setupCorporate, updateCorporate,deleteCoporate } from "./corporateAPI";


interface CorporateState {
  status: "idle" | "adding" | "added" | "loading" | "succeeded" | "failed"|'updated'|"deleting"|"deleted";
  errorMessage: string | undefined;
  message: string;
  corporates: Corporate[];
  count?:number;
  next?:string|null;
  previous?:string|null;
}

const initialState: CorporateState = {
  status: "idle",
  errorMessage: "",
  message: "",
  corporates: [],
  count:0,
  next:null,
  previous:null
  
};

export const corporate = createSlice({
  name: "corporate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setupCorporate.pending, (state) => {
      state.status = "adding";
    });
    builder.addCase(setupCorporate.fulfilled, (state, { payload }) => {
      state.status = "added";
      state.message = payload.message;
      
      state.corporates.push(payload.data);
    });
    builder.addCase(setupCorporate.rejected, (state, { payload }) => {
      state.status = "failed";
      state.errorMessage = payload?.message;
    });

    builder.addCase(getCorporates.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCorporates.fulfilled, (state, action) => {
      state.status = "succeeded";
      console.log(action.payload)
      state.corporates = action.payload.data;
      // for pagination
      state.count= action.payload.count
      state.next = action.payload.next
      state.previous = action.payload.previous


    });
    builder.addCase(getCorporates.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.error.message;
    });

    builder.addCase(updateCorporate.pending,(state)=>{
      state.status='adding';
    })
    builder.addCase(updateCorporate.fulfilled,(state,{payload})=>{

      // "this payload contains the Updated Object"
      console.log(payload.data,"corprate upload")
      state.corporates=state.corporates.map(data=>{
        if(data.uuid==payload.uuid){
          return payload
        }
        else{return data}
      })  
      state.status="updated";
      state.message=`Updated "${payload.name}"  Successfully`   
    })

    builder.addCase(updateCorporate.rejected,(state,action)=>{
      state.status='failed';
      state.errorMessage="Error!";
    });



     // delete 
     builder.addCase(deleteCoporate.pending,(state,{payload})=>{
      state.status="deleting"
    });

    builder.addCase(deleteCoporate.fulfilled,(state,{payload})=>{
     
      state.corporates=[...state.corporates.filter(data=>{
        // "payload in the case is uuid that was deleted"
       
        return data.uuid !== payload;
      })]
      state.status="deleted"
      state.message="Deleted Successfully";

    });
    builder.addCase(deleteCoporate.rejected,(state,{payload})=>{
      state.status="failed";
      state.errorMessage= errorMessageGetter(payload)
      
    })
  


  },
});

export const selectCorporate = (state: RootState) => state.corporate;
export default corporate.reducer;
