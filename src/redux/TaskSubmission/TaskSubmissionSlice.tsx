import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { string_or_null } from "../../drawers/JdDetailDrawer";
import {errorMessageGetter} from "../../utils/errorMessages"
import {getTaskSubmission,createTaskSubmission,handleCreateError,handleCreateErrorType} from "./TaskSubmissionApi"


export interface TaskSubmmision{
    "task_submission_id":string_or_null;
    "user": {
        "user_id": string_or_null;
        "first_name": string_or_null;
        "last_name": string_or_null;
        "email": string_or_null;
    },
    "submission": string_or_null;
    "quantity_target_unit_achieved":string_or_null;
    "created": string_or_null;
}



interface TaskSubmmisionState{
    status: "idle" | "loading" | "adding" | "succeeded" | "added" |"failed"; 
  errorMessage: string|handleCreateErrorType[] | undefined;
  message: string;
  tasksSubmmission:TaskSubmmision[];
count?:number;
next?:string_or_null;
previous?:string_or_null;
}


const initialState = {
    status:'idle',
    errorMessage: '',
    message: '',
    tasksSubmmission: [],
    count:0,
    next:null,
    previous:null
} as TaskSubmmisionState




export const tasksubmission = createSlice({
    name:'task',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getTaskSubmission.pending,(state,action)=>{
            state.status='loading';
        })

        builder.addCase(getTaskSubmission.rejected,(state,action)=>{
            state.status="failed";
            state.errorMessage="Something went wrong"
            // state.tasksSubmmission=[]
        })
        builder.addCase(getTaskSubmission.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.message ="Gotten Your Submmited Task!"
            state.tasksSubmmission = [...action.payload]
        })


        




        builder.addCase(createTaskSubmission.pending,(state,action)=>{
            state.status="adding";
            state.message="submitting your task";

        })


        builder.addCase(createTaskSubmission.rejected,(state,action:any)=>{
            state.status="failed";
            console.log(action.payload,"eroror")
           
            if(action.payload?.status === 403){
                state.errorMessage=handleCreateError(action.payload.data)

            }
            else{
                console.log(action.payload,'from payloadinas')
                state.errorMessage=handleCreateError(action.payload.data)
            }
        
           
        })
        builder.addCase(createTaskSubmission.fulfilled,(state,action)=>{
            
            console.log(action.payload,"fuffiled from create TaskSubmmision Slice")

            
                try{
                    const data = action.payload.user.user_id
                    state.status='added';
                    state.message ="Gotten Your Submmited Task!"
                    console.log(action.payload,"for fuffiled")
                    state.tasksSubmmission = [{...action.payload},...state.tasksSubmmission]
                
                }catch(err:any){
                    console.log(err,'from the error')
                    state.status="failed"
                    if(action.payload?.status === 403){
    
                        state.errorMessage=handleCreateError(action.payload?.message)
        
                    }
                    else{
        
                        state.errorMessage=handleCreateError(action.payload)
                    }
                
                }


            
        })




 
    }
})



export const selectTaskSubmission=(state:RootState)=>state.taskSubmission;
export default tasksubmission.reducer;