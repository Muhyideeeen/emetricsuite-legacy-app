import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Grid,

  } from '@chakra-ui/react';
import React from "react"
import CustomDrawer from '../../drawers/CustomDrawer';
import { UserPerfomanceDetails } from '../../drawers/userPerfomanceDetails/userPerfomanceDetails';
import { HumanPerformanceDataTablePropsType } from "../HumanPerformanceDataTable"




type Prop = {
    data:HumanPerformanceDataTablePropsType[]
}

const AppraisalTaskReport = ({data}:Prop):React.ReactElement=>{



    
    return (
        <Table 
        size="sm" 
        variant="striped" borderRadius="lg" 
        // colorScheme='teal'
        overflow="hidden">
                <Thead bg="gray.200">
                  <Tr>
                    <Th py="5" style={{"textTransform":"capitalize"}}>
                      Task Name/Employee name
                    </Th>
                     {/* <Th py="5"   style={{"textTransform":"capitalize"}}>Rountine Round</Th> */}
                     <Th  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>TAT Score</Th>
                     <Th   style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Job Quality Score</Th>
                     
                     
                     <Th py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Job Quantity Score</Th>
                     <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Total Score</Th>
  
                     
                     <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>% Score</Th>
                     <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Remark</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                            {
                              data?
                              data.map((item)=>(
                                <Tr style={{"textTransform":"capitalize"}}>
                                
                                <Td 
                                style={{"lineHeight":"20px"}}
                                >{item.name}</Td>
                                <Td style={{"textAlign":"center"}}>{item.turn_around_time_target_point_achieved}</Td>
                                <Td style={{"textAlign":"center"}}>{item.quality_target_point_achieved}</Td>
                                <Td style={{"textAlign":"center"}}>{item.quantity_target_point_achieved}</Td>
                                <Td style={{"textAlign":"center"}}>{item.target_point_achieved}</Td>
                                <Td style={{"textAlign":"center"}}>
                                                {
                                        Math.trunc(
                                        +item.percentage_cumulative_target_point_achieved
                                        )
                                        }%
                                </Td>
                            
                                <Td>
                                  <CustomDrawer showModalBtnText="View" drawerSize="xl">
                                    <UserPerfomanceDetails data={item} />
                                  </CustomDrawer>
                                </Td>
                                
                            </Tr>
                              )):""
                            }
        
                </Tbody>
              </Table>
    )
}


export default AppraisalTaskReport