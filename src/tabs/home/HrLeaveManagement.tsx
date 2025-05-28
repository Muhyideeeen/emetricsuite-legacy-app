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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import CustomDrawer from "../../drawers/CustomDrawer";
import { HiOutlinePlus } from "react-icons/hi";
import Preloader from "../../components/Preloader";
import PaginatedItems from "../../components/Pagination/Pagination";
import CreateLeave from "../../drawers/CreateLeave";
import { selectLeave } from "../../redux/LeaveManagement/LeaveManagementSlice";
import { getLeaveApi } from "../../redux/LeaveManagement/LeaveManagementApi";
import { useErrorHandler } from "react-error-boundary";
import UploadLeaveBatchTemplate from "../../drawers/UploadLeaveBatchTemplate";



const HrLeaveManagement = ():React.ReactElement=>{
  const dispatch = useAppDispatch()
  const { status ,data ,errMessage } = useAppSelector(selectLeave)
  const org_name=  localStorage.getItem('current_organization_short_name')
  const handleError = useErrorHandler();

    useEffect(()=>{
      if(org_name){
        dispatch(getLeaveApi({org_name,handleError}))
      }
    },[])
    return (
        <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text
            as="small"
            display="inline-block"
            fontWeight="semibold"
            alignSelf="flex-end"
          >
            Showing 0 of 0  Leave
          </Text>
  
          <Stack direction="row" spacing={4}>
            <CustomDrawer
              showModalBtnText="Create Leave"
              showModalBtnVariant="primary"
              showModalBtnColor="white"
              leftIcon={<HiOutlinePlus />}
              drawerSize="sm">
                <CreateLeave/>
            </CustomDrawer>
  
              
            <CustomDrawer
              showModalBtnText="Upload Leave template"
              showModalBtnVariant="outline"
              // showModalBtnColor="white"
              showModalBtnColor="primary"
              leftIcon={<HiOutlinePlus />}
              drawerSize="sm"
            >
              <UploadLeaveBatchTemplate/>
            </CustomDrawer>
          </Stack>
        </Flex>
  {status==='pending' &&<Preloader/>}
        <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
          <Thead bg="gray.200">
            <Tr>
              <Th py="4" style={{"textTransform":"capitalize"}}>Level Type</Th>
              <Th py="4"  style={{"textTransform":"capitalize"}}>Grade Level</Th>
              <Th py="2"  style={{"textTransform":"capitalize"}}>Duration</Th>
              <Th py="2"  style={{"textTransform":"capitalize"}}>Leave Allowance</Th>
              <Th py="2"  style={{"textTransform":"capitalize"}}>days Splitting Formula</Th>
  
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((item,index)=>(
                <Tr key={index}>
                    <Td>{item.leave_choice}</Td>
                    <Td>{item.grade_level}</Td>
                    <Td>{item.duration}</Td>
                    <Td>{item.leave_allowance}</Td>
                    <Td>{item.leave_formula}</Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
  
  
        {/* <PaginatedItems
        pageCount={num_of_page}
        onPageClick={(pageNumberClick)=>{
  
        }}
        /> */}
      </Box>
    )
}


export default HrLeaveManagement