import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {createTaskApi, getTasks,deleteTask} from './taskAPI'
import {errorMessageGetter} from "../../utils/errorMessages"
type null_or_string =null |string;
export interface Task{
    task_id:string;
    name:string;
    upline_initiative: {
        name: string;
        owner: {
            user_id:string;
            first_name: string;
            last_name: string;
            phone_number: string;
            email: string;}
            assignor:{
                user_id:string;
                first_name: string;
                last_name: string;
                phone_number: string;
                email: string;},
            routine_option:null|string;
            start_date:null|string;
            end_date:string;
            initiative_id:string;
            target_point:string;
        }



        "task_type":null_or_string,
        "routine_round": null_or_string,
        "start_date": null_or_string,
        "start_time": null_or_string,
        "duration": null_or_string,
        "routine_option": null_or_string,
        "repeat_every":null_or_string,
        "occurs_days": [],
        "occurs_month_day_number": null_or_string,
        "occurs_month_day_position": null_or_string,
        "occurs_month_day": null_or_string,
        "end_date": null_or_string,
        "after_occurrence": number,
        "task_status": "pending"|"active",
        "target_brief": null_or_string,
        "turn_around_time_target_point": null_or_string,
        "turn_around_time_target_point_achieved": null_or_string,
        "rework_limit": number,
        "rework_remark": null_or_string,
        "rework_end_date": null_or_string,
        "rework_end_time": null_or_string,
        "quantity_target_unit": null_or_string,
        "quantity_target_unit_achieved": null_or_string,
        "quantity_target_point": null_or_string,
        "quantity_target_point_achieved":null_or_string,
        "quality_target_point":null_or_string,
        "quality_target_point_achieved":null_or_string,
        "target_point": "0.00",
        "target_point_achieved":null_or_string,
        "sensitivity_score": null_or_string,
        "plagiarism_score":null_or_string,
        "average_system_based_score":null_or_string,
        "rating_remark":null_or_string

}


interface TaskState{
    status: "idle" | "loading" | "adding" | "succeeded" | "added" |
    "failed"|'deleted'|'deleting'|'updated'; 
  errorMessage: string | undefined;
  message: string;
tasks:Task[];
count?:number;
next?:null_or_string;
previous?:null_or_string;
page_count:number;
}

const initialState = {
    status:'idle',
    errorMessage: '',
    message: '',
    tasks: [],
    count:0,
    next:null,
    previous:null,
    page_count:0
} as TaskState


export const task = createSlice({
    name:'task',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getTasks.pending,(state,action)=>{
            state.status='loading';
        })

        builder.addCase(getTasks.rejected,(state,action)=>{
            state.status="failed";
            state.errorMessage="Something went wrong"
            state.tasks=[]
        })
        builder.addCase(getTasks.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.message ="Gotten Your Task!"
            state.tasks = [...action.payload.data]


            state.count= action.payload.count
            state.next = action.payload.next
            state.previous = action.payload.previous

            state.page_count= action.payload.page_count
  
        })




    builder.addCase(createTaskApi.pending,(state)=>{
        state.status="adding"
    })

    builder.addCase(createTaskApi.rejected,(state,action)=>{
        state.status='failed'
        console.log("from faild err",action.payload);
        // state.errorMessage=errorMessageGetter(action.payload)

    })

    builder.addCase(createTaskApi.fulfilled,(state,action)=>{
        // state.status="added";
      console.log("from working err",action.payload);

      if(action.payload.status !==201){
          state.status='failed'
          state.errorMessage = errorMessageGetter(action.payload)
      }else{
          //this means it has been added Successfully
        state.status="added"

        if(state.tasks.length ===0){
            state.tasks.push(action.payload.data)
        }
        else{
            state.tasks.unshift(action.payload.data)
        }
        state.message="Added Successfully"
        console.log(action.payload)
        
      }
        
     
    })





    builder.addCase(deleteTask.pending,(state)=>{
        state.status='deleting';
    })

    builder.addCase(deleteTask.fulfilled,(state,{payload})=>{
      state.status='deleted'
      state.message="Deleted Successfully"
      state.tasks=[...state.tasks.filter((data)=>data.task_id!==payload)]
    //   console.log('deleted',action.payload)
    })

    builder.addCase(deleteTask.rejected, (state, action) => {
      state.status = 'failed';
      state.errorMessage = action.error.message;
    })











    }
})


export const selectTask=(state:RootState)=>state.task;
export default task.reducer;