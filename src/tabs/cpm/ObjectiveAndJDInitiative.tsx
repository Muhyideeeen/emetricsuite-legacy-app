import { Box, Table, Thead, Tbody, Tr, Th, Td, Stack, Text } from '@chakra-ui/react';
import CustomDrawer from '../../drawers/CustomDrawer';
import MyPerformanceViewContent from '../../drawers/MyPerformanceView';

const ObjectiveAndJDInitiativeSpread = () => {
  return (
    <Box as="section">
      <Table size="sm" variant="striped" borderRadius="lg" d="block" overflowX="auto">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th px="3" textAlign="center">
              Name
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 1 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 2 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 3 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 4 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 5 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 6 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            kpi &amp; Initiative 7 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
            Kpi &amp; Initiative 8 Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">
              Cum. Cont. PTS Achieved
            </Th>
            <Th px="3" textAlign="center">Ratings (%)</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...new Array(3)].map((item, index) => (
            <Tr key={index} style={{"textTransform":"capitalize"}}>
              <Td fontSize="sm" px="3">Increase market share by 50%</Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Generate Content for SMt</Text>
                 <Text as="small">5</Text>
               </Stack>
              </Td>
              <Td px="3" textAlign="center">
               80
              </Td>
              <Td px="3" textAlign="center">
                40
              </Td>
              <Td>
                <CustomDrawer
                  showModalBtnText="View"
                  showModalBtnColor="primary"
                >
                  <MyPerformanceViewContent />
                </CustomDrawer>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ObjectiveAndJDInitiativeSpread;
