import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { HumanPerformanceDataTablePropsType } from "../HumanPerformanceDataTable"
import OverallTurnaroundTimeReport from "../TaskReportTable/OverallTurnaroundTimeReport/OverallTurnaroundTimeReport"
import AppraisalTaskReport from "../TaskReportTable/AppraisalTaskReport"
import OverallJobQualityReport from "../TaskReportTable/OverallJobQualityReport"
import OverallJobQuatityReport from "../TaskReportTable/OverallJobQuatityReport"
import CardList from "../CardList"


type Prop = {
    data:HumanPerformanceDataTablePropsType[];
    dataReport?:any;
}


const TaskReportBreakDown = ({data,dataReport}:Prop):React.ReactElement=>{
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


    return (
<Box>
{dataReport?
      
      <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
      <CardList cardDetails={cardDetails} />
    </Grid>:""
    }
    <Tabs
    colorScheme="primary" isLazy
    >

        <TabList>
            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                    Appraisal report
            </Tab>

            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                Overall Turnaround Time Report
            </Tab>

            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                Overall Job Quality Report
            </Tab>

            <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="10">
                Overall Job Quantity Report
            </Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                <AppraisalTaskReport data={data}/>
            </TabPanel>


            <TabPanel>
                <OverallTurnaroundTimeReport data={data}/>
            </TabPanel>

            <TabPanel>
                <OverallJobQualityReport data={data} />
            </TabPanel>

            <TabPanel>
                <OverallJobQuatityReport data={data} />
            </TabPanel>
        </TabPanels>
    </Tabs>
</Box>
    )
}

export default TaskReportBreakDown