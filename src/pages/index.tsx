import {
  Box,
  Heading,
  Image,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { useEffect,useState } from "react";
import AppBar from "../components/AppBar";
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from "react-icons/hi";
import EmployeesTab from "../tabs/home/Employees";
import CareerPathTab from "../tabs/home/CareerPath";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Designation from "../tabs/home/Designation";
import OrgStructure from "../tabs/home/OrgStructure";
import TypeVerifierUserChecker from "../utils/UserScreenAuthentication";
import { useHistory, useLocation } from "react-router-dom";
import { number } from "yup/lib/locale";
import HrLeaveManagement from "../tabs/home/HrLeaveManagement";
import LeaveApplication from "../tabs/dashboard/LeaveApplication";
import PayrollTab from "../tabs/home/payroll/Payroll";
//   import { selectUser } from '../redux/user/userSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const orgName = localStorage.getItem("current_organization")
  const history =useHistory();
  const [tabIndex,setTabIndex]=useState<number>(0);
  if(!TypeVerifierUserChecker(['admin',"super_admin",'admin_hr'],"client_tokens")){
      //take the person to a info page
      history.push('/unauthpage')
    }

   useEffect(()=>{
     const currentPageTab = localStorage.getItem("indexPageTab")
    if(currentPageTab){
      setTabIndex(JSON.parse(currentPageTab))
    }
   },[]) 
  return (
    <>
      <AppBar heading="Home" avatar="/logo192.png" imgAlt="Jane Doe's avatar" />
      <HStack mb="5">
        {" "}
        <></>
        {/* <Image src="/logo192.png" boxSize="35px" /> */}
        <Heading as="h1" fontSize="2xl" textTransform="capitalize">
         {orgName?orgName:""}
        </Heading>
      </HStack>

      <Tabs colorScheme="primary" 
      isLazy
      index={tabIndex}
      onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("indexPageTab",JSON.stringify(currentIndex))

      }}
      >
        <TabList>
          {
            !TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
                        
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineViewGrid size="22px" />
            </Box>
            Organisation Structure
          </Tab>:''
          }
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineViewGrid size="22px" />
            </Box>
            Designation
          </Tab>

          <Tab fontSize="sm" fontWeight="bold" color="gray.600">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Career Path/Grade Levels
          </Tab>

          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserGroup size="22px" />
            </Box>
            Employees
          </Tab>

{/* {
        TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserGroup size="22px" />
            </Box>
            Leave Management
          </Tab>:''
} */}

{
        TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserGroup size="22px" />
            </Box>
           Leave Applications management
          </Tab>:''
}
        <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserGroup size="22px" />
            </Box>
           Payroll
          </Tab>
        </TabList>

        <TabPanels pt="3">
          {
            !TypeVerifierUserChecker(['admin_hr'],'client_tokens')?

          <TabPanel px="0">
            <OrgStructure />
          </TabPanel>:''
          }
          <TabPanel px="0">
            <Designation />
          </TabPanel>
          <TabPanel px="0">
            <CareerPathTab />
          </TabPanel>
          <TabPanel px="0">
            <EmployeesTab />
          </TabPanel>

          {/* {
         TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
            <TabPanel px="0">
              <HrLeaveManagement/>
            </TabPanel>
          :''
          } */}

{
         TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
            <TabPanel px="0">
              <LeaveApplication/>
            </TabPanel>
          :''

          }
         

         <TabPanel px="0">
            <PayrollTab/>
            </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Home;
