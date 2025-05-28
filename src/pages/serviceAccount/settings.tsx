import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import AppBar from '../../components/AppBar';

import {
    GrGroup
} from 'react-icons/gr';
import UpdateOrganisation from '../../tabs/settings/ServiceAcct/UpdateOrganisation';
import { AiOutlineUserAdd } from 'react-icons/ai';
import PublicHolidayTab from '../../tabs/settings/ServiceAcct/PublicHoliday';
import HrAdminTable from '../../components/HrAdminTable';

const settings = () => {
    return (
        <div>

            <AppBar
              heading="Settings"
              avatar="/logo192.png"
              imgAlt="Jane Doe's avatar"
            />

      <Tabs colorScheme="primary" isLazy>
          <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <GrGroup size="22px" />
            </Box>
            Organization settings
          </Tab>

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <AiOutlineUserAdd size="22px" />
            </Box>
            Create Hr Admin
          </Tab>

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <AiOutlineUserAdd size="22px" />
            </Box>
            Manage Public Holiday
          </Tab>


          
          </TabList>

          <TabPanels pt="3">
        <TabPanel px="0">
               <UpdateOrganisation />
          </TabPanel>
          
          <TabPanel px="0">
           <HrAdminTable/>
          </TabPanel>

          <TabPanel px="0">
            <PublicHolidayTab/>
          </TabPanel>
          
        </TabPanels>

      </Tabs>
        </div>
    )
}

export default settings
