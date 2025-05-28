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
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {useEffect,useState} from "react"

import {
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAppDispatch } from "../../redux/hooks";

import Logo from "../../assets/images/logo.png";
import { RiExternalLinkLine } from "react-icons/ri";
import NavItem from "../NavItem";

const ServiceAccountSidebar = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [org_info,setOrg_info] =useState<any>(null)

  const handleLogout = () => {
    window.localStorage.clear();
    history.push("/admin/login");
  };

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
      <img src={org_info?.company_logo?org_info?.company_logo:""} style={{ width: 70 }} alt="" />
        <Heading as="h1" fontSize="xl">
          {current_organization}
        </Heading>
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
          <NavItem to="/admin/organization-structure" icon={HiOutlineHome}>
            Organisation Structure
          </NavItem>
          <NavItem
            to="/dashboard/home"
            // target="_blank"
            icon={HiOutlineClipboardList}
          >
            <Flex>
              <Box as="span">Switch to Organisation</Box>
              <RiExternalLinkLine />
            </Flex>
          </NavItem>
          <NavItem to="/admin/settings" icon={HiOutlineCog}>
            Settings
          </NavItem>
          <ListItem bg="transparent" py="1" color="primary">
            <Box
              onClick={handleLogout}
              cursor="pointer"
              style={{ padding: "5px", display: "block", borderRadius: 5 }}
            >
              <ListIcon as={HiOutlineLogout} fontSize="xl" />
              <Box as="span" fontSize="sm">
                Logout
              </Box>
            </Box>
          </ListItem>
        </UnorderedList>
      </Box>

      <Flex
        direction="column"
        alignItems="center"
        mt="auto"
        justifySelf="flex-end"
      >
        <Text
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="widest"
          mb="-10"
        >
          Powered By
        </Text>
        <Image
          src={Logo}
          boxSize="120px"
          objectFit="contain"
          alt="e-metric suite's logo"
        />
      </Flex>
    </Stack>
  );
};

export default ServiceAccountSidebar;
