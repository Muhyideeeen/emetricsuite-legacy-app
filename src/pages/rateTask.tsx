
import {
    Box,
    Grid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
    Text,
    Button,
    HStack,
    IconButton,
    MenuButton,
    MenuItem,
    MenuList,
    Menu,
  } from '@chakra-ui/react';
  import AppBar from '../components/AppBar';
  import CardList from '../components/CardList';
  import { HiOutlineChevronDown } from 'react-icons/hi';
  import AddRemarkModal from '../components/AddRemarkModal';
  import RateModal from '../components/RateModal';
  
  const cardDetails = [
    {
      title: 'All Team Cont. performance',
      value: 10,
      rate: 4,
      width:"80%"
    },
    {
      title: 'UI/UX TAT performance',
      value: 15,
      rate: -12,
      width:"80%"
    },
    {
      title: 'UI/UX Job Qty performance',
      value: 15,
      rate: -12,
      width:"80%"
    },
    {
      title: 'UI/UX Job Qly performance',
      value: 15,
      rate: -12,
      width:"80%"
    },
  ];
  
  const rateTask = () => {
    return (
        <>
          <AppBar
            heading="Rate Task"
            avatar="/logo192.png"
            imgAlt="Jane Doe's avatar"
          />
          <Grid gap="4" mb="6" templateColumns="repeat(4, 1fr)">
            <CardList cardDetails={cardDetails} />
          </Grid>
  
          <Box as="section">
            <Table variant="striped" borderRadius="lg" d="block" overflowX="auto">
              <Thead bg="gray.200">
                <Tr style={{"textTransform":"capitalize"}}>
                  <Th px="3">
                    Task Name
                  </Th>
                  <Th px="3">
                    Task Type
                  </Th>
                  <Th px="3">
                    Download &amp; Review Rep.
                  </Th>
                  <Th px="3">
                    Rework Limits
                  </Th>
                  <Th px="3">
                    Request Rework
                  </Th>
                  <Th px="3">
                    Rework Remark
                  </Th>
                  <Th px="3">
                    Task Qty Achieved
                  </Th>
                  <Th px="3">
                    Rating Time Track
                  </Th>
                  <Th px="3">
                    Submit for Rework
                  </Th>
                  <Th px="3">
                    Rate &amp; Save
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {[...new Array(3)].map((item, index) => (
                  <Tr key={index} style={{"textTransform":"capitalize"}}>
                    <Td py="2" px="3">
                      <Text fontSize="sm" mb="2">
                        Social Media Platform Content - SBU 1
                      </Text>
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      <Tag size="sm" fontWeight="semibold" color="primary">
                        Qualitative &amp; Quantitative
                      </Tag>
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      Download Report
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      1
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      <HStack>
                        <Text>Rework Options</Text>
                        <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<HiOutlineChevronDown />}
                          // @ts-ignore
                          variant="ghost"
                          boxSize="10"
                        />
                        <MenuList>
                          <MenuItem>Request</MenuItem>
                          <MenuItem>Don't Request</MenuItem>
                        </MenuList>
                      </Menu>
                      </HStack>
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      <AddRemarkModal />
                    </Td>
                    <Td py="2" fontSize="sm">
                      9,740.00
                    </Td>
                    <Td py="2" fontSize="sm">
                      (time)
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                      <Button size="sm" variant="outline" color="primary">
                        Submit
                      </Button>
                    </Td>
                    <Td py="2" fontSize="sm" px="3">
                     <RateModal />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
      </>
    );
  };
  
  export default rateTask;
  