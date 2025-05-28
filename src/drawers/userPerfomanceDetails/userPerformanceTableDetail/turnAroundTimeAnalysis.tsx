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
const TurnAroundTimeAnalysis = ({data}:Prop):React.ReactElement=>{


    return (

        <>
        <Heading 
style={{"fontSize":"1.4rem","textAlign":"center"}}
>
    Turn Around Time Target Point
</Heading>
          <Table size="sm" 
      variant="striped" borderRadius="lg" 
      // colorScheme='teal'
      overflow="hidden"
     style={{"width":"100%"}}
      
      >
              <Thead bg="blue.900">
                <Tr>
                  <Th py="5" style={{"textTransform":"capitalize",'color':'white'}}>
                  Task Submission Time Target
                  </Th>
                   <Th py="5"   style={{"textTransform":"capitalize",'color':'white'}}>
                        Task Submission Time Achieved                      
                    </Th>
                   <Th py="5"  style={{"textTransform":"capitalize",'color':'white'}}>
                        
                        TAT Target Points                     
                    </Th>
                   <Th py="5"  style={{"textTransform":"capitalize",'color':'white'}}>

                   TAT Target Points Achieved               
                        
                    </Th>
                   <Th py="5"  style={{"textTransform":"capitalize",'color':'white'}}>
                   % TAT Target Points Achieved              
                        </Th>
                   <Th py="5"  style={{"textTransform":"capitalize",'color':'white'}}>
                   Cum TAT Score Brought Forward            
                        </Th>

                    <Th  py="5"  style={{"textTransform":"capitalize",'color':'white'}}>
                    Cumm TAT Score
                    </Th>

                   {/* <Th py="5"></Th> */}
                </Tr>
              </Thead>
              <Tbody>
                          
                              <Tr style={{"textTransform":"capitalize"}}>
                              
                               <Td>
                                    {cal_end_time({start_time:data.start_time,duration:data.duration})}
                               </Td>

                               <Td>
                               NiL
                               </Td>

                               <Td>
                                    {data.turn_around_time_target_point}
                               </Td>
                              

                               <Td>
                                    {data.turn_around_time_target_point_achieved}
                               </Td>
                              

                               <Td>
                                    {data.percentage_turn_around_time_target_point_achieved}% 
                               </Td>
                              
                               <Td> 
                                        NiL
                               </Td>
                              
                               <Td>
                               {/* Cum TAT Score Brought Forward  +  turn_around_time_target_point_achieved */}
                                    {/* {data.turn_around_time_target_point_achieved} + */}
                                    NiL
                               </Td>
                             
                              
                          </Tr>
                        
      
              </Tbody>
            </Table>
        </>
    )
}

export default TurnAroundTimeAnalysis