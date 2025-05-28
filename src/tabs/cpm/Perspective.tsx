import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
  } from '@chakra-ui/react';
  import CustomDrawer from '../../drawers/CustomDrawer';
  import MyPerformanceViewContent from '../../drawers/MyPerformanceView';
  
  const Perspective = () => {
    return (
      <Box as="section">
          <Table variant="striped" borderRadius="lg" d="block" overflowX="auto">
            <Thead bg="gray.100">
              <Tr style={{"textTransform":"capitalize"}}>
                <Th fontWeight="bold" px="3">
                  Perspective Name
                </Th>
                <Th fontWeight="bold" px="3">
                Perspective Type
                </Th>
                <Th fontWeight="bold" px="3">
                  Duration
                </Th>
                <Th fontWeight="bold" px="3">
                  Start Time
                </Th>
                <Th fontWeight="bold" px="3">
                  End Time
                </Th>
                <Th fontWeight="bold" px="3">
                  Target Points
                </Th>
                <Th fontWeight="bold" px="3">
                  Target Achieved
                </Th>
                <Th fontWeight="bold" px="3">
                  Achievements (%)
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...new Array(3)].map((item, index) => (
                <Tr key={index} style={{"textTransform":"capitalize"}}>
                  <Td fontSize="sm" px="3">
                    Internal Process Management
                  </Td>
                  <Td fontSize="sm" px="3">
                    <Tag  size="sm" color="primary" fontWeight="semibold">Quantitative</Tag>
                  </Td>
                  <Td fontSize="sm" px="3">
                    1 week
                  </Td>
                  <Td fontSize="sm" px="3">
                    10/20/2020
                  </Td>
                  <Td fontSize="sm" px="3">
                    12/31/2020
                  </Td>
                  <Td fontSize="sm" px="3">
                    1
                  </Td>
                  <Td fontSize="sm" px="3">
                    1
                  </Td>
                  <Td fontSize="sm" px="3">
                    10
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
    )
  }
  
  export default Perspective
  