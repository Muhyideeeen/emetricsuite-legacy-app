import { useState}  from 'react'
import AppBar from "../../components/AppBar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  OrderedList,
  ListItem,Button,useToast, Checkbox, Stack, Flex
} from "@chakra-ui/react";
import { useAppSelector,useAppDispatch} from "../../redux/hooks";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import { selectDepartment } from "../../redux/department/departmentSlice";
import {getDepartments,deleteDepartment} from "../../redux/department/departmentAPI"
import CustomDrawer from "../../drawers/CustomDrawer";
import UpdateDepartment from  "../../drawers/UpdateDepartment";
import {useEffect} from "react";
import { useErrorHandler } from "react-error-boundary";
import Preloader from "../../components/Preloader";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { BsFillTrash2Fill } from 'react-icons/bs';
import  PaginatedItems from  '../../components/Pagination/Pagination'


const Departments = () => {
  const [pageNum,setPageNum] = useState(1);

  const { 
    departments,status,
    count:NumOfData,num_of_pages
  } = useAppSelector(selectDepartment);
  const dispatch = useAppDispatch();
  const org_name =localStorage.getItem("current_organization_short_name");
  const handleError = useErrorHandler();
  const toast = useToast();
  
  useEffect(()=>{
    if(status==="deleted"){
      toast({
        title: "Deleted Successfully",
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
      })
    }
  },[status])


  useEffect(()=>{
    if(!org_name) return 

    dispatch(getDepartments({"ORG_NAME":org_name,handleError,'pagenum':1}))
  },[])
  return (
    <>
          {status==='loading'&&<Preloader />}
    
      <AppBar
        heading="Departments"
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
   Page { pageNum }  of {NumOfData } Departments
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
      <Table w="full" variant="unstyled" borderRadius="lg">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
          <Th></Th>

            <Th fontWeight="bold" px="3">
              Departments
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
              Edit
            </Th>
            <Th fontWeight="bold" px="3">
              Delete
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {departments.map((department, idx) => (
            <Tr key={idx} style={{"textTransform":"capitalize"}}>
               <Td>
                  <Checkbox />
              </Td>
              <Td fontSize="sm" px="3">
                {department.name}
              </Td>
              <Td fontSize="sm" px="3">
                {department.employee_count}
              </Td>
              <Td fontSize="sm" px="3" textTransform="uppercase">
                {department.group?.slug || department.corporate_level?.slug}
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
                      {department.unit.map((downline, idx) => (
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
                  <UpdateDepartment uuid={department.uuid} name={department.name} />
                </CustomDrawer>
              </Td>

              <Td>
              <Button
              loadingText="deleting"
              isLoading={status==="deleting"}
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{
                    if(!org_name) return
                    if(window.confirm("Are Sure You Want to Delete")){
                      dispatch(deleteDepartment({"org_name":org_name,"handleError":handleError,uuid:department.uuid}))
                    }
                  }}
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

<Box>

<PaginatedItems 
  pageCount={num_of_pages}
  onPageClick={(pageNumberClicked)=>{
    console.log(pageNumberClicked)
    if(!org_name) return 

    dispatch(getDepartments({"ORG_NAME":org_name,handleError,'pagenum':pageNumberClicked}))
  }}
/>
</Box>
    </>
  );
};

export default Departments;
