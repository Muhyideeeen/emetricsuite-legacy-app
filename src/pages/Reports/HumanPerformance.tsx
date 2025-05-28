import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from '../../components/AppBar';
import TeamTask from '../../tabs/tasks/TeamTask';
import MyTask from '../../tabs/tasks/MyTask';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
import UserPerformance from '../../tabs/reports/userPerformance';
import IndividualTeamMemberReport from '../../tabs/reports/IndividualTeamMemberReport';
import TeamReport from "../../tabs/reports/TeamReport";
import TeamInitiative from "../../tabs/reports/TeamInitiative"
import {useState,useEffect} from "react";
import IndividualInitiativeReport from '../../tabs/reports/IndividualInitiativeReport';
import TaskCalendar from '../TaskCalendar';


const HumanPerformance =()=>{
  const [tabIndex,setTabIndex]=useState<number>(0);


  useEffect(()=>{
    const currentPageTab = localStorage.getItem("CPMPageTab")
   if(currentPageTab){
     setTabIndex(JSON.parse(currentPageTab))
   }
  },[]) 
    return (
<>
<AppBar
        heading="Human Performance Management"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />

      <Tabs 
      colorScheme="primary" isLazy
      index={tabIndex}
      onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("CPMPageTab",JSON.stringify(currentIndex))
  
      }}
      >
        <TabList>
          {
                TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
             My Task Report
          </Tab>:""
          }

{
                TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
             My Time Report
          </Tab>:""
          }


{
          TypeVerifierUserChecker(["team_lead"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
           My KPI Report
          </Tab>:""
        }

{
                  TypeVerifierUserChecker(["team_lead"],"client_tokens")?


          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
             My Team Task 
          </Tab>:""
           
}


{
          TypeVerifierUserChecker(["team_lead"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                My Team  KPI Report
          </Tab>:""
        }


{
  TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
        Individual Team Member Task Report
          </Tab>:""
}
{
  TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
        Individual Team Member KPI Report
          </Tab>:""
}






            
            
        </TabList>



        <TabPanels
            pt="8"
         >
              {
                TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?
                <TabPanel>
                    <UserPerformance />
                </TabPanel>:""
              }


{
                TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?
                <TabPanel>
                   <TaskCalendar is_dash={true}/>
                </TabPanel>:""
              }
          
          

          {
           TypeVerifierUserChecker(["team_lead"],"client_tokens")?
           <TabPanel>
           {/* <p>Hello world</p> */}
           <IndividualInitiativeReport/>
         </TabPanel>:""
}
 
{
                  TypeVerifierUserChecker(["team_lead"],"client_tokens")?

                <TabPanel>
                  <TeamReport />
                </TabPanel>:""
}   
{
           TypeVerifierUserChecker(["team_lead"],"client_tokens")?
           <TabPanel>
           {/* <p>Hello world</p> */}
           <TeamInitiative />
         </TabPanel>:""
}   

{
  TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?

                <TabPanel>
                <IndividualTeamMemberReport />
                </TabPanel>:""
}






{
  TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?

                <TabPanel>
                kPI REPORT
                </TabPanel>:""
}




        </TabPanels>



      </Tabs>

</>
    )
}



export default HumanPerformance