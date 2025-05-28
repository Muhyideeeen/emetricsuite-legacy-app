import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from '../components/AppBar';
import TeamTask from '../tabs/tasks/TeamTask';
import MyTask from '../tabs/tasks/MyTask';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import {useState,useEffect} from "react";
import AdmiViewTeamTask from '../tabs/tasks/AdmiViewTeamTask';
import AdminViewEmployeeTask from '../tabs/tasks/AdminViewEmployeeTask';


const Tasks = () => {

  const [tabIndex,setTabIndex]=useState<number>(0);



  useEffect(()=>{
    const currentPageTab = localStorage.getItem("TaskPageTab")
   if(currentPageTab){
     setTabIndex(JSON.parse(currentPageTab))
   }
  },[]) 
  return (
    <>
      <AppBar
        heading="Tasks Deck"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />

      <Tabs colorScheme="primary" isLazy
      index={tabIndex}
      onChange={(currentIndex)=>{
        setTabIndex(currentIndex);
        localStorage.setItem("TaskPageTab",JSON.stringify(currentIndex))

      }}
      >
        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            {
              TypeVerifierUserChecker(["admin","super_admin",'admin_hr'])?
              "Organisation Tasks":"My Task"
            }
            
          </Tab>
          {/* dont want employee,admin,super_admin to see my team task */}
          {
            !TypeVerifierUserChecker(["employee","admin","super_admin"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Team Task
          </Tab>:""
          }


{
            TypeVerifierUserChecker(["admin_hr","admin","super_admin"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Employee Task (Admin View)
          </Tab>:""
          }


{
            TypeVerifierUserChecker(["admin_hr","admin","super_admin"],"client_tokens")?
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Team Task (Admin View)
          </Tab>:""
          }
        </TabList>

        <TabPanels pt="8">
        
          <TabPanel p="0">
            <MyTask />
          </TabPanel>:''
        
          {
            !TypeVerifierUserChecker(["employee","admin","super_admin"],"client_tokens")?
          <TabPanel p="0">
            <TeamTask />
          </TabPanel>:''

          }

{
                        TypeVerifierUserChecker(["admin","super_admin",'admin_hr'],"client_tokens")?

                      <TabPanel p='0'>
                       <AdminViewEmployeeTask/>
                      </TabPanel>:''
            }


            {
                        TypeVerifierUserChecker(["admin","super_admin",'admin_hr'],"client_tokens")?

                      <TabPanel p='0'>
                        <AdmiViewTeamTask/>
                      </TabPanel>:''
            }


        </TabPanels>
      </Tabs>
    </>
  );
};

export default Tasks;
