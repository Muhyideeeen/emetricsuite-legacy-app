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



const Quantitytargetpoint = ({data}:Prop):React.ReactElement=>{

    
    return (<>

<Heading
style={{"fontSize":"1.4rem","textAlign":"center"}}
            >
    Quantity Target Point
</Heading>
          <Table size="sm" 
      variant="striped" borderRadius="lg" 
      // colorScheme='teal'
     //  overflow="scroll"
      >
              <Thead bg="blue.900">
                <Tr>
                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Quantity Target Units
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Quantity Target Units Achieved
                  </Th>

                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  % Qty Target Points Achieved
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Quantity Target Points
                  </Th>

                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Quantity Target Points Achieved
                  </Th>

                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Cumm Qty Taget Points Brought Forward
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Cumm Qty Points Scored
                  </Th>


                </Tr>
              </Thead>
              <Tbody>
                          
                              <Tr style={{"textTransform":"capitalize"}}>
                              
                               <Td>
                                    {data.quantity_target_unit}
                               </Td>

                               <Td>
                                    {data.quantity_target_unit_achieved}
                               </Td>

                               <Td>
                                    {data.percentage_quantity_target_point_achieved}
                               </Td>
                              

                               <Td>
                                    {data.quantity_target_point}
                               </Td>
                              

                               <Td>
                                {data.quantity_target_point_achieved}
                               </Td>
                              
                               <Td>
                                    NiL
                               </Td>


                               <Td>
                                 NiL
                               </Td>


                              
                             
                              
                          </Tr>
                        
      
              </Tbody>
            </Table>
    </>)
}


export default Quantitytargetpoint