import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import {addJDandInitiative, updateJDandInitiative,DeleteJDandInitiativeApi, deleteBulkJDandInitiativeApi} from "./jdsAndIntiativesApi"


// interface IntiativeType{
//     "name": "test initiative 3 weekly 4",
//     "upline_objective": {
//         "name": "test objective 3 monthly 3",
//         "routine_option": "monthly",
//         "start_date": "2022-02-09",
//         "end_date": "2022-03-11",
//         "objective_id": "b4238d44-5d7c-46a4-a103-4614f629556b",
//         "target_point": "2000.00"
//     },
//     "upline_initiative": null,
//     "assignor": null,
//     "owner": {
//         "user_id": "a4ba23c3-62af-4731-b1f0-d9f46c8cda77",
//         "first_name": "test_name",
//         "last_name": "test_name",
//         "phone_number": "1234567890",
//         "email": "managingdirector@gmail.com"
//     },
//     "routine_option": "weekly",
//     "routine_round": 2,
//     "initiative_status": "active",
//     "start_date": "2022-02-18",
//     "end_date": "2022-02-25",
//     "after_occurrence": 3,
//     "initiative_brief": null,
//     "target_point": "200.00",
//     "tasks": [
//         {
//             "task_id":string;
//             "name": string;
//             "routine_round":string|number;
//             "target_point": "30.00"
//         }
//     ],
//     "initiative_id":string;
// }




interface JdAndIntiativesState{
    status: "idle" | "loading" | "succeeded" | "failed" |"updating"|"updated"|"deleting"|"deleted";
    errorMessage: any;
    message: string;
    jdIntiatives:[];
    listOfSelectedInitiativeid:string[]

}

const initialState={
    status: "idle",
    errorMessage: "",
    message: "",
    jdIntiatives:[] as any,
    listOfSelectedInitiativeid:[] as string[]
}


export const  jdIntiatives = createSlice({
    name:'jdIntiatives',
    initialState,
    reducers:{
        setListOfSelectedInitiativeid:(state,action:PayloadAction<string>)=>{
            //
            if(state.listOfSelectedInitiativeid.includes(action.payload)){
                state.listOfSelectedInitiativeid=[...state.listOfSelectedInitiativeid.filter(data=>data!==action.payload)]
            }
            else{
                state.listOfSelectedInitiativeid=[...state.listOfSelectedInitiativeid,action.payload]
            }
        }
    },
    extraReducers:(builder)=>{
        // builder.status='loading'
        builder.addCase(addJDandInitiative.pending,(state)=>{
            state.status='loading'
        })

        builder.addCase(addJDandInitiative.fulfilled,(state,{payload})=>{
            console.log(payload,"from here")
            

            if(payload.status===201||payload.status===200){

                state.status='added'
                state.message=payload.message
                // state.jdIntiatives=[...payload.data.data]
            }
            else if(payload.data?.status!==200 || payload.data?.status !==201){

                console.log(payload,'wwwec')

                let Errormessage='';
                // let err
                if(payload.data.error){
                  // action.payload.error
                  for(let key in  payload.data.error){
                      Errormessage=`${payload.data.error[key]}.\n`
                  }
                }
                if(payload.data.errors){
                  for(let DjangoErrormessage of payload.data.errors){
                      
                    Errormessage=`${
                        DjangoErrormessage.message instanceof Array?DjangoErrormessage.message[0]
                        :(DjangoErrormessage.message.name)?DjangoErrormessage.message.name:DjangoErrormessage.message}.\n`
                  }
                }
                console.log("WWWWWWWWWWWWWowwwwwwwwww",Errormessage)

                state.status='failed'
                state.errorMessage=Errormessage














            }
             
        })

        builder.addCase(addJDandInitiative.rejected,(state,action:any)=>{
            
            state.status='failed'
            state.errorMessage=action.payload
            // alert("ww")
            console.log("rejected for real")
        })

        builder.addCase(updateJDandInitiative.pending,(state,action)=>{
            state.status ="updating"
        })
        builder.addCase(updateJDandInitiative.fulfilled,(state,{payload})=>{
            state.status ="updated";
            state.message="Updated Successfully";

        })

        builder.addCase(updateJDandInitiative.rejected,(state,action:any)=>{
            
            state.status='failed'
            state.errorMessage=errorMessageGetter(action.payload)
            // alert("ww")
            console.log("rejected for real")
        })


        builder.addCase(DeleteJDandInitiativeApi.pending,(state,{payload})=>{
            state.status="deleting"
        })

        builder.addCase(DeleteJDandInitiativeApi.fulfilled,(state,{payload})=>{
            state.status="deleted";
            state.errorMessage="Deleted Successfully";
        })
        builder.addCase(DeleteJDandInitiativeApi.rejected,(state,{payload})=>{
            state.status="failed";  
        })


        builder.addCase(deleteBulkJDandInitiativeApi.pending,(state,{type,payload})=>{
            //
            state.status='pending';
        })
        builder.addCase(deleteBulkJDandInitiativeApi.fulfilled,(state,{type,payload})=>{
            //
            if(payload.status ===200){
                state.status='deleted'
            }else{
                state.status='error'
                state.errorMessage='Somthing went wrong'
            }
        })
        builder.addCase(deleteBulkJDandInitiativeApi.rejected,(state,{type,payload})=>{
            //
            state.status='error';
            state.errorMessage= errorMessageGetter(payload)
        })
    }
})

export const  {setListOfSelectedInitiativeid} = jdIntiatives.actions
export const selectJdIntiatives=(state:RootState)=>state.jdAndIntiative
export default jdIntiatives.reducer;
