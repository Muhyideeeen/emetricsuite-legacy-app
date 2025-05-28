import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
    Box,
    Text,
    Grid,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    IconButton,
    Stack,
    Flex,Tabs,TabList,Tab,TabPanel,
    TabPanels,useDisclosure,Button,useToast, Checkbox
  } from '@chakra-ui/react';
import { HiOutlineBriefcase, HiOutlinePlus } from 'react-icons/hi';
import CustomModal from '../../../components/CustomModal';
import DailyGenerateTable from '../../../components/hrGenereatedPayRollTables/DailyGenerateTable';
import HourlyGenerateTable from '../../../components/hrGenereatedPayRollTables/HourlyGenerateTable';
import MonthlyGenerateTable from '../../../components/hrGenereatedPayRollTables/MonthlyGenerateTable';
import CreateGeneratedPayRollDrawer from '../../../drawers/CreateGeneratedPayRollDrawer';
import CreateMonthlyPayRollDrawer from '../../../drawers/CreateMonthlyPayRollDrawer';
import CustomDrawer from '../../../drawers/CustomDrawer';
import UploadPayroll from '../../../drawers/UploadPayroll';
import MonthlyStructure from './monthlyStructure';



const PayrollTab =():React.ReactElement=>{



    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text
            as="small"
            display="inline-block"
            fontWeight="semibold"
            alignSelf="flex-end"
          >
           {"  "}
          </Text>
  
          <Stack direction="row" spacing={4} alignItems={'center'}>
            {/* <CustomDrawer
              showModalBtnText="Create Monthly Structure"
              showModalBtnVariant="primary"
              showModalBtnColor="white"
              leftIcon={<HiOutlinePlus/>}
              drawerSize="sm">
                  <CreateMonthlyPayRollDrawer/>
            </CustomDrawer> */}
            <CustomModal
            openBtnText={'Create  Structure'}
            headingText={'Create  Structure'}
            subHeadText={'Create Payroll Template'}
            >
                  <CreateMonthlyPayRollDrawer/>
            </CustomModal>
              
            <CustomDrawer
      showModalBtnText="Upload Payroll"
      showModalBtnVariant="outline"
      showModalBtnColor="primary"
      leftIcon={<HiOutlinePlus />}
      drawerSize="sm"
    >
      <UploadPayroll />
    </CustomDrawer>

            <CustomDrawer
              showModalBtnText="Generate payroll"
              showModalBtnVariant="outline"
              // showModalBtnColor="white"
              showModalBtnColor="primary"
              leftIcon={<HiOutlinePlus />}
              drawerSize="sm"
            >
             <CreateGeneratedPayRollDrawer/> 
            </CustomDrawer>
          </Stack>
        </Flex>


        <Tabs colorScheme="primary" 
    isLazy>

        <TabList>
        <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Payroll Structure
          </Tab>

          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
        Monthly Generated Table
          </Tab>

          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
        Daily Generated Table
          </Tab>

          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
        Hourly Generated Table
          </Tab>

        </TabList>

        <TabPanels pt="3">
        <TabPanel px="0">
            <MonthlyStructure/>
        </TabPanel>

        <TabPanel px="0">
            <MonthlyGenerateTable/>
        </TabPanel>

        <TabPanel px="0">
            <DailyGenerateTable/>
        </TabPanel>

        <TabPanel px="0">
            <HourlyGenerateTable/>
        </TabPanel>
        </TabPanels>
    </Tabs>
        </Box>
    )
}

export default PayrollTab