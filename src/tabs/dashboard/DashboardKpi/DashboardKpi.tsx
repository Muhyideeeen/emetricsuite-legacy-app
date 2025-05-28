import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { useEffect,useLayoutEffect,useState } from "react";
import KpiDashboardUi from '../../../components/KpiDashboardUi';
import { setTimeFilter } from '../../../services/extraFunctions';
import TypeVerifierUserChecker from '../../../utils/UserScreenAuthentication';

const DashboardKpi = ():React.ReactElement=>{
    const [kpiCount,setKpiCount] =useState<{pending:number;active:number;closed:number}>({pending:0,active:0,closed:0})


    return(
        <>
        <Tabs colorScheme="primary" 
      isLazy>

        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Individual
          </Tab>
        {
          TypeVerifierUserChecker(["team_lead"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Team
          </Tab>:''
        }


          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Corporate
          </Tab>

        </TabList>

        <TabPanels pt="3">
            <TabPanel px="0">
                <KpiDashboardUi dashboardType='individual' />
            </TabPanel>

            {
                TypeVerifierUserChecker(["team_lead"],"client_tokens")?

                <TabPanel px="0">
                    <KpiDashboardUi dashboardType='team' />

                </TabPanel>:''
              }


            <TabPanel px="0">
            <KpiDashboardUi dashboardType='corporate' />

            </TabPanel>
        </TabPanels>
      </Tabs>
        </>
    )
}

export default DashboardKpi