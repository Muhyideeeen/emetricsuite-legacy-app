import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Grid,

  } from '@chakra-ui/react';
import { HumanPerformanceDataTablePropsType } from "../HumanPerformanceDataTable";


type Prop ={
    data:{
      name:string;
      "objective_id":string;
      "routine_rounod": number;
      "objective_status":string;
      "start_date": string;
      "end_date": string;
      "target_point": string;
      cumulative_report:HumanPerformanceDataTablePropsType[]
    }[];
    dataReport?:any
}
export {}

const ObjectiveBreakDown=({data,dataReport}:Prop):React.ReactElement=>{

  console.log({'my final result':data})

    return (
        <>
        {
            data?
            <Table 
            size="sm" 
            variant="striped" borderRadius="lg" 
            // colorScheme='teal'
            overflow="hidden">
                    <Thead bg="gray.200">
                      <Tr>
                         <Th  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Strategic Objective</Th>
                         <Th   style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Start Date</Th>
                         
                         
                         <Th py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>End Date</Th>
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Target Points</Th>
      
                         
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Achieved Points</Th>
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>% Score</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                                {
                                  data?

                                    data.map((item,index)=>(
                                      <Tr style={{"textTransform":"capitalize"}} key={index}>
                                    
                                      <Td 
                                      style={{"lineHeight":"20px"}}
                                      >{item.name}</Td>
                                      <Td style={{"textAlign":"center"}}>{item.start_date}</Td>
                                      <Td style={{"textAlign":"center"}}> {item.end_date}</Td>
                                      <Td style={{"textAlign":"center"}}>{item.cumulative_report.length!==0?item.cumulative_report[0].target_point:0}</Td>
                                      <Td style={{"textAlign":"center"}}>{item.cumulative_report.length!==0?item.cumulative_report[0].target_point_achieved:0}</Td>
                                      <Td style={{"textAlign":"center"}}>
                                                      {
                                              Math.trunc(
                                              +item.cumulative_report.length!==0?item.cumulative_report[0].percentage_cumulative_target_point_achieved:0
                                              )
                                              }%
                                      </Td>
                                  
                                      
                                  </Tr>
                                    ))
                               
                                    :""
                                }
            
                    </Tbody>
                  </Table>:''
        }
        </>
    )
}

export default ObjectiveBreakDown