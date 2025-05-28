import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import { RootState } from "../store";
import { createPublicHoliday, deletePublicHoliday, getPublicHoliday, PublicHolidayType } from "./PublicHolidayApi";



type StateType ={
    status: 'pending'|'success'|'deleted'|'deleting'|'creating'|'created'|'idle'|'error'
    data:PublicHolidayType[]
    errorMessage?:string;
}

const initialState ={
status:'idle',
data:[]
} as StateType
const publicholiday  = createSlice({
    name:'publicholiday',
    initialState,
    reducers:{
        setPublicHolidayToIdle:(state,action)=>{
            state.status='idle'
        }
    },
    extraReducers:({addCase})=>{
        //

        addCase(getPublicHoliday.pending,(state,action)=>{
            state.status='pending'
        })
        addCase(getPublicHoliday.fulfilled,(state,action)=>{
            state.status='success'
            state.data = action.payload
        })
        addCase(getPublicHoliday.rejected,(state,action)=>{
            state.status='error'
            console.log({'error from getting holiday slice':action.payload})
        })

        //creating holidays

        addCase(createPublicHoliday.pending,(state,action)=>{
            //
            state.status='creating'
        })
    
        addCase(createPublicHoliday.fulfilled,(state,action)=>{
            //
            console.log(action.payload)
            if(action.payload.status===201){
                state.status='created'
                state.data=[...state.data,action.payload.data]
            }else{
                state.status='error'
                state.errorMessage = errorMessageGetter(action.payload)
            }
        })

        addCase(createPublicHoliday.rejected,(state,action:any)=>{
            //
            if(action.payload.status===201){
                state.status='created'
                state.data=[...state.data,action.payload.data]
            }else{
                state.status='error'
                state.errorMessage = errorMessageGetter(action.payload)
            }
        })


        //delete holdiay

        addCase(deletePublicHoliday.pending,(state,action)=>{
            //
            state.status='deleting'
        })

        addCase(deletePublicHoliday.fulfilled,(state,action)=>{
            //
            state.status='deleted'
            state.data = state.data.filter((data)=>data.date!==action.payload)
        })

    }
})




export const { setPublicHolidayToIdle}  = publicholiday.actions
export const selectPublicholiday = (state:RootState)=>state.publicholiday

export default publicholiday.reducer