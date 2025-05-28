import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import {  useParams } from "react-router-dom";
import AppBar from '../components/AppBar';
import SubmitMyTaskTable from '../tabs/submitTask/SubmitMyTask';

const SubmitTask = () => {

  return (
    <>
      <AppBar
        heading="Submit Task"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />
      <Tabs colorScheme="primary" isLazy>
        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
           Submit My Task
          </Tab>
        </TabList>

        <TabPanels pt="3">
          <TabPanel px="0">
            <SubmitMyTaskTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SubmitTask;
