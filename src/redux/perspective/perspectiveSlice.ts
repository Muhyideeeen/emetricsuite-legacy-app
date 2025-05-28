import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { addPerspective, deletePerspective, getPerspectives, UpdatePerspective } from "./perspectiveAPI";

interface Perspective {
    name: string;
    target_point: string;
    perspective_id: string;
  }

interface PerspectiveState {
  status: "idle" | "loading" | "adding" | "succeeded" | "added" |
   "failed"|'deleted'|'updated';
  errorMessage: string | undefined;
  message: string;
  perspectives: Perspective[]
  deletedPerspective?:{"name":string;"perspective_id":string;target_point:string;}
  count?:number;
  next?:string|null;
  previous?:string|null;
}

const initialState = {
  status: "idle",
  errorMessage: '',
  message: '',
  perspectives: [],
  count:0,
  next:null,
  previous:null
} as PerspectiveState;

export const perspective = createSlice({
    name: 'perspective',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPerspectives.pending, (state) => {
          state.status = 'loading';
        })
        builder.addCase(getPerspectives.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.perspectives = action.payload.data;
          
          state.count= action.payload.count
          state.next = action.payload.next
          state.previous = action.payload.previous

          
        })
        builder.addCase(getPerspectives.rejected, (state, action) => {
          state.status = 'failed';
          state.errorMessage = action.error.message
        })

        builder.addCase(addPerspective.pending, (state) => {
          state.status = 'adding';
        })
        builder.addCase(addPerspective.fulfilled, (state, action) => {
          state.status = 'added';
          if( state.perspectives.length==0){
            state.perspectives.push(action.payload.data)
          }
          else{
            //if there is more than one take the new item to the front
            state.perspectives.unshift(action.payload.data);
          }
          state.message="added Successfully"
        })
        builder.addCase(addPerspective.rejected, (state, action) => {
          state.status = 'failed';
          state.errorMessage = action.error.message;
        })

        // 
        builder.addCase(deletePerspective.pending,(state)=>{
            state.status='loading';
        })

        builder.addCase(deletePerspective.fulfilled,(state,action)=>{
          state.status='deleted'
          state.message="Deleted Successfully"
          state.deletedPerspective=action.payload
    state.perspectives= state.perspectives.filter(data=>action.payload.perspective_id!==data.perspective_id)
          console.log('deleted',action.payload)
        })

        builder.addCase(deletePerspective.rejected, (state, action) => {
          state.status = 'failed';
          state.errorMessage = action.error.message;
        })

        // for updating status
        builder.addCase(UpdatePerspective.pending,(state)=>{
          state.status= 'adding';
        })

        builder.addCase(UpdatePerspective.fulfilled,(state,action)=>{
          state.status='updated';
          // console.log(action.payload,'from redux')
          state.perspectives=state.perspectives.map(data=>{
            if(data.perspective_id==action.payload.perspective_id){
              // var previous_name=data.name
              return {...data,name:action.payload.name}
            }
            return data
          })


          state.message=`Updated Successfully!!`
          // console.log()
        })

        builder.addCase(UpdatePerspective.rejected, (state, action) => {
          state.status = 'failed';
          state.errorMessage = action.error.message;
        })



      }
})

export const selectPerspective = (state:RootState) => state.perspective;
export default perspective.reducer;


// Add Perspective Error format

 //   .catch((error: AxiosError) => {
    //     console.error(error);
    //     if (error.response?.data) {
    //       toast({
    //         title: error.response.data.errors[0].field,
    //         description: error.response.data.errors[0].message[0],
    //         status: "error",
    //         position: "top-right",
    //         duration: 5000,
    //         isClosable: true,
    //       });
