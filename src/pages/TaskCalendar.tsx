import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { useErrorHandler } from 'react-error-boundary';
import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from "../components/AppBar"
import Preloader from '../components/Preloader';
import axios from '../services/api';
import { getLoggedin_userEmail } from '../services/auth.service';
import IndividualTaskCalendar from '../tabs/TaskCalendar/IndividualTaskCalendar';
import MyTaskCalendar from '../tabs/TaskCalendar/MyTaskCalendar';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';







// {
//     title:'Markos Data',
//     start:new Date('2022-08-18T16:00:00Z'),
//     end:new Date('2022-08-18T16:59:58Z')
// }

type Prop = {
  is_dash?:boolean
}
const TaskCalendar = ({is_dash=false}:Prop)=>{
    const [tabIndex,setTabIndex]=useState<number>(0);

    const [employee,setEmployee] = useState<any>(null)//we set the employee that logged in here
    const loggedInuserEmail:any = getLoggedin_userEmail();
    const [isLoading,setIsLoading] = useState(false)
    const [teamID,setTeamID] = useState<any>(null)
    const toast = useToast();
    const handleError= useErrorHandler();


    const LoggedInUserID= async()=>{
    const org_name = localStorage.getItem('current_organization_short_name');

        if(loggedInuserEmail){
          setIsLoading(true)

            try{
                const resp = await axios.get(`/client/${org_name}/employee/?user__email=${loggedInuserEmail}`)
                console.log(resp)
                setEmployee(resp.data.data[0])
                setIsLoading(false)
                if(TypeVerifierUserChecker(['team_lead'],'client_tokens')){
                  let Employeedata = resp.data.data[0]
                  Employeedata = Employeedata.corporate_level||Employeedata.department||Employeedata.division||Employeedata.group||Employeedata.unit
                  console.log({Employeedata})
                  setTeamID(Employeedata.uuid)
                }

            }
            catch(e:any){
              setIsLoading(false)
              if(e.response.status==401){
                handleError(e)
              }
                toast({
                    title: 'Something whet wrong',
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                  });
            }
        }
    }


    useEffect(()=>{


        LoggedInUserID()


      },[])
      console.log({teamID})
    return (
        <Box>
          {
             is_dash?'':
           <AppBar heading="Task Calendar"
         avatar="/logo192.png"
         imgAlt=".."
        />
          }

        {
          isLoading?
          <Preloader/>:''
        }
        {
            employee?
            <Tabs colorScheme="primary" isLazy>
            <TabList>
            {
              TypeVerifierUserChecker(['employee','team_lead'],'client_tokens')?
            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5" disabled={isLoading}>
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
              My Time Calendar
          </Tab>:''
            }

                {
                !TypeVerifierUserChecker(["employee","admin","super_admin"],"client_tokens")?
                <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5" disabled={isLoading} >
                    <Box as="span" mr="2">
                    <HiOutlineClipboardList size="22px" />
                    </Box>
                    My Team Time Calendar    
                </Tab>:""
                } 

                 {
                TypeVerifierUserChecker(['admin','admin_hr','super_admin','team_lead'],"client_tokens")?
                <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5" disabled={isLoading} >
                    <Box as="span" mr="2">
                    <HiOutlineClipboardList size="22px" />
                    </Box>
                    {
                      TypeVerifierUserChecker(['admin','admin_hr','super_admin'],"client_tokens")?
                      'Empoyees Time Calendar'
                      :
                      'Individual Team Time Calendar' 
                    }
                     
                </Tab>:""
                }     
            </TabList>
    
    
        <TabPanels pt="8">

            {
              TypeVerifierUserChecker(['employee','team_lead'],'client_tokens')?
                <TabPanel p="0">
                   {
                    employee?
                    <MyTaskCalendar user_id={employee.user.user_id}  is_dash={is_dash}/>
                    :''
                  }
                </TabPanel>:''
            }

            {
              !TypeVerifierUserChecker(["employee","admin","super_admin"],"client_tokens")?
              <TabPanel p="0">
                {
                  teamID?
                  <MyTaskCalendar user_id={teamID} is_team={true}  is_dash={is_dash}/>
                :''
                }
                </TabPanel>:''
            }

{
              TypeVerifierUserChecker(['admin','admin_hr','super_admin','team_lead'],"client_tokens")?
              <TabPanel p="0">
                <IndividualTaskCalendar is_dash={is_dash}/>
                </TabPanel>:''
            }


        </TabPanels>
      </Tabs>:
      // this means this person is an admin of some sought
      <Tabs  colorScheme="primary" isLazy>
        <TabList>
        {
                TypeVerifierUserChecker(['admin','admin_hr','super_admin','team_lead'],"client_tokens")?
                <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5" disabled={isLoading} >
                    <Box as="span" mr="2">
                    <HiOutlineClipboardList size="22px" />
                    </Box>
                    {
                      TypeVerifierUserChecker(['admin','admin_hr','super_admin'],"client_tokens")?
                      'Empoyees Time Calendar'
                      :
                      'Individual Team Time Calendar' 
                    }
                     
                </Tab>:""
                }   
        </TabList>
          <TabPanels pt="8">
          {
              TypeVerifierUserChecker(['admin','admin_hr','super_admin','team_lead'],"client_tokens")?
              <TabPanel p="0">
                <IndividualTaskCalendar is_dash={is_dash}/>
                </TabPanel>:''
            }

          </TabPanels>
      </Tabs>
        }
    



        </Box>
    )
}


export default TaskCalendar