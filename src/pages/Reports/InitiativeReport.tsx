import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,Link,
  Text,
  Flex,
  Stack,Button,Tab, TabList, TabPanel, TabPanels, Tabs
} from "@chakra-ui/react";

import { HiOutlineClipboardList } from 'react-icons/hi';
import AppBar from '../../components/AppBar';
import { useParams  } from 'react-router-dom';
import axios from '../../services/api';
import { useEffect } from 'react';
import CustomDrawer from "../../drawers/CustomDrawer";
import InitiativeReportDetail from "../../drawers/InitiativeReportDetails";



export interface InitiativeReportType{
  "task_id":string;
  "name": string;
  "start_date": string;
  "start_time":string;
  "duration": string;
  "routine_round": string|number;
  "turn_around_time_target_point": string|number;
  "turn_around_time_target_point_achieved": string|number;
  "percentage_turn_around_time_target_point_achieved": string|number;
  "cumulative_turn_around_time_target_point": string|number;
  "cumulative_turn_around_time_target_point_achieved": string|number;
  "percentage_cumulative_turn_around_time_target_point_achieved": string|number;
  "quantity_target_unit":string|number;
  "quantity_target_unit_achieved": string|number;
  "quantity_target_point":string|number;
  "quantity_target_point_achieved": string|number;
  "percentage_quantity_target_point_achieved": string|number;
  "cumulative_quantity_target_point": string|number;
  "cumulative_quantity_target_point_achieved": string|number;
  "percentage_cumulative_quantity_target_point_achieved": string|number;
  "quality_target_point": string|number;
  "quality_target_point_achieved":string|number;
  "percentage_quality_target_point_achieved": string|number;
  "cumulative_quality_target_point": string|number;
  "cumulative_quality_target_point_achieved": string|number;
  "percentage_cumulative_quality_target_point_achieved": string|number;
  "target_point": string|number;
  "target_point_achieved": string|number;
  "percentage_target_point_achieved": string|number;
  "cumulative_target_point": string|number;
  "cumulative_target_point_achieved": string|number;
  "percentage_cumulative_target_point_achieved": string|number;
}


const InitiativeReport=()=>{
    const {initiativeID} = useParams<{"initiativeID":string}>()
    const [initiativeReportData,setInitiativeReportData] = useState<InitiativeReportType[]>();
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const getInitiativeReport =async()=>{
        let org_name = localStorage.getItem('current_organization_short_name')
        if(!org_name) return 
        setIsLoading(true)
        try{

            const resp = await axios.get(`/client/${org_name}/task/report/initiative/${initiativeID}/`)
            console.log(resp.data.data)
            setInitiativeReportData([...resp.data.data])
        }
        catch(err:any){

            console.log(err.response)
        }
        setIsLoading(false)
        


        
    }


    useEffect(()=>{
        getInitiativeReport()
    },[])

      console.log(initiativeReportData,"Stuff")
    return (
<>
{/* <AppBar
        heading="Tasks Deck"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      /> */}

<Tabs colorScheme="primary" isLazy>
        <TabList>
          <Tab fontWeight="bold" fontSize="sm" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineClipboardList size="22px" />
            </Box>
            Initiative Report
          </Tab>
       

        </TabList>

        <TabPanels pt="8">
          <TabPanel p="0">
            {isLoading && <Text>Loading</Text>}
        {initiativeReportData &&<InitiativeReportTabel data={initiativeReportData} />}
          </TabPanel>
    
        </TabPanels>
      </Tabs>
</>


    )
}


export default InitiativeReport;




const InitiativeReportTabel=({data}:{data:InitiativeReportType[]})=>{


console.log(data,'frpm data')
  return (
    <Table 
    size="sm" 
    variant="striped" 
    borderRadius="lg"
    overflow={"scroll"} 

     >
    <Thead bg="gray.200" 
           overflow={"scroll"} 
    
    >
      <Tr style={{"textTransform":"capitalize"}}>
        <Th py="1" 
                fontSize="10px"
        
        >Task Name</Th>
        <Th  fontSize="xx-small">Start Date Start Time</Th>
        <Th  fontSize="xx-small">Duration</Th>
        <Th  fontSize="xx-small">Routine Round</Th>
        <Th  fontSize="xx-small">Turn Around Time Target Point</Th>
        <Th  fontSize="xx-small">Turn Around Time Target Point Achieved</Th>
        <Th  fontSize="xx-small">Percentage Turn Around Time Target Point Achieved</Th>
        <Th></Th>
       
      </Tr>
    </Thead>
    <Tbody>
             {
               data.map((item:InitiativeReportType)=>(

                <Tr style={{"textTransform":"capitalize"}}>
                <Td>
                <Stack>
                {item.name}
                </Stack>
                </Td>


                <Td>{item.start_date}/{item.start_time}</Td>
            <Td>{item.routine_round}</Td>
          <Td>{item.turn_around_time_target_point}</Td>
          <Td>{item.turn_around_time_target_point_achieved}</Td>
          <Td>{item.percentage_cumulative_turn_around_time_target_point_achieved}</Td>
          <Td>view more</Td>
          <Td><CustomDrawer
             showModalBtnText="View" drawerSize="md"
          >
                <InitiativeReportDetail
                  {...item}
                 />
            </CustomDrawer></Td>
          
          </Tr>
               ))
             }

{/* <Tr>
                <Td>
               Get The soup ready
                </Td>


                <Td>3224/444</Td>
            <Td>Wow what the heck</Td>
          <Td>LolWat</Td>
          <Td>Yo THed</Td>
          <Td>DD</Td>
          <Td><CustomDrawer
             showModalBtnText="View" drawerSize="md"
          >
                <InitiativeReportDetail
                  {...VALUE}
                 />
            </CustomDrawer></Td>
          </Tr> */}

    </Tbody>
  </Table>

  )
}