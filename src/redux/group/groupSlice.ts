import { createSlice } from "@reduxjs/toolkit";
import { number } from "yup";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import { getGroups, Group,deleteGroup,updateGroup } from "./groupAPI";

interface GroupState {
  status: "idle" | "loading" | "succeeded" | "failed"|"deleted"|"deleting"|"adding"|"updated";
  errorMessage: string | undefined;
  message: string;
  groups: Group[];
  count:number;
  next:null|number;
  previous:null|number;
  num_of_page:number;
}

const initialState: GroupState = {
  status: "idle",
  errorMessage: "",
  message: "",
  groups: [],
  count:0,
  next:null,
  previous:null,
  num_of_page:0,
};

export const group = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroups.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getGroups.fulfilled, (state,{type,payload}) => {
      state.status = "succeeded";
      if(payload.status == 200){
        state.groups = payload.data
        state.count = payload.count
        state.previous = payload.previous
        state.next = payload.next
        state.num_of_page = payload.page_count
      }

    });
    builder.addCase(getGroups.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.error.message;
    });




    builder.addCase(updateGroup.pending,(state)=>{
      state.status='adding';
    })
    builder.addCase(updateGroup.fulfilled,(state,{payload})=>{

      // "this payload contains the Updated Object"
      console.log(payload.data,"corprate upload")
      state.groups=state.groups.map(data=>{
        if(data.uuid==payload.uuid){
          return payload
        }
        else{return data}
      })  
      state.status="updated";
      state.message=`Updated "${payload.name}"  Successfully`   
    })

    builder.addCase(updateGroup.rejected,(state,action)=>{
      state.status='failed';
      state.errorMessage="Error!";
    });



     // delete 
     builder.addCase(deleteGroup.pending,(state,{payload})=>{
      state.status="deleting"
    });

    builder.addCase(deleteGroup.fulfilled,(state,{payload})=>{
     
      state.groups=[...state.groups.filter(data=>{
        // "payload in the case is uuid that was deleted"
       
        return data.uuid !== payload;
      })]
      state.status="deleted"
      state.message="Deleted Successfully";

    });
    builder.addCase(deleteGroup.rejected,(state,{payload})=>{
      state.status="failed";
      state.errorMessage= errorMessageGetter(payload)
      
    })
  









    
  },
});

export const selectGroup = (state: RootState) => state.group;
export default group.reducer;
