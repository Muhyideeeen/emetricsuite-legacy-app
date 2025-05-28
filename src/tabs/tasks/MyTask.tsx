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
    TabPanels,
    Button
  } from '@chakra-ui/react';
  import CustomDrawer from '../../drawers/CustomDrawer';
  import CardList from '../../components/CardList';
  import { HiDotsHorizontal, HiOutlinePlus } from 'react-icons/hi';
  import { Link as ReactRouterLink } from 'react-router-dom';
  import AddTask from '../../drawers/AddTask';
  import UploadTask from '../../drawers/UploadTask';
import CreateTaskModal from '../../modal/task/create-task';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
  import TaskListTable from './TaskComponent/TaskListTable';
import { getLoggedin_userEmail } from '../../services/auth.service';
import { useState,useEffect } from 'react';
import { BsFillTrash2Fill } from 'react-icons/bs';
  const cardDetails = [
   
    
  ];
  
  const MyTask = () => {
    const [owner_email,setOwner_email]=useState<string|boolean>(false)
    

    useEffect(()=>{
      setOwner_email(getLoggedin_userEmail())
      
    },[])
    return (
      <Box>
      
        <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text as="small" display="inline-block" fontWeight="semibold" mb="2">
          {/* Showing 10 of 40 My Tasks */}
        </Text>
  {
//here employees are not meant to views the add or upload task Button
TypeVerifierUserChecker(["employee"],"client_tokens")?
"":
<Stack direction="row" spacing={4}>
            {/* <CustomDrawer
              showModalBtnText="Add Task"
              showModalBtnVariant="primary"
              showModalBtnColor="white"
              leftIcon={<HiOutlinePlus />}
              drawerSize="sm"
            >
              <AddTask />
            </CustomDrawer> */} 
          
            <CreateTaskModal />

            <CustomDrawer
              showModalBtnText="Upload Task"
              showModalBtnVariant="outline"
              showModalBtnColor="primary"
              leftIcon={<HiOutlinePlus />}
              drawerSize="sm"
            >
              <UploadTask />
            </CustomDrawer>

            {/* <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete All
      </Button> */}
      <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete Selected
      </Button>
          </Stack>
  }
        
        </Flex>
  

  


      {/* this component holds all the varitions of task status in a table */}
       
      {owner_email?
      //so here we just passin the logged in user as the email so we can fecth his task but Note
      //NOTE if u are a admin or super admin u will be getting every one task
      <TaskListTable owner_email={owner_email} />:"Loading.."
    }




      </Box>
    );
  };
  
  export default MyTask;
  