import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";




type State ={
    pending:number,
    completed:number,
    over_due:number,
    active:number
    awaiting:number,
}
const initialState = {
    pending:0,
    completed:0,
    over_due:0,
    active:0,awaiting:0
} as State


type updateTaskSummaryStateProps={
    taskType:'pending'|'completed'|'over_due'|'active'|'awaiting',
    count:number
}
const TaskSummary = createSlice({
    name:'tasksummary',
    initialState,
    reducers:{
        updateTaskSummaryState:(state,action:PayloadAction<updateTaskSummaryStateProps>)=>{
          console.log({[action.payload.taskType]:action.payload.count},'hello')
          //we updating the number based off what what we want to update
            // state = {...state,[action.payload.taskType]:action.payload.count,}
            state[action.payload.taskType]=action.payload.count
            console.log(state,'state')
        }
    }
})



export const  { updateTaskSummaryState } = TaskSummary.actions

export const selectTaskSummary = (state:RootState)=>state.tasksummary


export default TaskSummary.reducer