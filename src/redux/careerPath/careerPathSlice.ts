import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { addCareerPath, CareerPath, 
  getCareerPaths,deleteCareerPath,updateCareerPath } from "./careerPathAPI";

interface CareerPathState {
  status: "idle" | "loading" | "succeeded" | "failed"|"deleting"|"deleted"|"updated";
  errorMessage: string | undefined;
  message: string;
  careerPaths: CareerPath[]
  count?:number;
  next?:string|null;
  previous?:string|null;
  num_of_page:number;
}

const initialState = {
  status: "idle",
  errorMessage: "",
  message: "",
  careerPaths: [],
  count:0,
  next:null,
  previous:null,
  num_of_page:0,
} as CareerPathState;

export const careerPath = createSlice({
  name: "careerPath",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCareerPath.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addCareerPath.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.message = payload.message;
      if(state.careerPaths.length==0){
        state.careerPaths.push(payload.data);
      }else{
        state.careerPaths.unshift(payload.data);
      }
    });
    builder.addCase(addCareerPath.rejected, (state, { payload }) => {
      let errorMessage= ''
      
      if (payload instanceof Object){
        console.log("YYYYYYYYYYYYYYYY")
          console.log(payload.errors,"With Pleaser")
          let  word:any
          for (word of payload.errors) {
            errorMessage+=`\n${word.message[0]} ,\n`
            
            
          } 
     
          // console.log()
        }else{
          errorMessage="Some Errors Occured"
        }
     
        state.status='failed'
      state.errorMessage =errorMessage 
      // .name[`${errors.field}.name`];
    });

    builder.addCase(getCareerPaths.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCareerPaths.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.careerPaths = payload.data;
      state.count= payload.count
      state.next = payload.next
      state.previous = payload.previous
      state.num_of_page = payload.page_count

      
    });
    builder.addCase(getCareerPaths.rejected, (state, action) => {
      state.status = "failed";
      console.log({
        action
      })
      state.errorMessage = action.error.message;
    });


    builder.addCase(deleteCareerPath.pending,(state,{payload})=>{
      state.status="deleting";
    })


    builder.addCase(deleteCareerPath.fulfilled,(state,{payload})=>{
      // if()
      state.careerPaths=state.careerPaths.filter(data=>data.career_path_id !== payload)
      state.status="deleted";
      console.log({
        "payload":payload
      })
    })



    //for updating CareerPath
    builder.addCase(updateCareerPath.pending,(state,action)=>{
      state.status="loading"
    })

    builder.addCase(updateCareerPath.fulfilled,(state,{payload})=>{
      state.status="updated";
      


      state.careerPaths=state.careerPaths.map(data=>{
        if(data.career_path_id===payload.data.career_path_id){
          // var previous_name=data.name
          return payload.data
        }
        return data
      })
      state.message="Uploaded Successfully"

    })
  },
});

export const selectCareerPath = (state: RootState) => state.careerPath;
export default careerPath.reducer;
