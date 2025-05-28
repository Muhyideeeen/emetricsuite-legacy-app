import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from '../../components/AppBar';
import TeamTask from '../../tabs/tasks/TeamTask';
import MyTask from '../../tabs/tasks/MyTask';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
import UserPerformance from '../../tabs/reports/userPerformance';
import StructurePerformance from '../../tabs/reports/StructurePerformance';
import InitiativeReport from '../../tabs/reports/InitiativeReport';
import ObjectivesReport from '../../tabs/reports/Objectives';

import {useState,useEffect} from "react";



const CorporatePerformance = ()=>{

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
        heading="Corporate Performance Management"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />
        


        <Tabs 
      colorScheme="primary" isLazy
    //   defaultIndex={1}
    //   colorScheme='blue'
    index={tabIndex}
    onChange={(currentIndex)=>{
      setTabIndex(currentIndex);
      localStorage.setItem("CPMPageTab",JSON.stringify(currentIndex))

    }}
      >
        <TabList>

 
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                Strategic Objective Report 
          </Tab>
 
        <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                KPI Report
          </Tab>

        
        </TabList>



        <TabPanels pt="8">
            <TabPanel>
              {/* <ObjectiveReport /> */}
                <ObjectivesReport/>
            </TabPanel>

            <TabPanel>
              
                <InitiativeReport />
            </TabPanel>



           
        </TabPanels>



      </Tabs>





        </>
    )
}

export default CorporatePerformance;