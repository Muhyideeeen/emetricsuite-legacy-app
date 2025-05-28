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


export type KpiReport ={
    name:string;
    initiative_id:string;
    owner?:{
        user_id:string;
        first_name:string;
        last_name:string;
        phone_number:string;
        email:string;
    },
    routine_round:number;
    initiative_status:string;
    start_date:string;
    end_date:string;
    target_point:string;
    cumulative_report:HumanPerformanceDataTablePropsType[]
}
type Prop = {
    data:KpiReport[];
    dataReport?:any;
}


const KPIReportBreakDown =({data,dataReport}:Prop):React.ReactElement=>{


 
      console.log({'from kpi':data})
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
                        {/* <Th py="5" style={{"textTransform":"capitalize"}}>
                          ....
                        </Th> */}
                         {/* <Th py="5"   style={{"textTransform":"capitalize"}}>Rountine Round</Th> */}
                         <Th py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Key Performance Indicator</Th>
                         <Th  py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Start Date</Th>
                         
                         
                         <Th py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>End Date</Th>
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Target Points</Th>
      
                         
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Achieved Points</Th>
                         <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>% Score</Th>
                        {/* <Th></Th> */}
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
                                    <Td style={{"textAlign":"center"}}>{item.start_date}</Td>
                                    <Td style={{"textAlign":"center"}}>{item.end_date}</Td>
                                    <Td style={{"textAlign":"center"}}>{item.cumulative_report.length===0?0:item.cumulative_report[0].target_point}</Td>
                                    <Td style={{"textAlign":"center"}}>{item.cumulative_report.length===0?0:item.cumulative_report[0].target_point_achieved}</Td>

                                    <Td style={{"textAlign":"center"}}>
                                                    {
                                            Math.trunc(
                                            +(item.cumulative_report.length===0?0:item.cumulative_report[0].percentage_cumulative_target_point_achieved)
                                            )
                                            }%
                                    </Td>
                                
                                    
                                </Tr>
                                  )):""
                                }
            
                    </Tbody>
                  </Table>:''
        }
        </>
    )
}

export default  KPIReportBreakDown