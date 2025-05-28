import {
    DrawerBody,
    DrawerHeader,
    Flex,
    Text,
    Image,
    Box,
    Button,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    DrawerCloseButton,
    Heading,
    Grid,
  } from "@chakra-ui/react";
  import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import { TenantDataType } from "../../redux/TenantAdminManager/TenantAdminManagerApi";


type Prop = {
    data:TenantDataType
}
const TenantManageDrawerTable = (  {data}:Prop):React.ReactElement=>{


    return (
        <DrawerBody w="85%" mx="auto">
        <Flex alignItems="baseline">
                <DrawerCloseButton
                as={HiOutlineChevronLeft}
                display="block"
                position="relative"
                />
                <Text mt={-1} ml={5} fontSize="lg">
                
                </Text>
          </Flex>
          <br />
          <br />
          
          <Box>
            <Text mb={1} fontWeight="semibold">
            Name of Account Manager (Client)
            </Text>
            <Text as="small" color="gray.500">
            {data.name_of_account_manager?data.name_of_account_manager:'NiL'}
            </Text>
          </Box>
          <br />
          <Box>
            <Text mb={1} fontWeight="semibold">
            Tel of Account Manager
            </Text>
            <Text as="small" color="gray.500">
            {data.tel_of_account_manager?data.tel_of_account_manager:'NiL'}
            </Text>
          </Box>

          <br />
          <Box>
            <Text mb={1} fontWeight="semibold">
            Email of Account Manager
            </Text>
            <Text as="small" color="gray.500">
            {data.email_of_account_manager?data.email_of_account_manager:'NiL'}
            </Text>
          </Box>

          <br />
          <Box>
            <Text mb={1} fontWeight="semibold">
            Number of Users
            </Text>
            <Text as="small" color="gray.500">
            {data.employee_limit?data.employee_limit:'NiL'}
            </Text>
          </Box>

          <br />
          <Box>
            <Text mb={1} fontWeight="semibold">
            Name of HR Admin
            </Text>
            <Text as="small" color="gray.500">
            {data.name_of_account_HRmanager?data.name_of_account_HRmanager:'NiL'}
            </Text>
          </Box>

          <Box>
            <Text mb={1} fontWeight="semibold">
            Phone Numbers of HR Admin
            </Text>
            <Text as="small" color="gray.500">
            {data.tel_of_account_HRmanager?data.tel_of_account_HRmanager:'NiL'}
            </Text>
          </Box>
          <br />
          <Box>
            <Text mb={1} fontWeight="semibold">
            Email address of HR Admin
            </Text>
            <Text as="small" color="gray.500">
            {data.email_of_account_HRmanager?data.email_of_account_HRmanager:'NiL'}
            </Text>
          </Box>
          <br />


          <Box>
            <Text mb={1} fontWeight="semibold">
            Name of Super Admin
            </Text>
            <Text as="small" color="gray.500">
            {data.owner_first_name } {data.owner_last_name}
            </Text>
          </Box>

          <Box>
            <Text mb={1} fontWeight="semibold">
            Email address of Super Admin
            </Text>
            <Text as="small" color="gray.500">
            {data.owner_email } {data.owner_email}
            </Text>
          </Box>
          <br />

        </DrawerBody>
    )
}

export default TenantManageDrawerTable