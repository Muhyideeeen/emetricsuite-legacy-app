import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import CustomDrawer from '../../drawers/CustomDrawer';
import MyPerformanceViewContent from '../../drawers/MyPerformanceView';

const JDIntitiatives = () => {
  return (
    <Box as="section">
      <Table variant="striped" borderRadius="lg" d="block" overflowX="auto">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th fontWeight="bold" px="3">
            Kpi/Intitiative Name
            </Th>
            <Th fontWeight="bold" px="3">
              TAT PPT. Achieved
            </Th>
            <Th fontWeight="bold" px="3">
              Qly Target Brief
            </Th>
            <Th fontWeight="bold" px="3">
              Qly Point Achieved
            </Th>
            <Th fontWeight="bold" px="3">
              Qty Unit Achieved
            </Th>
            <Th fontWeight="bold" px="3">
            Qty Point Achieved
            </Th>
            <Th fontWeight="bold" px="3">
              Total Points Achieved
            </Th>
            <Th fontWeight="bold" px="3">Ratings (%)</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...new Array(3)].map((item, index) => (
            <Tr key={index} style={{"textTransform":"capitalize"}}>
              <Td fontSize="sm" px="3"><Text fontSize="sm" mb="2">
                    Graphics Design Report - SBU 1
                  </Text></Td>
              <Td fontSize="sm" px="3">
               25
              </Td>
              <Td fontSize="sm" px="3">
                1
              </Td>
              <Td fontSize="sm" px="3">
                1
              </Td>
              <Td fontSize="sm" px="3">
                1.00
              </Td>
              <Td fontSize="sm" px="3">
                2
              </Td>
              <Td fontSize="sm" px="3">
                1
              </Td>
              <Td fontSize="sm" px="3">
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

export default JDIntitiatives;
