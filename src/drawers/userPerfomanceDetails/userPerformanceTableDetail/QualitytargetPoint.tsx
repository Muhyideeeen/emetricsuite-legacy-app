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



const QualitytargetPoint = ({data}:Prop):React.ReactElement=>{

    
    return (<>

<Heading
style={{"fontSize":"1.4rem","textAlign":"center"}}
>
Quality Target Point
</Heading>
          <Table size="sm" 
      variant="striped" borderRadius="lg" 
      // colorScheme='teal'
      overflow="hidden">
              <Thead  bg="blue.900">
                <Tr>
                  <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
                    Qly Target Points
                  </Th>

                  <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
                    Qly Targets Points Achieved
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
                    % Qly Target Points Achieved
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
                    Cumm Qlt Points Brought Forward
                  </Th>
                  <Th py="5" style={{"textTransform":"capitalize", 'color':'white'}}>
                    Cumm Qly Points Scored
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                          
                              <Tr style={{"textTransform":"capitalize", }}>
                              
                               <Td>
                                    {data.quality_target_point}
                               </Td>

                               <Td>
                                    {data.quality_target_point_achieved}
                               </Td>

                               <Td>
                                    {data.percentage_quality_target_point_achieved}
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
    </>)
}


export default QualitytargetPoint