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
  ListItem,Button,useToast
} from "@chakra-ui/react";
import { useAppSelector,useAppDispatch } from "../../redux/hooks";
import { selectUnit } from "../../redux/unit/unitSlice";


import CustomDrawer from "../../drawers/CustomDrawer";
import { useEffect } from "react";
import { getUnits,deleteUnit } from "../../redux/unit/unitAPI";
import UpdateUnits from "../../drawers/UpdateUnits";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import { useErrorHandler } from "react-error-boundary";

const Units = () => {
    const { units,status } = useAppSelector(selectUnit);
    const dispatch = useAppDispatch();
    const handleError = useErrorHandler();
    const toast = useToast();
    const org_name = localStorage.getItem("current_organization_short_name");
      useEffect(()=>{
        if(!org_name) return
          dispatch(getUnits(org_name))
      },[])

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
    return (
        <>
      <AppBar
        heading="Units"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />
      <Table w="full" variant="striped" borderRadius="lg">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th fontWeight="bold" px="3">
              Units
            </Th>
            <Th fontWeight="bold" px="3">
              Staff Count
            </Th>
            <Th fontWeight="bold" px="3">
              Upline
            </Th>
            <Th fontWeight={"bold"} px="3">
              Update
            </Th>
            <Th fontWeight={"bold"} px="3">
              Delete
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {units.map((unit, idx) => (
            <Tr key={idx}>
              <Td fontSize="sm" px="3">
                {unit.name}
              </Td>
              <Td fontSize="sm" px="3">
                {unit.employee_count}
              </Td>
              <Td fontSize="sm" px="3" textTransform="uppercase">
                {unit.department?.slug || unit.corporate_level?.slug}
              </Td>

              <Td fontSize="sm" px="3">
                <CustomDrawer
                  showModalBtnText=""
                  // showModalBtnVariant="primary"
                  // showModalBtnColor="white"
                  leftIcon={<RiSendPlaneFill />}
                  drawerSize="xs"

                >
                  <UpdateUnits uuid={unit.uuid} name={unit.name} />
                </CustomDrawer>
              </Td>

              
              <Td>
              <Button
              loadingText=""
              isLoading={status==="deleting"}
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{
                    if(!org_name) return 
                    if(window.confirm("Are Sure You Want to Delete")){
                      dispatch(deleteUnit({"org_name":org_name,"handleError":handleError,uuid:unit.uuid}))
                    }
                  }}
                  ></Button>
              </Td>
            </Tr>
          ))}
         
        </Tbody>
      </Table>
    </>
    )
}

export default Units
