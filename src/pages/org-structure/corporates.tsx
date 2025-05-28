import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  OrderedList,
  ListItem,
  Text,
  Box,Button, useToast, Stack, Flex, Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AppBar from "../../components/AppBar";
import CustomDrawer from "../../drawers/CustomDrawer";
import { Corporate,getCorporates,deleteCoporate } from "../../redux/corporate/corporateAPI";
import { selectCorporate } from "../../redux/corporate/corporateSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import UpdateCorporate from "../../drawers/UpdateCorporate";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import { useErrorHandler } from "react-error-boundary";
import { BsFillTrash2Fill } from "react-icons/bs";

const Corporates = () => {
     //pagination states
     const [pageNum,setPageNum] = useState(1);
     //end pagination states
  const handleError = useErrorHandler()
    
  const [ org_name,setOrg_name] =useState<any>(localStorage.getItem("current_organization_short_name"));
  const { corporates,status,
    count:NumOfData,
    next:nextPage,previous:previousPage  
  } = useAppSelector(selectCorporate);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const renderDownlines = (
    corporate: Corporate
  ): { name: string; uuid: string; slug: string }[] => {
    if (corporate.division.length) {
      console.log("found it", corporate.division);
      return corporate.division;
    } else if (corporate.group) {
      return corporate.group;
    } else if (corporate.department) {
      return corporate.department;
    } else if (corporate.unit) {
      return corporate.unit;
    } else {
      return corporate.division;
    }
  };

  useEffect(()=>{
    dispatch(getCorporates({"ORG_NAME":org_name,"pagenum":pageNum,handleError}))

  },[])
  useEffect(()=>{
    dispatch(getCorporates({"ORG_NAME":org_name,"pagenum":pageNum,handleError}))
    
  },[pageNum])
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

  // useEffect(()=>{
  //   if(status=="succeeded"){
  //     dispatch(getCorporates({"ORG_NAME":org_name,"pagenum":pageNum}))
  //   }
  // },[status])


  return (
    <>
      <AppBar
        heading="Corporates"
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
   Page { pageNum }  of {NumOfData } Corporates
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
              Corporates
            </Th>
            <Th fontWeight="bold" px="3">
              Staff Count
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
   
          {status==("loading"||"updated")?"Loading.."
            :
          corporates.map((corporate, idx) => (
            <Tr key={idx} style={{"textTransform":"capitalize"}}>
               <Td>
                  <Checkbox />
              </Td>
              <Td fontSize="sm" px="3">
                {corporate.name}
              </Td>
              <Td fontSize="sm" px="3">
                {corporate.employee_count}
              </Td>
              <Td fontSize="sm" px="3">
                <CustomDrawer
                  showModalBtnText="View All"
                  showModalBtnVariant="outline"
                  drawerSize="xs"
                >
                  <Box px="5">
                    <Text>Downlines</Text>
                    <OrderedList>
                      {renderDownlines(corporate).map((downline, idx) => (
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
                  <UpdateCorporate uuid={corporate.uuid} name={corporate.name} />
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
                      dispatch(deleteCoporate({"org_name":org_name,"handleError":handleError,uuid:corporate.uuid}))

                    }
                  }}
                  ></Button>
              </Td>
            </Tr>
          ))     
          }
         
        </Tbody>
      </Table>

      <Box>
      <Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button>


      </Box>
    </>
  );
};

export default Corporates;
