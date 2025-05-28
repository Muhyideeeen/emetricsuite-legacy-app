import { Grid, Box, 
  Heading,
  Stack, Text, useToast,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CardList from '../../../components/CardList';
import axios from '../../../services/api';
import {getMyInfo} from "../../../services/auth.service";
import  moment from 'moment';
import Preloader from '../../../components/Preloader';
import { useState,useMemo, useEffect, useLayoutEffect } from 'react';
import {setTimeFilter} from "../../../services/extraFunctions";
import { useErrorHandler } from "react-error-boundary";
import TaskListTable from '../../tasks/TaskComponent/TaskListTable';


const Team = () => {
  const handleError= useErrorHandler()
  
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [teamData,setTeamData] = useState<any>();
  const [start_date_before,setStart_date_before] = useState<string>('');
  const [start_date_after,setStart_date_after] = useState<string>('');
  const [data,setData] = useState<any>(null);
  const toast = useToast();
  const loggedinUser:any= getMyInfo();
  const getLoggedInTeamLeadUUID =async()=>{
    const ORG_NAME = localStorage.getItem('current_organization_short_name');
    if (!ORG_NAME) return
    setIsLoading(true)  
    

        try{
            const response =await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
                  // console.log(response)
                  if(response.data.data.length!==0){
                      let TeamLead = response.data.data[0]
                    console.log({
                      TeamLead
                    })
                      setTeamData(
                        
                        TeamLead
                      )
                  }
                  // console.log(Team)
              }   
              catch(err:any){
                  console.log(err)
                  if(err.response.status==401){
                    handleError(err)
                  }
                }
      
              setIsLoading(false)


}

const getTeamReport =async () => {
  const org_name = localStorage.getItem("current_organization_short_name");
  if(!org_name) return
  let Team = teamData.corporate_level||teamData.department||teamData.division||teamData.group||teamData.unit

  const url =`/client/${org_name}/task/report/team/${Team.uuid}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&dashboard_report=True`
  console.log({'team_report':url})
  setIsLoading(true)

  try{
     const resp = await axios.get(url)
     console.log({'team_report_resp':resp})

     setData(resp.data.data.length===0?[]:resp.data.data[0])
    }catch(err:any){
        console.log(err)
  }
  setIsLoading(false)
}


useLayoutEffect(()=>{
  
  setTimeFilter({
    setStart_date_after,
    setStart_date_before,
    timeType:"past"
  })
},[])
useEffect(()=>{
  //on load of the page get TeamLead uuid that is what we get his team report
  getLoggedInTeamLeadUUID();
},[])

useEffect(()=>{
if(teamData&&start_date_before&&start_date_after){

  getTeamReport()
}
},[teamData,start_date_before,start_date_after])



const cardDetails = [
  {
    title: 'Team Performance Score',
    value:data?.percentage_cumulative_target_point_achieved,
    rate: 4,
    width:"20%"

  },
  
  
  {
    title: 'Team Task Turn-around Time',
    value: data?.percentage_cumulative_turn_around_time_target_point_achieved,
    rate: 4,
    width:"20%"

  },
  {
    title: 'Team Job Quality Score',
    value: data?.percentage_cumulative_quality_target_point_achieved,
    rate: -5,
    width:"20%"

  },
  {
    title: 'Team Job Quantity Score',
    value: data?.percentage_cumulative_quantity_target_point_achieved,
    rate: 4,
    width:"20%"

  },
];
console.log(data,'s')
  return (
    <>
      {isLoading && <Preloader /> }

  
      <Grid gap="4" mb="6" templateColumns="repeat(4, 1fr)">
        <Box gridColumn="span 3">
        <Tabs
        
        isLazy
    onChange={(currentIndex)=>{
      console.log(currentIndex)
      setTimeFilter({
        currentTab:currentIndex,
        setStart_date_after,
        setStart_date_before,
        timeType:"past"
      })
    }}
     >
        <TabList>
        <Tab>Day</Tab>
      <Tab>Week</Tab>
      <Tab>Month</Tab>
      <Tab>Quarter</Tab>
      <Tab>Bi-Annual</Tab>
      <Tab>Annual</Tab>
    </TabList>


     
    <TabPanels>
        {/* //this numbers means that after dispatch is called 5 times then stop the preloader */}

{
  [...new Array(6)].map(()=>(
    <TabPanel>

<CardListForTab cardDetails={cardDetails} />
      </TabPanel>
  ))
}

    </TabPanels>

        </Tabs>
        </Box>
        <Stack spacing="5" color="primary">
          <Box>
            <Text fontWeight="semibold" mb="1">
              Name of Team
            </Text>
            <Text as="small" color="gray.500">
    
            {teamData?.corporate_level&& teamData?.corporate_level.name}
            {teamData?.department&& teamData?.department.name}
            {teamData?.division&& teamData?.division.name}
            {teamData?.unit&& teamData?.unit.name}
            {teamData?.group&& teamData?.group.name}
              </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Grade Level
            </Text>
            <Text as="small" color="gray.500">
              5
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Reporting line
            </Text>
            <Text as="small" color="gray.500">
              
            {`${teamData?.employee_employment_information?.upline?.first_name} ${teamData?.employee_employment_information?.upline?.last_name}`}

            </Text>
          </Box>
          {/* <Box>
            <Text fontWeight="semibold" mb="1">
              Performance Points Target
            </Text>
            <Text as="small" color="gray.500">
              100
            </Text>
          </Box> */}
        </Stack>
      </Grid>

      {(start_date_before&&start_date_after)?
      <>
        <Heading as="h2" fontSize="lg">
    Task Table
  </Heading>
  <TaskListTable isInTaskPage={false} owner_email={loggedinUser.email}
  isGet_allTeamMemberTask={true}
  
  // start_date_before={start_date_before}
  // start_date_after={start_date_after}
   />
      </>
 :""
  }
    </>
  );
};

export default Team;



const CardListForTab=({cardDetails}:{cardDetails:any,})=>{


  return (
    <Grid gap="4" mb="6" templateColumns="repeat(2, 1fr)">
    <CardList cardDetails={cardDetails} />
  </Grid>
  )
}