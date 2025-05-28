import { Grid, Box, Stack,Heading,
   Text, useToast, Tab, Tabs,TabList, TabPanel,TabPanels} from '@chakra-ui/react';
import CardList from '../../../components/CardList';
import axios from '../../../services/api';
import {getMyInfo} from "../../../services/auth.service";
import  moment from 'moment';
import Preloader from '../../../components/Preloader';
import { useState,useMemo, useEffect, useLayoutEffect ,useReducer} from 'react';
import { useErrorHandler } from "react-error-boundary";
import {setTimeFilter} from "../../../services/extraFunctions";
import JDAndInitiatives from '../../strategyDeck/JDAndInitiative';
import Objectives from '../../strategyDeck/Objectives';
import TypeVerifierUserChecker from '../../../utils/UserScreenAuthentication';


interface InititalStateType{
  "activeObjective"?:number;
  "pendingObjective"?:number;
  "closedObjective"?:number;
  "over_dueObjective"?:number;
  quality_performance?:number;
  quantity_performance?:number;
  overall_performace?:number;
  turnaround_time_performance?:number;
}
// type ReducerActionType="updatedObjective"
interface actionInterface{
  type:"updatedObjective"|"fillControledDataForPerfomance",
  payload:InititalStateType
}
const InititalState = {
  "activeObjective":0,
  "pendingObjective":0,
  "closedObjective":0,
  over_dueObjective:0,
  quality_performance:0,
  quantity_performance:0,
  overall_performace:0,
  turnaround_time_performance:0,

}

const Reducer=(state:InititalStateType,{type,payload}:actionInterface)=>{
    switch (type){
      case "updatedObjective":
        return {...state,
          activeObjective:payload.activeObjective,
          pendingObjective:payload.pendingObjective,
          closedObjective:payload.closedObjective,
        }
      case "fillControledDataForPerfomance":
        return {...state,...payload}
      default:
        return state
    }
}
const Corporate = () => {
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [teamData,setTeamData] = useState<any>(null);
  const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
  const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');


  const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
  const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');

  const [data,setData] = useState<any>(null);
  const toast = useToast();
  const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
  const [state,dispatch] = useReducer(Reducer,InititalState)
  const [isCorporateTeamLead,setIsCorporateTeamLead] =useState<null|boolean>(null)
  const org_name = localStorage.getItem('current_organization_short_name');
  const handleError = useErrorHandler();


  const getLoggedInTeamLeadData =async()=>{
    const ORG_NAME = localStorage.getItem('current_organization_short_name');
    if (!ORG_NAME) return
    setIsLoading(true)  
    

        try{
            const response =await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
                  // console.log(response)
                  if(response.data.data.length!==0){
                      let TeamLead = response.data.data[0]
                    
                      setTeamData(
                        
                        TeamLead
                      )
                  }
                  // console.log(Team)
              }   
              catch(err:any){
                  console.log({err})
              }
      
              setIsLoading(false)


}
  const getObjectives = async ()=>{
    // 
    if(!org_name) return
    Promise.allSettled([
      axios.get(`/client/${org_name}/objective/?objective_status=pending&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}`),
      axios.get(`/client/${org_name}/objective/?objective_status=active`),
      axios.get(`/client/${org_name}/objective/?objective_status=closed&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}`),
      // axios.get(`/client/${org_name}/objective/?objective_status=over_due`),
    ])

    .then((results)=>{
      console.log({results})

      dispatch({type:"updatedObjective",payload:{
        "pendingObjective":results[0].status==="fulfilled"?results[0].value.data.count :0,
        "activeObjective":results[1].status==="fulfilled"?results[1].value.data.count :0,
        "closedObjective":results[2].status==="fulfilled"?results[2].value.data.count :0,
        // "over_dueObjective":results[3].status==="fulfilled"?results[3].value.data.count :0,
      }})
    })  
    .catch((err:any)=>{
      console.log
      ({err})
    })

  }

 

  const getPerfomanceRelatedData = async()=>{
    setIsLoading(true)
    try{
      
      const response = await  axios.get(`/client/${org_name}/task/report/team/${teamData?.corporate_level?.uuid}/?dashboard_report=true&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}`)

     if(response.data.data.length!==0){
      const data = response.data.data[0]
      console.log({"performance":data})
      dispatch({type:"fillControledDataForPerfomance",payload:{
        "quality_performance":data.percentage_cumulative_quality_target_point_achieved,
        "quantity_performance":data.percentage_cumulative_quantity_target_point_achieved,
        "overall_performace":data.percentage_cumulative_target_point_achieved,
        "turnaround_time_performance":data.percentage_cumulative_turn_around_time_target_point_achieved,
       

      }})
     }
     else{
      dispatch({type:"fillControledDataForPerfomance",payload:{
        "quality_performance":0,
        "quantity_performance":0,
        "overall_performace":0,
        "turnaround_time_performance":0,


      }})
     }
    setIsLoading(false)
    }
    catch(err:any){
      if(err.response?.status === 401){
        handleError(err);
      }
      else{
    setIsLoading(false)

        // displayError({ title:"Connection Error",description:"we could not get performance data",})
    console.log({err})      
      }
    }


  }

  useLayoutEffect(()=>{
    setTimeFilter({
      "setStart_date_after":setStart_date_after__Future,
      "setStart_date_before":setStart_date_before__Future,
      timeType:"future",
    })

    setTimeFilter({
      "setStart_date_after":setStart_date_after__Past,
      "setStart_date_before":setStart_date_before__Past,
      timeType:"past",
    })
    getLoggedInTeamLeadData()
    getObjectives()
  },[])

  useEffect(()=>{
      if(isCorporateTeamLead){
        getPerfomanceRelatedData()
        
      }
      getObjectives()
  },[isCorporateTeamLead,start_date_before__Future,start_date_after__Future,start_date_before__Past,start_date_after__Past])

  useEffect(()=>{
    if(teamData&&start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past){
      setIsCorporateTeamLead(teamData.uuid?true:false)
      
    }
  },[teamData,])

  
  const cardDetails = [
    {
      title: 'Corporate Pending Objectives',
      value: state.pendingObjective,
      rate: 4,
      width:"20%",
      allow_percent:false
  
    },
    {
      title: 'Corporate Active Objectives',
      value: state.activeObjective,
      rate: 4,
      width:"20%",
      allow_percent:false
  
    },
    
    {
      title: 'Corporate Closed Objectives',
      value: state.closedObjective,
      rate: -12,
      width:"20%",
      allow_percent:false

  
    },
    {
      title: 'Corporate Overall Performance',
      value:`${state.overall_performace?state.overall_performace:0}%`,
      rate: -12,
      width:"20%",
      allow_percent:false

    },
    {
      title: 'Corporate Job Quality Performance',
      value: `${state.quality_performance?state.quality_performance:0}%`,
      rate: -12,
      width:"20%"
  
    },
    {
      title: 'Corporate Job Quantity Performance',
      value: `${state.quantity_performance?state.quantity_performance:0}%`,
      rate: -12,
      width:"20%"
  
    },
    {
      title: 'Corporate Turnaround Time Performance',
      value: `${state.turnaround_time_performance?state.turnaround_time_performance:0}%`,
      rate: -12,
      width:"20%"
  
    },
    
  ];
  return (
    <>
      {isLoading && <Preloader /> }

    {
      (teamData===null&&isCorporateTeamLead===false)?<p>You Not A Corporate Member</p>:
      <Grid gap="4" mb="6" templateColumns="repeat(4, 1fr)">
        <Box gridColumn="span 3">
          <Tabs
          isLazy
          onChange={(currentIndex)=>{
            console.log(currentIndex)
            setTimeFilter({
    currentTab:currentIndex,
              "setStart_date_after":setStart_date_after__Future,
              "setStart_date_before":setStart_date_before__Future,
              timeType:"future",
            })
        
            setTimeFilter({
          currentTab:currentIndex,

              "setStart_date_after":setStart_date_after__Past,
              "setStart_date_before":setStart_date_before__Past,
              timeType:"past",
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
              

{
     [...new Array(6)].map(()=>(
      <TabPanel>
      <CardDetailsComponent cardDetails={cardDetails} />
    </TabPanel>
     ))
}


            </TabPanels>
          </Tabs>

        </Box>
        {/* <Stack spacing="5" color="primary">
          <Box>
            <Text fontWeight="semibold" mb="1">
              Name of Team
            </Text>
            <Text as="small" color="gray.500">
              {teamData?.corporate_level?.name}
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
         
         
        </Stack> */}
      </Grid>
    }
{
  TypeVerifierUserChecker(["admin","super_admin"])?
<>

<Heading as="h2" fontSize="lg">
Objectives
  </Heading><br />
  <Objectives isInObjectivePage={false} />
</>

  :""
}

      {/* <JDAndInitiatives isInInitiaivePage={false} /> */}
    </>
  );
};

export default Corporate;



const CardDetailsComponent=({cardDetails }:{cardDetails:any})=>{



  return (
    <Grid gap="4" mb="6" templateColumns="repeat(2, 1fr)">
        <CardList cardDetails={cardDetails} allow_percent={false}/>
     </Grid>
  )
}