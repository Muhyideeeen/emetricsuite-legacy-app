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
import { useErrorHandler } from "react-error-boundary";
import Preloader from "../../components/Preloader";
import axios from "../../services/api";



type assingHandOverTypeEmployee ={
  "user_id": number,
  "user__first_name":string,
  "user__last_name": string,
  "user__phone_number":string,
  "user__email": string,
  "user__user_role": number
}
type assingHandOverType = {
     "employee": assingHandOverTypeEmployee[],
            "employee_leave_application": {
              "start_date": string,
              "end_date": string,
              "leave_type": "paternity"
            },
            "hand_over_report":number,
            "is_active": boolean
}

const  GetAssignHandOver = ():React.ReactElement=>{
    const handleError = useErrorHandler();
    const org_name=  localStorage.getItem('current_organization_short_name')
    const [data,setData] = useState<assingHandOverType[]>()
  const [isLoading,setIsLoading] = useState(false)
    
    const getData = async ()=>{
        setIsLoading(true)
        try{
            const resp:any = await axios.get(`client/${org_name}/leave-management/leave-application/get_assign_handover/`)
        setIsLoading(false)
          console.log(resp)
            setData(resp.data.data)
        }
        catch(err:any){
            //
        setIsLoading(false)

        }
    }
    useEffect(()=>{
        getData()
    },[])
    return (
        <Box>
  {isLoading &&<Preloader/>}

     <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text
            as="small"
            display="inline-block"
            fontWeight="semibold"
            alignSelf="flex-end"
          >
            Showing 0 of 0  Leave
          </Text>
  
          <div></div>
        </Flex>

        <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
          <Thead bg="gray.200">
            <Tr>
              <Th py="4" style={{"textTransform":"capitalize"}}>Employee</Th>
              <Th py="4"  style={{"textTransform":"capitalize"}}>Employee Application</Th>
              <Th py="2"  style={{"textTransform":"capitalize"}}>hand_over_report</Th>
              <Th py="2"  style={{"textTransform":"capitalize"}}>Active</Th>
  
            </Tr>
          </Thead>
          <Tbody>
            {
                data?
              data.map((item,index)=>(
                <Tr key={index}>
                    <Td>{item.employee[0].user__email}</Td>
                    <Td>{item.employee_leave_application.leave_type}</Td>
                    <Td>ff</Td>
                    <Td>{item.is_active?'true':'false'}</Td>
                </Tr>
              )):
              ''
            }
          </Tbody>
        </Table>
        </Box>
    )
}


export default GetAssignHandOver