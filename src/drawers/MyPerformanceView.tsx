import {
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerCloseButton,
    Flex,
    Text,
    Tag,
    Image,
    Box,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
  } from '@chakra-ui/react';
  import { HiOutlineHome } from 'react-icons/hi';
  import perspectivesIcon from '../assets/icons/perspectivesIcon.svg';
  
  const MyPerformanceViewContent = () => {
    return (
      <>
        <DrawerHeader>
          <Flex justify="space-between">
            <Text fontWeight="bold" fontSize="lg">
              Social media platform content
            </Text>
            <DrawerCloseButton mt={3.5} />
          </Flex>
        </DrawerHeader>
  
        <DrawerBody>
          <Tabs colorScheme="primary">
            <TabList>
              <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr={5}>
                <Box as="span" mr="2">
                  <HiOutlineHome size="22px" />
                </Box>
                Basic Info
              </Tab>
              <Tab fontWeight="bold" fontSize="sm" color="gray.600">
                <Image src={perspectivesIcon} boxSize="19px" mr={2} />
                Targets
              </Tab>
            </TabList>
  
            <TabPanels>
              <TabPanel px="0">
                <BasicInfo />
              </TabPanel>
              <TabPanel px="0">
                <Targets />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
  
        <DrawerFooter />
      </>
    );
  };
  export default MyPerformanceViewContent;
  
  const BasicInfo = () => {
    return (
      <Stack mt={3} spacing={8}>
        <Flex>
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              Owner/Team
            </Text>
            <Text fontSize="smaller">damilads@mail.com</Text>
          </Box>
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              Task Assignor
            </Text>
            <Text fontSize="smaller">damilads@mail.com</Text>
          </Box>
        </Flex>
        <Box>
          <Text mb={1} fontWeight="semibold" fontSize="sm">
            Kpi
          </Text>
          <Text color="gray.700" fontSize="sm">
            Social Media Platform Content-SBU 1
          </Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Department
          </Text>
          <Text fontSize="smaller">Account</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Task Type
          </Text>
          <Tag color="primary" fontWeight="semibold" fontSize="smaller">
            Quantitative &amp; Qualitative
          </Tag>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize="sm">
            Routine Options
          </Text>
          <Text fontSize="smaller">Weekly</Text>
        </Box>
        <Flex mt={3}>
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              Duration
            </Text>
            <Text fontSize="smaller">2 weeks</Text>
          </Box>
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              Rework Options
            </Text>
            <Text fontSize="smaller">2</Text>
          </Box>
        </Flex>
      </Stack>
    );
  };
  
  const Targets = () => {
    return (
      <Box mt={3}>
        <Stack fontWeight="semibold" spacing={8}>
          <Flex justify="space-between">
            <Text fontSize="sm">Turnaround Time Score Target </Text>
            <Text fontSize="sm">2.5</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="sm">Job Quality Score Target</Text>
            <Text fontSize="sm">5.5</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="sm">Job Quantity Score Target</Text>
            <Text fontSize="sm">1</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="sm">Job Quantity Unit Target</Text>
            <Text fontSize="sm">2</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="sm">Overall Score Target</Text>
            <Text fontSize="sm">16</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontSize="sm">Contribution to Upline Kpi</Text>
            <Text fontSize="sm">6</Text>
          </Flex>
        </Stack>
      </Box>
    );
  };
  