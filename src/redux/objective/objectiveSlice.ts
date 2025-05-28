import { createSlice ,PayloadAction } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import { RootState } from "../store";
import { addObjective, getObjectives ,deleteObjective, updateObjective, deleteBulkObjective} from "./objectiveAPI";

export interface PerspectiveSchema {
  objective: string;
  perspective: {
    name: string;
    perspective_id: string;
    target_point: string;
  };
  objective_perspective_point: string;
  objective_perspective_id: string;
}
export interface ActiveInitiativeType{
  "initiative_id": string;
  "name":string;
  "routine_round": number;
  "target_point":string;
}

export interface Objective {
  name: string;
  owner: {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  objective_id: string;
  duration: number;
  target_point: string;
  start_date: string;
  end_date: string;
  routine_round:number;
  "task_type": string;
  routine_option:"once"|"monthly"|"quarterly"|"half-yearly"|"yearly";
  objective_status:string|null;
  perspectives:PerspectiveSchema[];
  active_initiative:ActiveInitiativeType[];
  corporate_level:{
    name:string;
    organisation_short_name:string;
    uuid:string;
    slug:string;
  }
}

interface ObjectiveState {
  status: "idle" | "loading" | "adding" | "succeeded" | "added" | "failed"|'updating' |'updated'|"deleting"|"deleted";
  errorMessage: string | undefined;
  message: string;
  objectives: Objective[];
  count?:number;
  next?:string|null;
  previous?:string|null;
  listOfSelectedObjectiveid:string[]
}

const initialState = {
  status: "idle",
  errorMessage: "",
  message: "",
  objectives: [],
  count:0,
  next:null,
  previous:null,
  listOfSelectedObjectiveid:[],
} as ObjectiveState;

export const objective = createSlice({
  name: "objective",
  initialState,
  reducers: {
    setListOfSelectedObjectiveid:(state,action:PayloadAction<string>)=>{
      //
      if(state.listOfSelectedObjectiveid.includes(action.payload)){
        //this is to remove existing id
        state.listOfSelectedObjectiveid = [...state.listOfSelectedObjectiveid.filter(data=>data!==action.payload)]
      }

      else{
        //this is to add  id
        state.listOfSelectedObjectiveid=[...state.listOfSelectedObjectiveid,action.payload]
      }
    }
  },
  extraReducers: (builder) => {

    builder.addCase(updateObjective.pending,(state,action)=>{
      //
      state.status ='updating'
    })

    builder.addCase(updateObjective.fulfilled,(state,{type,payload})=>{
      //
      // state.objectives = [...state.objectives, payload]
      state.status ='updated'
    })
    builder.addCase(updateObjective.rejected,(state,action:any)=>{
      //
      console.log('update rejected')
      state.errorMessage =errorMessageGetter(action.payload);
      state.status ='failed'
    })
    builder.addCase(addObjective.pending, (state) => {
      state.status = "adding";
      console.log('adding')

    });
    builder.addCase(addObjective.fulfilled, (state, action) => {
      state.status = "added";
      console.log('added')

      console.log(action.payload,'from added in  slice')

      if( state.objectives.length==0){
        state.objectives.push(action.payload)
      }else{

        state.objectives.unshift(action.payload);
      }
      

    });
    builder.addCase(addObjective.rejected, (state, action:any) => {
      state.status = "failed";
      // "Note there are two error types in this case"
      // let Errormessage='';
      
      
      state.errorMessage =errorMessageGetter(action.payload);
    });

    builder.addCase(getObjectives.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getObjectives.fulfilled, (state, action) => {
      state.status = "succeeded";
      // console.log({action})
      // console.log(action.payload,"from succeeded in slice")
      state.objectives = action.payload.data;

      state.count= action.payload.count
      state.next = action.payload.next
      state.previous = action.payload.previous



    });
    builder.addCase(getObjectives.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.error.message;
    });

    builder.addCase(deleteObjective.pending,(state,{payload})=>{
      state.status="deleting"
    });

    builder.addCase(deleteObjective.fulfilled,(state,{payload})=>{
     
      state.objectives=[...state.objectives.filter(data=>{
        // "payload in the case is uuid that was deleted"
       
        return data.objective_id !== payload;
      })]
      state.status="deleted"
      state.message="Deleted Successfully";

    });
    builder.addCase(deleteObjective.rejected,(state,{payload}:any)=>{
      state.status="failed";
        console.log({'err obj stuff':payload}) 
        if (payload.response.status == 404){
          //this means it has been deleted which is wierd buy year
            state.status='deleted'
            state.message="Deleted Successfully";
        }else{
          state.errorMessage = 'Somthing Went wrong please Check Your Internet'
        }
      // state.errorMessage= errorMessageGetter(payload)
      
    })
  
    // deleteBulkObjective
    builder.addCase(deleteBulkObjective.pending,(state,payload)=>{
      state.status='loading'
    })

    builder.addCase(deleteBulkObjective.fulfilled,(state,{type,payload})=>{
      if(payload.data.status === 200){

        state.status='deleted'
      }
    })
    builder.addCase(deleteBulkObjective.rejected,(state,{type,payload})=>{
 
      state.status='failed'
    })

  },
});

export const { setListOfSelectedObjectiveid }  = objective.actions
export const selectObjective = (state: RootState) => state.objective;
export default objective.reducer;
