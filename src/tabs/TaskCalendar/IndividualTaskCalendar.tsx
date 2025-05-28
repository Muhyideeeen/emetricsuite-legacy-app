import { Box, Stack } from "@chakra-ui/react"
import { useState } from "react"
import SelectAsyncPaginate from "../../components/AsyncSelect"
import { getLoggedin_userEmail } from "../../services/auth.service"
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication"
import MyTaskCalendar from "./MyTaskCalendar"





type Prop = {
  is_dash?:boolean
}


const IndividualTaskCalendar = ({is_dash=false}:Prop):React.ReactElement=>{
    const org_name= localStorage.getItem('current_organization_short_name')
    const [team_member,setTeam_member] = useState<any>(null)

    console.log({
        team_member
    })
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
                    {org_name?
                    <SelectAsyncPaginate
                    url={
                        TypeVerifierUserChecker(['admin','admin_hr','super_admin'],'client_tokens')?
                        `/client/${org_name}/employee/?me=10`
                        :
                        `/client/${org_name}/employee/?upline__email=${getLoggedin_userEmail()}`
                    }
                    value={team_member}
                    onChange={(value)=>{
                      // console.log(value.user.email,">>>>>")
                    return   setTeam_member(value)
                    
                    }}
                    SelectLabel={(option:any)=>`${option.user.first_name} ${option.user.last_name}`}
                    SelectValue={(option:any)=> {
                      return `${option.user.email}`
                    } }
                    placeholder={"Choose Employee "}
                    />
                    :<p>You need to refresh or relogin into this page</p>
                    }

                  
                  </Stack>



             <Box>
             {
                        team_member?
                        //is_team is false beacuse we just want to see aemployee info one by one
                        <MyTaskCalendar is_dash={is_dash} user_id={team_member.user.user_id} is_team={false}/>:
                        ''
                    }
            </Box>       
        </div>
    )
}

export default IndividualTaskCalendar