import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import AppBar from '../components/AppBar';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import { useEffect,useState } from "react";
import { BsBarChartFill } from 'react-icons/bs';
import DashboardTask from '../tabs/dashboard/DashboardTask/DashboardTask';
import DashboardKpi from '../tabs/dashboard/DashboardKpi/DashboardKpi';
import LeaveApplication from '../tabs/dashboard/LeaveApplication';


/*
tabs of monthly ,daily ,weekly
but not are affected by this
so we save a var that holds the calculated date of the tab

function that get all performance using the tab calulated date,
function that get pending and closed task using the calulated date
function that get any task apart for pending and close which is not controlled by date
*/
const Dashboard = () => {
  const [tabIndex,setTabIndex]=useState<number>(0);


  useEffect(()=>{
    const currentPageTab = localStorage.getItem("DasboardPageTab")
   if(currentPageTab){
     setTabIndex(JSON.parse(currentPageTab))
   }
  },[]) 
  return (
    <>
    <AppBar
    heading="Dashboard"
    avatar="/logo192.png"
    imgAlt="Jane Doe's avatar"
    />
     <Tabs colorScheme="primary" 
      isLazy
        index={tabIndex}
        onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("DasboardPageTab",JSON.stringify(currentIndex))

        }}
      >
        <TabList>
            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
              <Box as="span" mr="2">
                <HiOutlineUserCircle size="22px" />
              </Box>
            Task
            </Tab>


            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
              <Box as="span" mr="2">
                <BsBarChartFill size="22px" />
              </Box>
            KPI
            </Tab>

            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
              <Box as="span" mr="2">
                <BsBarChartFill size="22px" />
              </Box>
            Leave Application
            </Tab>

        </TabList>

        <TabPanels pt="3">
          <TabPanel px="0">
            <DashboardTask />
          </TabPanel>

          <TabPanel px="0">
            <DashboardKpi/>
          </TabPanel>


          <TabPanel px="0">
            <LeaveApplication/>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </>
  );
};

export default Dashboard;
