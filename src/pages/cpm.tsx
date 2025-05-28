import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import AppBar from '../components/AppBar';
import JDIntitiativesSpread from '../tabs/cpm/JDInitiativesSpread';
import JDIntitiatives from '../tabs/cpm/JDInititatives';
import ObjectivePerspective from '../tabs/cpm/ObjectivePerspective';
import ObjectiveAndJDInitiativeSpread from '../tabs/cpm/ObjectiveAndJDInitiative';
import Perspective from '../tabs/cpm/Perspective';

const Cpm = () => {
  return (
    <>
      <AppBar
        heading="Corporate Performance Management"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />

      <Tabs colorScheme="primary" isLazy>
        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Perspective
          </Tab>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Obj/Perspective Spread
          </Tab>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Obj/Kpi &amp; Initiative Spread Report
          </Tab>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Kpi 
          </Tab>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600">
            <Box as="span" mr="2">
              <HiOutlineUserCircle size="22px" />
            </Box>
            Kpi Spread
          </Tab>
        </TabList>

        <TabPanels pt="3">
          <TabPanel px="0">
            <Perspective />
          </TabPanel>
          <TabPanel px="0">
            <ObjectivePerspective />
          </TabPanel>
          <TabPanel px="0">
            <ObjectiveAndJDInitiativeSpread />
          </TabPanel>
          <TabPanel px="0">
            <JDIntitiatives />
          </TabPanel>
          <TabPanel px="0">
            <JDIntitiativesSpread />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Cpm;
