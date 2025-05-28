
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from '../components/AppBar';

import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';



const ReportDeck = ()=>{


    return (
        <>

<AppBar
        heading="Tasks Deck"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />

      <Tabs colorScheme="primary" isLazy>
        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            My Report
          </Tab>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Team Report
          </Tab>

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Initiative Report
          </Tab>

          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Objective Report
          </Tab>

        </TabList>

        <TabPanels pt="8">
          <TabPanel p="0">
          Hell orrld1
          </TabPanel>
          <TabPanel p="0">
            Hell orrld2
          </TabPanel>

          <TabPanel p="0">
            Hell orrld3
          </TabPanel>

          <TabPanel p="0">
            Hell orrld4
          </TabPanel>
        </TabPanels>
      </Tabs>

        </>
    )
}


export default ReportDeck