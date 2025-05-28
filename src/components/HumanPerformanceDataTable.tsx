import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Grid,

  } from '@chakra-ui/react';
import { useEffect,useMemo } from 'react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import CustomDrawer from '../drawers/CustomDrawer';
import { UserPerfomanceDetails } from '../drawers/userPerfomanceDetails/userPerfomanceDetails';
import CardList from './CardList';
import GaugeChart from 'react-gauge-chart';
import { parse } from 'path';

export interface HumanPerformanceDataTablePropsType{
    "task_id": string;
            "name":string;
            "start_date": string;
            "start_time": string;
            "duration": string;
            "routine_round": number;
            "turn_around_time_target_point": string;
            "turn_around_time_target_point_achieved": string;
            "percentage_turn_around_time_target_point_achieved": number;
            "cumulative_turn_around_time_target_point": number;
            "cumulative_turn_around_time_target_point_achieved":number;
            "percentage_cumulative_turn_around_time_target_point_achieved": number;
            "quantity_target_unit": string;
            "quantity_target_unit_achieved": string;
            "quantity_target_point": string;
            "quantity_target_point_achieved": string;
            "percentage_quantity_target_point_achieved": number;
            "cumulative_quantity_target_point": number;
            "cumulative_quantity_target_point_achieved": number;
            "percentage_cumulative_quantity_target_point_achieved": number;
            "quality_target_point": string;
            "quality_target_point_achieved": string;
            "percentage_quality_target_point_achieved":number;
            "cumulative_quality_target_point": number;
            "cumulative_quality_target_point_achieved": number;
            "percentage_cumulative_quality_target_point_achieved": number;
            "target_point": string
            "target_point_achieved": string;
            "percentage_target_point_achieved": number;
            "cumulative_target_point": number;
            "cumulative_target_point_achieved": number;
            "percentage_cumulative_target_point_achieved": number;
            "sensitivity_score"?:number;
            "plagiarism_score"?:number;
            "average_system_based_score"?:number;
}



const HumanPerformanceDataTable:React.FC<{data:HumanPerformanceDataTablePropsType[],dataReport?:any}> = ({data,dataReport=null})=>{
  const cardDetails = [
    {
      title: 'All  Cont.Performance',
      value:
      Math.trunc(+( 
        dataReport?dataReport?.percentage_cumulative_target_point_achieved:0
        ))
        ,
      rate: 10,
      width:"40%"
    },
    {
      title: 'TAT Performance',
      value:  
      Math.trunc(+( 
      
      dataReport?dataReport?.percentage_cumulative_turn_around_time_target_point_achieved:0
      ))
      ,
      rate: 52,
      width:"40%"
  
    },
    {
      title:"Job Qly Performance",
      value:
      Math.trunc(+( 
      dataReport?dataReport?.percentage_cumulative_quality_target_point_achieved:0

      ))
      
      ,
      rate: 8,
      width:"40%"
    },
    {
      title: 'Job Qty Performance',
      value:
      Math.trunc(+( 
        dataReport?dataReport?.percentage_cumulative_quantity_target_point_achieved:0
      ))
      ,
      rate: 4,
      width:"40%"
    },
    
  ];
    console.log(                
   data,'ee'
    )
       
    return (

      <>
      {dataReport?
      
      <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
      <CardList cardDetails={cardDetails} />
    </Grid>:""
    }
      
      <Table 
      size="sm" 
      variant="striped" borderRadius="lg" 
      // colorScheme='teal'
      overflow="hidden">
              <Thead bg="gray.200">
                <Tr>
                  <Th py="5" style={{"textTransform":"capitalize"}}>
                    Task Name</Th>
                   {/* <Th py="5"   style={{"textTransform":"capitalize"}}>Rountine Round</Th> */}
                   <Th  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>qly point</Th>
                   <Th   style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>qly point achieved</Th>
                   
                   
                   <Th py="5" style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>qty point</Th>
                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>qty point achieved</Th>

                   
                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>(TAT)Point</Th>
                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>(TAT)Point achieved</Th>


                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Total points</Th>
                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Total points achieved</Th>
                   <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Per.Cumm points Achieved</Th>
                   {/* <Th py="5"> PT. ACHIEVED</Th> */}

                  {/* <Th py="5">Start TIme</Th>
                  <Th py="5">End Time</Th>
                  <Th py="5"></Th> */}
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
                              <Td style={{"textAlign":"center"}}>{item.quality_target_point}</Td>
                              <Td style={{"textAlign":"center"}}>{item.quality_target_point_achieved}</Td>
                             
                              <Td style={{"textAlign":"center"}}>{item.quantity_target_point}</Td>
                              <Td  style={{"textAlign":"center"}}>{item.quantity_target_point_achieved}</Td>
                             

                              <Td style={{"textAlign":"center"}}>{item.turn_around_time_target_point}</Td>
                              <Td style={{"textAlign":"center"}}>{item.turn_around_time_target_point_achieved}</Td>



                              <Td style={{"textAlign":"center"}}>{item.target_point}</Td>
                              <Td style={{"textAlign":"center"}}>{item.target_point_achieved}</Td>
                              <Td style={{"textAlign":"center"}}>{
                              Math.trunc(
                                +item.percentage_cumulative_target_point_achieved
                              )
                              }%</Td>
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
              </>
    )
}

export default HumanPerformanceDataTable





