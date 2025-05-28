import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Stack,
  Button,
  FormControl,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';


import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addDesignation,
  Designation as DesignationType,deleteDesignation, getDesignation
} from "../../redux/designation/DesignationAPI";
import { selectDesignation } from "../../redux/designation/DesignationSlice";
// import { Team as TeamType } from "../../redux/team/teamAPI";
import axios from "../../services/api";
import CustomDrawer from "../../drawers/CustomDrawer";
import { HiOutlinePlus } from "react-icons/hi";
import AddDesignation, { DesignationInputsType } from "../../drawers/AddDesignation";
import UploadDesignation from "../../drawers/UploadDesignation";
// import { team } from "../../redux/team/teamSlice";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import UpdateDesignation from "../../drawers/UpdateDesignation";
import { useErrorHandler } from "react-error-boundary";
import PaginatedItems from "../../components/Pagination/Pagination";
import Preloader from "../../components/Preloader";

export const GetLevelName=(data:any)=>{
  // let returnedStatment:string; 
  console.log(data) 
if(data.corporate_level){
  return (<> <strong>Corporate Level</strong> {" : "} {data.corporate_level?.name} </>)
}

if(data.department){
  return (<> <strong>Department Level</strong>{" : "}{data.department?.name} </>)
}
    
if(data.division){
  return(<> <strong>Division Level</strong>{" : "}{data.division?.name} </>)
}

if(data.group){
  return (<> <strong>Group Level</strong>{" : "}{data.group?.name} </>)
}

if(data.unit){
  return  (<> <strong>Unit Level</strong>{" : "}{data.unit?.name} </>)
}



}

const Designation = () => {
  //pagination states
  const [pageNum,setPageNum] = useState(1);
  //end pagination states 
  const handleError = useErrorHandler();
  
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const toast = useToast();
  const { status, message, errorMessage ,count:NumOfData,designations,num_of_page
  } = useAppSelector(selectDesignation);

  const onSubmit: SubmitHandler<DesignationInputsType> = (submitedData) => {
     const data= {...submitedData,handleError}
    dispatch(addDesignation(data));
  };
  const handleDelete=(nameToDelete:string,designation_id:string)=>{
    if(window.confirm("Are Sure You Want to Delete")){
      dispatch(deleteDesignation({designation_id,nameToDelete,handleError}))
    }
  }




  useEffect(()=>{
    if(status=="deleted" && message){
      if(message){
        toast(
          {
            title: message,
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
          }
        )
      }
      
    }
  },[status])
  useEffect(()=>{
    dispatch(getDesignation({"pagenum":1,handleError}))
  },[])
 

  // console.log(designations)
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          Showing {designations.length} of {NumOfData}  Designations
        </Text>

        <Stack direction="row" spacing={4}>
          <CustomDrawer
            showModalBtnText="Add Designation"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm">
            <AddDesignation />
          </CustomDrawer>

            
          <CustomDrawer
            showModalBtnText="Upload Designation"
            showModalBtnVariant="outline"
            // showModalBtnColor="white"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
              <UploadDesignation/>
          </CustomDrawer>
        </Stack>
      </Flex>

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.200">
          <Tr>
            <Th py="4" style={{"textTransform":"capitalize"}}>Designations</Th>
            <Th py="4"  style={{"textTransform":"capitalize"}}>Connected To</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>Delete</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>Update</Th>

          </Tr>
        </Thead>
        <Tbody>
          {status==='loading'?<Preloader />:''}
          {designations.length == 0 ? (
            <Tr>
              <Td colSpan={3}>
                <Text as="h1" textAlign="center">
                  No Designations available. Create a Designation
                </Text>
              </Td>
            </Tr>
          ) : (
            designations.map((designation, index) => (
              <Tr key={index} style={{"textTransform":"capitalize"}}>
                <Td>
                  <Text mb="2" fontSize="sm">
                    {designation.name}
                  </Text>
                </Td>

                <Td>
                  <Text mb="2" fontSize="sm">
                   {GetLevelName({
                     corporate_level:designation?.corporate_level,
                     department:designation?.department,
                     division:designation?.division,
                     group:designation?.group,
                     unit:designation?.unit
                   })}
                  </Text>
                </Td>
                {/* <Td>
                  <Button>Delete</Button>
                </Td> */}
            

<Td>
                  <Button
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>handleDelete(designation.name,designation.designation_id)}
                  ></Button>
                </Td>


                <Td>
              <CustomDrawer
            showModalBtnText=""
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<RiSendPlaneFill />}
            drawerSize="xs"
          >
          <UpdateDesignation 
            {...designation}
          />
          {/* <p>dd</p> */}
          </CustomDrawer>
              </Td>


              </Tr>
            ))
          )}
        </Tbody>
      </Table>


      <PaginatedItems
      pageCount={num_of_page}
      onPageClick={(pageNumberClick)=>{
    dispatch(getDesignation({"pagenum":pageNumberClick,handleError}))

      }}
      />
    </Box>
  );
};

export default Designation;
