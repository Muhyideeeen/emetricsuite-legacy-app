import React from 'react';
import {useEffect,useState} from "react"
import {
  Box,
  Image,
  ListIcon,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  Flex,
  Heading,
  MenuList,
  MenuItem,MenuButton,Menu, Button
} from '@chakra-ui/react';
import { NavLink, useHistory } from 'react-router-dom';

import {
  HiOutlineHome,
  HiOutlineChartSquareBar,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlineChatAlt2,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from 'react-icons/hi';
import {BsCalendarFill} from 'react-icons/bs'
// import { logoutUser } from '../redux/user/userSlice'
import { useAppDispatch } from '../redux/hooks';
import { RiExternalLinkLine } from "react-icons/ri";
import {SiGoogleanalytics} from 'react-icons/si'
import Logo from '../assets/images/logo.png';
import NavItem from './NavItem';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import EmetricImage from '../assets/images/logo.jpeg';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [org_info,setOrg_info] =useState<any>(null)
  const handleLogout = () => {
    window.localStorage.clear();
   history.push('/tenant-logout');
  }


  let current_organization = localStorage.getItem('current_organization')
  if(!current_organization){
    current_organization='Tomation Tech Hub'
  }

  useEffect(()=>{
  let local_org_info = localStorage.getItem("org_info")

    if(local_org_info){
      setOrg_info(JSON.parse(local_org_info))
    } 
  },[])
  return (
    <Stack spacing="8">
      <Flex direction="column" alignItems="center">
        <img src={org_info?.company_logo?org_info?.company_logo:""} style={{ width: 50 }} alt="" />
       {/* <br /> */}
        <Heading as="h1" fontSize="xl" style={{"marginTop":".5rem"}}>
        {current_organization}
        </Heading>
        {/* Using the Image component from chakra below is causing a glitch */}
        {/* try uncommenting and commenting <img /> above to see */}
        {/* <Image src={Logo} boxSize="80px" objectFit="contain" alt="e-metric suite's logo" /> */}
      </Flex>

      <Box>
        <Text as="small" ml="4" fontWeight="extrabold">
          Menu
        </Text>
        <UnorderedList
          styleType="none"
          display="flex"
          ml="0"
          flexDirection="column"
        >

          {
            //i dont want employee or team tean_lead to enter view home
            !TypeVerifierUserChecker(["employee","team_lead",],"client_tokens")?
            <NavItem to="/dashboard/home" icon={HiOutlineHome}>
            Org Structure
          </NavItem>:""
          }
         
         {
          !TypeVerifierUserChecker(['admin_hr',],"client_tokens")?

          <NavItem to="/dashboard/dashboard-page" icon={HiOutlineChartSquareBar}>
            Dashboard 
          </NavItem>:''
         }

          <ListItem bg="transparent" py="1" color="primary">

          {/* /dashboard/reports */}
          {/* <Menu>
  <MenuButton 
  // py="1"
  style={{"textAlign":"left", width:"100%",padding: '5px', display: 'block', borderRadius: 5 ,background:"transparent"}}
  as={Button} 
  // icon={<HiOutlineChartSquareBar />}
  //         to="#"
  //         target="#"
          // children={"p"}
          fontSize="medium"
          fontWeight={"medium"}
          leftIcon={<HiOutlineChartSquareBar />}
 >
    Report Deck
  </MenuButton>
  <MenuList>
    <MenuItem minH='48px'>
     
      <span
      onClick={(e)=>{history.push('/dashboard/human-performance-management')}}
      >HPM</span>
    </MenuItem>
    <MenuItem minH='40px'>
      
      <span
      onClick={(e)=>{history.push('/dashboard/corporate-report')}}
      
      >CPM</span>
    </MenuItem>
  </MenuList>
</Menu> */}


            </ListItem>  

            {
            !TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?
          <NavItem to="/admin/organization-structure/" 
          icon={RiExternalLinkLine}>
            Switch to super admin
          </NavItem>:""

          }  
          {
            !TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")?
          <NavItem to="/dashboard/strategy-deck" icon={HiOutlineCollection}>
            Strategy Deck
          </NavItem>:""

          }

      {
            TypeVerifierUserChecker(["team_lead"],"client_tokens")?
            <NavItem to="/dashboard/teamleadkpi" icon={SiGoogleanalytics}>
            KPI
          </NavItem>:""
          }

                              {
            !TypeVerifierUserChecker(["admin",'admin_hr'],"client_tokens")?

          <NavItem to="/dashboard/tasks" icon={HiOutlineClipboardList}>
            Tasks
            
          </NavItem>:""
          }

          <NavItem to="/dashboard/task-calendar" icon={BsCalendarFill}>
            Time Sheet
          </NavItem>

          {
            TypeVerifierUserChecker(["admin","super_admin"],"client_tokens")?

            <NavItem to="/dashboard/corporate-report" icon={HiOutlineChartSquareBar}>
            CPM
          </NavItem>
      
            :""
          }
      

      {
            !TypeVerifierUserChecker(["admin",'admin_hr'],"client_tokens")?
            <NavItem to="/dashboard/human-performance-management" icon={HiOutlineChartSquareBar}>
            HPM
          </NavItem>
            :""
          }


       {
            !TypeVerifierUserChecker(["admin",'admin_hr'],"client_tokens")?

            <NavItem to="/dashboard/messages" icon={HiOutlineChatAlt2}>
            Messages
          </NavItem>:""
          } 


      {
            !TypeVerifierUserChecker(["admin",'admin_hr'],"client_tokens")?

            <NavItem to="/dashboard/settings" icon={HiOutlineCog}>
            Settings
          </NavItem>:""
          } 

{
            !TypeVerifierUserChecker(["admin",'admin_hr'],"client_tokens")?

            <NavItem to="/dashboard/profile" icon={HiOutlineCog}>
            Profile
          </NavItem>:""
          } 


          <ListItem bg="transparent" py="1" color="primary">
          <Box onClick={handleLogout} cursor="pointer"  style={{ padding: '5px', display: 'block', borderRadius: 5 }}>
            <ListIcon as={HiOutlineLogout} fontSize="xl" />
            <Box as="span" fontSize="sm">
              Logout
            </Box>
          </Box>
          </ListItem>
        </UnorderedList>
      </Box>

        <br />
      <Flex direction="column" alignItems="center" justifySelf="flex-end">
        <Text
          textTransform="uppercase"
          fontSize="12px"
          letterSpacing="widest"
          mb="-9"
        >
          {/* Powered By */}
        </Text>
        <Image
          src={EmetricImage}
          boxSize="70px"
          objectFit="contain"
          alt="e-metric suite's logo"
          style={{
            'borderRadius':'10px'
            // 'width':'50px'
          }}
        />
      </Flex>
    </Stack>
  );
};

export default Sidebar;
