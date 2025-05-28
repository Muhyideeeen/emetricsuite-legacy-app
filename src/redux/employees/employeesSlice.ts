import { createSlice } from "@reduxjs/toolkit";
import errorMessageGetter from "../../utils/errorMessages";
import type { RootState } from "../store";
import { addNewEmployee, getAllEmployees ,EditEmployee,DeleteEmployeeApi, EmployeeData} from "./employeesAPI";

export type LevelSchema  = {
  name: string;
  organisation_short_name: string;
  uuid: string;
  slug: string;
};

export interface Employee {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_role:"team_lead"|"employee";
  };
  corporate_level: null | LevelSchema;
  department: null | LevelSchema;
  division: null | LevelSchema;
  group: null | LevelSchema;
  unit: null | LevelSchema;
  employee_basic_information: {
    designation: {
      designation_id:string;
      name:string;
    };
    basic_information_id: string;
    date_of_birth: string;
    brief_description: string;
    education_details:{
      institution: string;
      year: number;
      qualification:string;
    }[]
  };
  employee_contact_information: {
    contact_information_id: string;
    personal_email: string;
    official_email: string;
    phone_number: string;
    address: string;
    guarantor_one_first_name: string;
    guarantor_one_last_name: string;
    guarantor_one_address: string;
    guarantor_one_occupation: string;
    guarantor_one_age: string;
    guarantor_one_id_card:string;
    guarantor_one_passport:string;


    guarantor_two_first_name: string;
    guarantor_two_last_name: string;

    guarantor_two_address: string;
    guarantor_two_occupation: string;
    guarantor_two_age: string;
    guarantor_two_id_card:string;
    guarantor_two_passport:string;
  };
  employee_employment_information: {
    employment_information_id: string;
    upline: {
      user_id: string;
      email: string;
    };
    date_of_last_promotion: string;
    date_employed: string;
    
  };
  career_path: {
    career_path_id: string;
    level: number;
    name: string;
  };
  employee_designation: string;
  uuid: string;
  slug: string;
}

interface EmployeeState {
  status: "idle" | "loading" | "succeeded" | "failed"|"updated"|"updating"|"deleteing"|"deleted";
  errorMessage: string | any;
  message: string;
  employees: EmployeeData[];
  count?:number;
  next?:string|null;
  previous?:string|null;
  num_of_page:number;
}

const initialState: EmployeeState = {
  status: "idle",
  errorMessage: "",
  message: "",
  employees: [],
  count:0,
  next:null,
  previous:null,
  num_of_page:0,
};
export const employees = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployeeStateToIdle:(state,action)=>{
      //
      state.status='idle'
    }
  },
  extraReducers: (builder) => {
    //creating
    builder.addCase(addNewEmployee.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addNewEmployee.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.employees = [ payload?.data,...state.employees]
      state.message = payload.message;
    });
    builder.addCase(addNewEmployee.rejected, (state, {payload}) => {
      state.status = "failed";
      console.log(payload,'from slice employeee')
        state.errorMessage= errorMessageGetter(payload)

      
    });

    //updating
    builder.addCase(EditEmployee.pending,(state)=>{
      state.status="updating";
    })
    builder.addCase(EditEmployee.fulfilled,(state,{payload})=>{
      state.status="updated";
      console.log("updated from the back end",payload)
      state.message = payload.message;
      state.employees=[...state.employees.map(data=>{
        if(data.uuid===payload.data.uuid){
          return payload.data
        }
        return data
      })]
    })

    builder.addCase(EditEmployee.rejected,(state,{payload}:any)=>{
        state.status="failed"
        // payload.errors.map()
      
        state.errorMessage= `please check ${payload.errors[0].field} field`
    })

    //getting

    builder.addCase(getAllEmployees.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getAllEmployees.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.employees = payload.data;
      state.count= payload.count
      state.next = payload.next
      state.previous = payload.previous
      state.num_of_page = payload.page_count

      console.log("This employees payload is", payload);
    });
    builder.addCase(getAllEmployees.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.error.message;
      // state.errorMessage = payload?.message;
      console.log("This employees error is", action.error.message);
    });


    // delete 
    builder.addCase(DeleteEmployeeApi.pending,(state,{payload})=>{
      state.status="deleteing"
    })

    builder.addCase(DeleteEmployeeApi.fulfilled,(state,{payload})=>{
      state.status="deleted"
      state.message="Deleted Successfully";

      state.employees=[...state.employees.filter(data=>{
        // "payload in the case is uuid that was deleted"
       
        return data.uuid !== payload;
      })]

    })
    builder.addCase(DeleteEmployeeApi.rejected,(state,{payload})=>{
      state.status="failed";
      state.errorMessage= errorMessageGetter(payload)
      
    })
  

  },
});

export const { setEmployeeStateToIdle } = employees.actions;
export const selectEmployees = (state: RootState) => state.employees;

export default employees.reducer;
