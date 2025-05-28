import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, OrderedList, ListItem,Button, Flex, Stack, Checkbox } from "@chakra-ui/react";
import AppBar from "../../components/AppBar";
import CustomDrawer from "../../drawers/CustomDrawer";
import { selectDivision } from "../../redux/division/divisionSlice";
import { useAppSelector ,useAppDispatch} from "../../redux/hooks";
import { useErrorHandler } from "react-error-boundary";
import {deleteDivision,updateDivision,getDivisions} from "../../redux/division/divisionAPI";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import UpdateDivision from "../../drawers/UpdateDivisions";
import { useEffect ,useState} from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Preloader from "../../components/Preloader";
import { BsFillTrash2Fill } from "react-icons/bs";
import  PaginatedItems from  '../../components/Pagination/Pagination'
const Divisions = () => {
  const [pageNum,setPageNum] = useState(1);
  const { divisions,status,
    count:NumOfData,num_of_pages
  } = useAppSelector(selectDivision);
  // consol
  const handleError =useErrorHandler()
  const org_name = localStorage.getItem("current_organization_short_name");
  const [currentlyDeletedDivision,setCurrentlyDeletedDivision] = useState('')
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(getDivisions({'ORG_NAME':org_name,handleError,'pagenum':1}))
  },[])


  const handleDelete = (uuid:string)=>{
    if(!org_name) return 
    setCurrentlyDeletedDivision(uuid)//this would allow one component show it deleting
    dispatch(deleteDivision({org_name,uuid,handleError}))
  }
  return (
    <>
      <AppBar
        heading="Divisions"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />

<Flex justifyContent="space-between" alignItems="center" mb="4">
  <Text
    as="small"
    display="inline-block"
    fontWeight="semibold"
    alignSelf="flex-end"
    color="gray.700"
  >
   Page { pageNum }  of {NumOfData } Division
  </Text>

  <Stack direction="row" spacing={4}>
  
   

    {/* <Button
      leftIcon={<BsFillTrash2Fill/>}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete All
      </Button> */}
      <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete Selected
      </Button>
  </Stack>

</Flex>
  <br />
      <Table w="full" variant="striped" borderRadius="lg" >
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th></Th>
            <Th fontWeight="bold" px="3">
              Division
            </Th>
            <Th fontWeight="bold" px="3">
              Staff Count
            </Th>
            <Th fontWeight="bold" px="3">
              Upline
            </Th>
            <Th fontWeight="bold" px="3">
              Downline
            </Th>

            <Th fontWeight="bold" px="3">
              Update
            </Th>

            <Th fontWeight="bold" px="3">
              Delete
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {status =='loading'&&<Preloader/>}
          {divisions.map((division, idx) => (
            <Tr key={idx} style={{"textTransform":"capitalize"}}>
              <Td>
                <Checkbox/>
              </Td>
              <Td fontSize="sm" px="3">
                {division.name}
              </Td>
              <Td fontSize="sm" px="3">
                {division.employee_count}
              </Td>
              <Td   fontSize="sm">
                {division.corporate_level.name}
                </Td>
              <Td>
                <CustomDrawer
                  showModalBtnText="View All"
                  showModalBtnVariant="outline"
                  drawerSize="xs"
                >
                  <Box px="5">
                    <Text>Downlines</Text>
                    <OrderedList>
                      {division.group.map((downline, idx) => (
                        <ListItem key={idx}>
                          <h3>{downline.name}</h3>
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                </CustomDrawer>
              </Td>


              <Td fontSize="sm" px="3">
                <CustomDrawer
                  showModalBtnText=""
                  // showModalBtnVariant="primary"
                  // showModalBtnColor="white"
                  leftIcon={<RiSendPlaneFill />}
                  drawerSize="xs"
                >
                  {/* <p>hellow rold</p> */}
                  <UpdateDivision upline_corporate_name={division.corporate_level.name} uuid={division.uuid} name={division.name} />
                </CustomDrawer>
              </Td>


              <Td>
              <Button
              loadingText="deleting"
              isLoading={status==="deleting"&&division.uuid===currentlyDeletedDivision}
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{handleDelete(division.uuid)}}
                  ></Button>
              </Td>
            
            </Tr>
          ))}
        </Tbody>
      </Table>


<Box>

<PaginatedItems 
  pageCount={num_of_pages}
  onPageClick={(pageNumberClicked)=>{
    console.log(pageNumberClicked)
    // setPageNum(pageNumberClicked)
    dispatch(getDivisions({'ORG_NAME':org_name,handleError,'pagenum':pageNumberClicked}))

  }}
/>
</Box>
    </>
  );
};

export default Divisions;
