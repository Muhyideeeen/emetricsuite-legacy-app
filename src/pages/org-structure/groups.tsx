import AppBar from "../../components/AppBar";
import { Table, Button,Thead, Tbody, Tr, Th, Td, Box, Text, OrderedList, ListItem, Flex, Stack, Checkbox } from "@chakra-ui/react";
import { selectGroup } from "../../redux/group/groupSlice";
import { useAppSelector ,useAppDispatch} from "../../redux/hooks";
import CustomDrawer from "../../drawers/CustomDrawer";
import { useEffect,useState } from "react";
import { getDivisions } from "../../redux/division/divisionAPI";
import { useErrorHandler } from "react-error-boundary";
import { deleteGroup, getGroups } from "../../redux/group/groupAPI";
import UpdateGroup from "../../drawers/updateGroup";
import {RiSendPlaneFill,RiDeleteBinLine} from "react-icons/ri"
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Preloader from "../../components/Preloader";
import { BsFillTrash2Fill } from "react-icons/bs";
import PaginatedItems from "../../components/Pagination/Pagination";

const Groups = () => {
  const [pageNum,setPageNum] = useState(1);
  const [currentlyDeletedGroup,setCurrentlyDeletedGroup]=useState('')
  const { groups,status,
    count:NumOfData,num_of_page
  } = useAppSelector(selectGroup);
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler()
const org_name= localStorage.getItem("current_organization_short_name");
  useEffect(()=>{
    if(!org_name) return 
    dispatch(getGroups({"ORG_NAME":org_name,"handleError":handleError,'pagenum':1}))
  },[])


  const handleDelete=(uuid:string)=>{
    if(!org_name) return 
    if(window.confirm("Are Sure You Want to Delete")){
      setCurrentlyDeletedGroup(uuid)
      dispatch(deleteGroup({"org_name":org_name,"handleError":handleError,uuid:uuid}))
    }
  }
  return (
    <>
      <AppBar
        heading="Groups"
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
   Page { pageNum }  of {NumOfData } Groups
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

  <br /><br />
  {status=='loading'&& <Preloader/>}
      <Table w="full" variant="striped" borderRadius="lg">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th></Th>
            <Th fontWeight="bold" px="3">
              Groups
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
          {groups.map((group, idx) => (
            <Tr key={idx}>
              <Td>
                <Checkbox/>
              </Td>
              <Td fontSize="sm" px="3">
                {group.name}
              </Td>
              <Td fontSize="sm" px="3">
                {group.employee_count}
              </Td>
              <Td fontSize="sm" px="3" textTransform="uppercase">
                {group.division?.slug || group.corporate_level?.slug}
              </Td>
              <Td>
                <CustomDrawer
                  showModalBtnText="View All"
                  showModalBtnColor="outline"
                  drawerSize="xs"
                >
                  <Box px="5">
                    <Text>Downlines</Text>
                    <OrderedList>
                      {group.department.map((downline, idx) => (
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
                  <UpdateGroup
                   uuid={group.uuid} name={group.name} /> 
                </CustomDrawer>
              </Td>

              <Td>
              <Button
              loadingText="deleting"
              isLoading={status==="deleting"&&group.uuid===currentlyDeletedGroup}
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{ handleDelete(group.uuid)}}
                  ></Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* <Box>
          <Button disabled={!previousPage || status =='loading'}
    onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
    leftIcon={ <GrFormPreviousLink/>}></Button>

    <Button disabled={!nextPage || status =='loading'}leftIcon={<GrFormNextLink/>}
    onClick={(e)=>setPageNum(pageNum+1)}></Button>


      </Box> */}

      <PaginatedItems 
        pageCount={num_of_page}
        onPageClick={(pageNumberClick)=>{
          if(!org_name) return 
          dispatch(getGroups({"ORG_NAME":org_name,"handleError":handleError,'pagenum':pageNumberClick}))

        }}
      />
    </>
  );
};

export default Groups;
