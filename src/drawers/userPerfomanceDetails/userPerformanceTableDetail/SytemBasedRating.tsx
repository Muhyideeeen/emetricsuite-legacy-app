
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



const SytemBasedRating = ({data}:Prop):React.ReactElement=>(
     <>
        <Heading
    style={{"fontSize":"1.4rem","textAlign":"center"}}
    >
    Sytem Based Rating
    </Heading>

<Table size="sm" 
      variant="striped" borderRadius="lg" 
      // colorScheme='teal'
      overflow="hidden">
              <Thead bg="linkedin.100">
                <Tr>
                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Total Qly Target Points
                    </Th>

                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Total Qly Target Points Achieved
                    </Th>

                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Plagiarism Asseement % Score
                    </Th>
                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Content Similarity Assessment % Score
                    </Th>
                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Plagiarism {'&'} Similarity % Score
                    </Th>

                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         System Based Job Quality Score
                    </Th>

                    <Th py="5" style={{"textTransform":"capitalize"}}>
                         Over-All Total Points Score (+TAT & Qty)
                    </Th>

                   {/* <Th py="5"></Th> */}
                </Tr>
              </Thead>
              <Tbody>
                          
                              <Tr style={{"textTransform":"capitalize"}}>
                              <Td>
                                   {data.quality_target_point}
                              </Td>
                              <Td>
                                   {data.quality_target_point_achieved}
                              </Td>
                               <Td>
                                    {data?.plagiarism_score}
                               </Td>

                               <Td>
                                    {data?.sensitivity_score}
                               </Td>


                               <Td>
                                    {data?.average_system_based_score}
                               </Td>
                               
                              <Td>
                         {
                      Number(data.quality_target_point) *  ( data?.average_system_based_score? Number(data.average_system_based_score)/100:0)}
                              </Td>
                              
                               
                               <Td>
                              {Number(data.quality_target_point_achieved)+ Number(data.turn_around_time_target_point_achieved)}
                               </Td>
                               
                              
                          </Tr>
                        
      
              </Tbody>
            </Table>
     </>
)

export default SytemBasedRating