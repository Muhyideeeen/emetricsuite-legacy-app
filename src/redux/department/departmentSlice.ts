import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Department, getDepartments,updateDepartment,deleteDepartment } from "./departmentAPI";
import errorMessageGetter from "../../utils/errorMessages";


interface DepartmentState {
  status: "idle" | "adding" | "added" |"loading" | "succeeded" | "failed"|'updated'|"deleting"|"deleted";
  errorMessage: string | undefined;
  message: string;
  departments: Department[];
  count?:number;
  next?:string|null;
  previous?:string|null;
  num_of_pages:number;
}

const initialState: DepartmentState = {
  status: "idle",
  errorMessage: "",
  message: "",
  departments: [],
  count:0,
  next:null,
  previous:null,
  num_of_pages:0
};

export const department = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDepartments.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getDepartments.fulfilled, (state, {type,payload}) => {
      // state.departments = action.payload;
      if(payload.status==200){
        state.status = "succeeded";
        state.departments = payload.data
        state.count=payload.count
        state.next=payload.next
        state.previous=payload.previous
        state.num_of_pages = payload.page_count
      }
    });
    builder.addCase(getDepartments.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.error.message;
    });






    





    builder.addCase(updateDepartment.pending,(state)=>{
      state.status='adding';
    })
    builder.addCase(updateDepartment.fulfilled,(state,{payload})=>{

      // "this payload contains the Updated Object"
      console.log(payload.data,"corprate upload")
      state.departments=state.departments.map(data=>{
        if(data.uuid==payload.uuid){
          return payload
        }
        else{return data}
      })  
      state.status="updated";
      state.message=`Updated "${payload.name}"  Successfully`   
    })

    builder.addCase(updateDepartment.rejected,(state,action)=>{
      state.status='failed';
      state.errorMessage="Error!";
    });




     // delete 
     builder.addCase(deleteDepartment.pending,(state,{payload})=>{
      state.status="deleting"
    });

    builder.addCase(deleteDepartment.fulfilled,(state,{payload})=>{
     
      state.departments=[...state.departments.filter(data=>{
        // "payload in the case is uuid that was deleted"
       
        return data.uuid !== payload;
      })]
      state.status="deleted"
      state.message="Deleted Successfully";

    });
    builder.addCase(deleteDepartment.rejected,(state,{payload})=>{
      state.status="failed";
      state.errorMessage= errorMessageGetter(payload)
      
    })
  


  },
});

export const selectDepartment = (state: RootState) => state.department;
export default department.reducer;
