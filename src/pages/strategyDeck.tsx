import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineBriefcase } from 'react-icons/hi';
import AppBar from '../components/AppBar';
import PerspectivesTab from '../tabs/strategyDeck/Perspectives';
import JobDescriptionTab from "../tabs/strategyDeck/JobDescription";
import ObjectivesTab from '../tabs/strategyDeck/Objectives';
import ObjectivePerspectiveTab from '../tabs/strategyDeck/ObjectivePerspective';
import ObjectiveAndJDInitiativeTab from '../tabs/strategyDeck/ObjectiveAndJDInitiative';
import JDAndInitiavesTab from '../tabs/strategyDeck/JDAndInitiative';
import JDTaskSpread from '../tabs/strategyDeck/JDTaskSpread';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import { useHistory ,} from "react-router-dom";
import {useState,useEffect} from "react";
import StrategyKpiTab from '../tabs/strategyDeck/StrategyKpiTab';

const StrategyDeck = () => {
  const history =useHistory()
  const [tabIndex,setTabIndex]=useState<number>(0);

  if(!TypeVerifierUserChecker(['admin',"super_admin",'admin_hr'],"client_tokens")){
    //take the person to a info page
    history.push('/unauthpage')
  }

  useEffect(()=>{
    const currentPageTab = localStorage.getItem("StrategyDeckPageTab")
   if(currentPageTab){
     setTabIndex(JSON.parse(currentPageTab))
   }
  },[]) 

  return (
    <>
      <AppBar
        heading="Strategy Deck"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />
      <Tabs colorScheme="primary" 
      isLazy
      index={tabIndex}
      onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("StrategyDeckPageTab",JSON.stringify(currentIndex))

      }}
      >
        <TabList>
          {
            !TypeVerifierUserChecker(['admin_hr'])?
              <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
                <Box as="span" mr="2">
                  <HiOutlineBriefcase size="22px" />
                </Box>
                Perspectives
              </Tab>

            :
            ''
          }

{
            !TypeVerifierUserChecker(['admin_hr'])?
            <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Objectives
          </Tab>

            :
            ''
          }
         
         {
            !TypeVerifierUserChecker(['admin_hr'])?
            <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Objective/Perspective Spread
          </Tab>
            :
            ''
          }

          
          

          <Tab fontSize="sm" fontWeight="bold" color="gray.600">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            KPI
          </Tab>
          {/* <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Job Description
          </Tab> */}


{
            !TypeVerifierUserChecker(['admin_hr'])?
            <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Objective &amp; KPI Spread
          </Tab>
            :
            ''
          }
          
          <Tab fontSize="sm" fontWeight="bold" color="gray.600">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            KPI Task Spread
          </Tab>
        </TabList>

        <TabPanels pt="3">
          {
            !TypeVerifierUserChecker(['admin_hr'])?

          <TabPanel px="0">
            <PerspectivesTab />
          </TabPanel>:''
          }
          {
          !TypeVerifierUserChecker(['admin_hr'])?

          <TabPanel px="0">
          <ObjectivesTab />
          </TabPanel>:''
          }


          {
          !TypeVerifierUserChecker(['admin_hr'])?
          <TabPanel px="0">
            <ObjectivePerspectiveTab />
          </TabPanel>:''
          }



          <TabPanel px="0">
            {/* <JDAndInitiavesTab /> */}
            <StrategyKpiTab/>
          </TabPanel>


          {
          !TypeVerifierUserChecker(['admin_hr'])?
          <TabPanel px="0">
            <ObjectiveAndJDInitiativeTab />
          </TabPanel>:''

          }


          <TabPanel px="0">
            <JDTaskSpread />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default StrategyDeck;
