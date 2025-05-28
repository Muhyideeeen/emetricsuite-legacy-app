import { Box, Stack } from "@chakra-ui/react"
import { useState } from "react"
import SelectAsyncPaginate from "../../components/AsyncSelect"
import TaskListTable from "./TaskComponent/TaskListTable"




const AdminViewEmployeeTask = ():React.ReactElement=>{
    const org_name = localStorage.getItem('current_organization_short_name')
    const [selectedEmployee,setSelectedEmployee] = useState<any>(null)

    return (
        <div>
                        <Stack direction="row" spacing={4}>
                    {/* <CustomDrawer
                      showModalBtnText="Add Task"
                      showModalBtnVariant="primary"
                      showModalBtnColor="white"
                      leftIcon={<HiOutlinePlus />}
                      drawerSize="sm"
                    >
                      <AddTask />
                    </CustomDrawer> */} 
                    <Box>
                        {org_name!==null?
                        <SelectAsyncPaginate
                        url={`/client/${org_name}/employee/?me=`}//we are getting all the employee  because of thier task
                        value={selectedEmployee}
                        onChange={(value)=>{
                        // console.log(value.user.email,">>>>>")
                        return   setSelectedEmployee((EmployeSelect:any)=>value)
                        
                        }}
                        SelectLabel={(option:any)=>`${option.user.first_name} ${option.user.last_name}`}
                        SelectValue={(option:any)=> {
                        return `${option.user.email}`
                        } }
                        placeholder={"Select Employer Name"}
                        />
                        :<p>You need to refresh or relogin into this page</p>
                        }
                    </Box>
    <br /><br /><br />
                 
                  </Stack>
                  <Box>
                  {
                        selectedEmployee?
                        <TaskListTable owner_email='' admin_lookUp={`&owner_email=${selectedEmployee.user.email}`} key={selectedEmployee} />:''
                    }
                  </Box>
        </div>  
    )
}

export default AdminViewEmployeeTask 