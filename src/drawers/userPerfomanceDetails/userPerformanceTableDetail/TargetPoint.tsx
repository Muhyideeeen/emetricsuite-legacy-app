import { HumanPerformanceDataTablePropsType } from "../../../components/HumanPerformanceDataTable"
import {
    DrawerBody,
    Flex,
    Text,
    Box,
    DrawerCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading,Tooltip
  } from "@chakra-ui/react";
import { cal_end_time } from "../../../services/extraFunctions";



type Prop = {
    data:HumanPerformanceDataTablePropsType
}



const TargetPoint = ({data}:Prop):React.ReactElement=>(
    <>
    <Heading style={{"fontSize":"1.4rem","textAlign":"center"}}>
            Target Point
    </Heading>
<Table size="sm" 
variant="striped" borderRadius="lg" 
// colorScheme='teal'
overflow="hidden">
<Thead  bg="blue.900">
     <Tr>
        <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
        Total Target Points
        </Th>

        <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
        Total Target Points Achieved
        </Th>

        <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
        % Total Target Points Achieved
        </Th>

        <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
        Cumm Total Target Points Brought Forward
        </Th>

        <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
            Cumm Total Target Points
        </Th>

     </Tr>
</Thead>
<Tbody>
               
               <Tr>
               
                    <Td py="5" >
                         {data.target_point}
                    </Td>

                    <Td>
                         {data.target_point_achieved}
                    </Td>

                    <Td>
                         {data.percentage_target_point_achieved}
                    </Td>
                    <Td>
                        Nil
                    </Td>

                    <Td>
                        Nil
                    </Td>
               


               

                  
               </Tr>
          

</Tbody>
</Table>

    </>
)



export default TargetPoint