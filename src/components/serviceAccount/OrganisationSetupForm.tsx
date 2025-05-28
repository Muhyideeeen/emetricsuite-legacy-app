import {
  Box,
  Flex,
  Grid,
  Text,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import checkmark from "../../assets/icons/checkmark.svg";

import Division from "./form/Division";
import Group from "./form/Group";
import Department from "./form/Department";
import Unit from "./form/Unit";

const OrganisationSetupForm = ({ orgLevel }: { orgLevel: number }) => {
  const [, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const steps = [
    { id: 1, level: 4, title: "Divisions", form: <Division /> },
    { id: 2, level: 3, title: "Groups", form: <Group /> },
    { id: 3, level: 2, title: "Departments", form: <Department /> },
    { id: 4, level: 1, title: "Units", form: <Unit /> },
  ];

  return (
    <Box m={5}>
      <Tabs isFitted variant="unstyled" w="100%">
        <TabList mx={10} flexWrap="nowrap">
          {steps.map((step, index) => {
            if (orgLevel > step.level) {
              return (
                <Tab
                  key={step.id}
                  // index={step.id}
                  onChange={() => handleTabsChange(step.id)}
                  _focus={{
                    outline: "none",
                  }}
                  mx={1}
                >
                  <Box ml={30} w="100%">
                    <Box w="100%" h={1} bg="primary" my={2}></Box>
                    <Flex justify="space-between">
                      <Text as="h1" fontWeight="bold">
                        {step.title}
                      </Text>
                      <Image src={checkmark} />
                    </Flex>
                  </Box>
                </Tab>
              );
            }
          })}
        </TabList>
        <TabPanels>
          {steps.map((step) => {
            if (orgLevel > step.level) {
              return <TabPanel key={step.id}>{step.form}</TabPanel>;
            }
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
export default OrganisationSetupForm;
