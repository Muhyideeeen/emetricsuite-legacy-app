import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ComingSoon from "./ErrorPages/ComingSoon"

import EmployeeFileStructure from '../tabs/settings/EmployeeFileStructure'
import AppBar from '../components/AppBar';

import {
    GrGroup
} from 'react-icons/gr';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import LoggedInEmployeeDetails from '../tabs/settings/LoggedInEmployeeDetails';



const Profile = ()=>(
    <div>

    <AppBar
      heading=" Profile"
      avatar="/logo192.png"
      imgAlt="Jane Doe's avatar"
    />
<br />
<LoggedInEmployeeDetails /> 


</div>
)


export default Profile