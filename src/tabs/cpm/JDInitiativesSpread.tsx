import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Stack, TableCaption } from '@chakra-ui/react';
import CustomDrawer from '../../drawers/CustomDrawer';
import MyPerformanceViewContent from '../../drawers/MyPerformanceView';

const JDIntitiativesSpread = () => {
  return (
    <Box as="section">

      <Table size="sm" variant="striped" borderRadius="lg" d="block" overflowX="auto">
        <TableCaption placement="top" fontSize="md">Task to Kpi Achievement report contribution achievement</TableCaption>
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th px="3">
            Name
            </Th>
            <Th px="3">
              Task 1 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 2 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 3 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 4 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 5 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 6 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Task 7 Cont. PTS Achieved
            </Th>
            <Th px="3">
              Total Target Points
            </Th>
            <Th px="3">
              Cum. Cont. PTS Achieved
            </Th>
            <Th px="3">Ratings (%)</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...new Array(3)].map((item, index) => (
            <Tr key={index} style={{"textTransform":"capitalize"}}>
              <Td px="3">Become a Top of the mind brand</Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Manage SM Post</Text>
                 <Text as="small">3</Text>
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
                 <Text fontSize="smaller" display="block" color="blue.500">Create Design for SM</Text>
                 <Text as="small">2</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Manage SM Post</Text>
                 <Text as="small">3</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Manage SM Post</Text>
                 <Text as="small">3</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Manage SM Post</Text>
                 <Text as="small">3</Text>
               </Stack>
              </Td>
              <Td px="3">
               <Stack textAlign="center">
                 <Text fontSize="smaller" display="block" color="blue.500">Manage SM Post</Text>
                 <Text as="small">3</Text>
               </Stack>
              </Td>
              
              <Td px="3" textAlign="center">
                12
              </Td>
              <Td px="3" textAlign="center">
                24
              </Td>
              <Td px="3" textAlign="center">
                60
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

export default JDIntitiativesSpread;
