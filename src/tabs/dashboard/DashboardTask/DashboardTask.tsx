import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { useEffect,useState } from "react";
import TypeVerifierUserChecker from '../../../utils/UserScreenAuthentication';
import IndividualTab from './Individual';
import TeamTab from './Team';
import CorporateTab from './Corporate';





const DashboardTask = ():React.ReactElement=>{
    const [tabIndex,setTabIndex]=useState<number>(0);

    useEffect(()=>{
        const currentPageTab = localStorage.getItem("TaskDasboardPageTab")
       if(currentPageTab){
         setTabIndex(JSON.parse(currentPageTab))
       }
      },[]) 
    return (
        <>

      <Tabs colorScheme="primary" 
      isLazy
      
      index={tabIndex}
      onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("TaskDasboardPageTab",JSON.stringify(currentIndex))

      }}
      >
        <TabList>
{
        !TypeVerifierUserChecker(["admin","super_admin"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Individual
          </Tab>:''
}
          {TypeVerifierUserChecker(["team_lead"],"client_tokens")?
            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserGroup size="22px" />
            </Box>
            Team
          </Tab>:""
        }
        {
             TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Corporate
          </Tab>:""
        }
        </TabList>

        <TabPanels pt="3">

          {
        !TypeVerifierUserChecker(["admin","super_admin"],"client_tokens")?
<TabPanel px="0">
            <IndividualTab />
          </TabPanel>:""
          }
          
          {
            TypeVerifierUserChecker(["team_lead"],"client_tokens")?
          <TabPanel px="0">
            <TeamTab />
          </TabPanel>:""
          }

          {
             TypeVerifierUserChecker(["team_lead","admin","super_admin"],"client_tokens")?
          <TabPanel>
            <CorporateTab />
          </TabPanel>:""
          }
        </TabPanels>
      </Tabs>
        </>
    )
}
export default DashboardTask