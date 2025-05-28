import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ComingSoon from "./ErrorPages/ComingSoon"

import EmployeeFileStructure from '../tabs/settings/EmployeeFileStructure'
import AppBar from '../components/AppBar';

import {
    GrGroup
} from 'react-icons/gr';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import LoggedInEmployeeDetails from '../tabs/settings/LoggedInEmployeeDetails';



const Settings = ()=>(
    <div>

    <AppBar
      heading="Settings"
      avatar="/logo192.png"
      imgAlt="Jane Doe's avatar"
    />

<Tabs colorScheme="primary" isLazy>
  <TabList>
      {TypeVerifierUserChecker(["super_admin","admin"])?
  <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
  <Box as="span" mr="2">
    <GrGroup size="22px" />
  </Box>
  Setting Up Employee Files Structure
</Tab>:""    
    }

{/* {
TypeVerifierUserChecker(["team_lead","employee"],"client_tokens")?

<Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
<Box as="span" mr="2">
  <GrGroup size="22px" />
</Box>
Employee Profile
</Tab>:""
} */}
  </TabList>



  <TabPanels pt="3">



      {
          TypeVerifierUserChecker(["super_admin","admin"])?
          <TabPanel px="0">
          <EmployeeFileStructure />
          </TabPanel> 
          :""
      }

     



  {/* {
    TypeVerifierUserChecker(["team_lead","employee"],"client_tokens")?
  <TabPanel>
<LoggedInEmployeeDetails /> 
  </TabPanel>

:""
      } */}

</TabPanels>

</Tabs>

</div>
)


export default Settings