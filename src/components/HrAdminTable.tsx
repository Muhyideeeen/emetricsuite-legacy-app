import { useState, useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Box,
  Text,
  Flex,
  Stack,Button, useToast,
} from "@chakra-ui/react";
import CustomDrawer from "../drawers/CustomDrawer";
import { HiOutlinePlus } from "react-icons/hi";
import Preloader from "./Preloader";
import CreateHrAdminDrawer from "../drawers/CreateHrAdminDrawer";
import axios from "../services/api";
import { RiSendPlaneFill } from "react-icons/ri";
import UpdateHrAdminDrawer from "../drawers/UpdateHrAdminDrawer";





const HrAdminTable = ():React.ReactElement=>{

    const [isLoading,setIsLoading] = useState(false);
    const org_name = localStorage.getItem('current_organization_short_name');
    const toast = useToast()
    const [list_of_hr,setList_of_hr] = useState<any>([])

    const getHrAdmin = async ()=>{
        setIsLoading(true)
        try{
            const resp = await axios.get(`auth/register/admin/?organisation_short_name=${org_name}`)
            if(resp.status==200){
                setList_of_hr(resp.data.data)
            }
        setIsLoading(false)

        }catch(err:any){
            setIsLoading(false)

            toast({
                title: 'Some Error Occured please refresh',
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
              });
        }
        setIsLoading(false)

    }

    useEffect(()=>{

        getHrAdmin()
    },[])
    return (    
        <Box>
            {isLoading&&<Preloader/>}
            
            <Stack
            direction="row" spacing={4}
            justifyContent='space-between'
            >

            <Text
                as="small"
                display="inline-block"
                fontWeight="semibold"
                alignSelf="flex-end"
                
            >
        
            </Text>
                 <CustomDrawer
            showModalBtnText="Add New Hr Admin"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus/>}
          >
           <CreateHrAdminDrawer/>

          </CustomDrawer>


            </Stack>
<br />

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg='gray.100'
  style={{"textTransform":"capitalize"}}
        >
            <Tr>
                <Th py='3'>
                    First Name
                </Th>
                <Th py='3'>
                    Last Name
                </Th>
                <Th py='3'>
                    Phone Number
                </Th>

                <Th py='3'>
                    Email 
                </Th>

                <Th py='3'>
                    
                </Th>

            </Tr>
        </Thead>

            <Tbody>
                {/* <Preloader/> */}
            {
                list_of_hr?

                    list_of_hr.map((data:any,index:number)=>(

                        <Tr 
                    key={index}
                >
                    <Td>{data.first_name}</Td>
                    <Td>{data.last_name}</Td>
                    <Td>{data.phone_number}</Td>
                    <Td>{data.email}</Td>
                    <Td>
                    <CustomDrawer
            showModalBtnText=""
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<RiSendPlaneFill />}
            drawerSize="md"

          >
            <UpdateHrAdminDrawer {...data} />
          </CustomDrawer>
                    </Td>
                </Tr>
                    ))
                :''
            }

            </Tbody>
     </Table>
        </Box>
    )
}

export default HrAdminTable