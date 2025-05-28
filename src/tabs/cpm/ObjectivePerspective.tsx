import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import CustomDrawer from '../../drawers/CustomDrawer';
import MyPerformanceViewContent from '../../drawers/MyPerformanceView';

const ObjectivePerspective = () => {
  return (
    <Box as="section">
      <Table size="sm" variant="striped" borderRadius="lg" d="block" overflowX="auto">
        <Thead  bg="gray.100" style={{"textTransform":"capitalize"}}>
          <Tr style={{"textTransform":"capitalize"}}>
            <Th px="3">
              Perspective Name
            </Th>
            <Th px="3">
              End Time
            </Th>
            <Th px="3">
             Financial Point Achieved
            </Th>
            <Th px="3">
            Customers Point Achieved
            </Th>
            <Th px="3">
              Internal Process Points Achieved
            </Th>
            <Th px="3">
              Learning and Growth Points Achieved
            </Th>
            <Th px="3">
              Cummulative Points Achieved
            </Th>
            <Th px="3">
              Ratings (%)
            </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...new Array(3)].map((item, index) => (
            <Tr key={index} style={{"textTransform":"capitalize"}}>
              <Td textAlign="center">Increase market share by 50%</Td>
              <Td textAlign="center">
                12/31/2020
              </Td>
              <Td textAlign="center">
                7
              </Td>
              <Td textAlign="center">
                1
              </Td>
              <Td textAlign="center">
                1
              </Td>
              <Td textAlign="center">
                1
              </Td>
              <Td textAlign="center">
                10
              </Td>
              <Td textAlign="center">
                45
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

export default ObjectivePerspective;
