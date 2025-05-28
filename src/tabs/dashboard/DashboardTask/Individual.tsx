import {useToast, Grid, Box, Text, Stack,Tabs, TabList, TabPanels, Tab, TabPanel ,Heading } from '@chakra-ui/react';
import CardList from '../../../components/CardList';
import Card from '../../../components/Card';
import { useEffect, useLayoutEffect, useReducer,useState,useMemo } from 'react';
import moment from "moment";
import axios from '../../../services/api';
import { useErrorHandler } from "react-error-boundary";
import {getMyInfo } from "../../../services/auth.service"
import Preloader from "../../../components/Preloader"
import { EmployeeData } from '../../../redux/employees/employeesAPI';
import TaskListTable from '../../tasks/TaskComponent/TaskListTable';

import {setTimeFilter} from "../../../services/extraFunctions";




interface initialIndividualDataType{
  pendingTask?:number;
  closedTask?:number;
  
  activeTask?:number;
  over_dueTask?:number;
  reworkTask?:number;
  awaitingTask?:number;
  rework_overdue?:number;

  quality_performance?:number;
  quantity_performance?:number;
  overall_performace?:number;
  turnaround_time_performance?:number;
  countLoadedData:number;
}
const initialIndividualData= {
  pendingTask:0,
  closedTask:0,

  activeTask:0,
  over_dueTask:0,
  reworkTask:0,
  awaitingTask:0,
  rework_overdue:0,

  quality_performance:0,
  quantity_performance:0,
  overall_performace:0,
  turnaround_time_performance:0,


  countLoadedData:0,
}
type initialIndividualDataActionType = "fillNotControledDataForTask"|"fillControledDataForTask"|"fillControledDataForPerfomance"
const Reducer=(state:initialIndividualDataType,{type,payload}:{type:initialIndividualDataActionType,payload:initialIndividualDataType})=>{
  switch (type) {
    case 'fillNotControledDataForTask':
      return {...state,
        activeTask:payload.activeTask,
        over_dueTask:payload.over_dueTask,
        reworkTask:payload.reworkTask,
        awaitingTask:payload.awaitingTask,
        rework_overdue:payload.rework_overdue,
        countLoadedData:state.countLoadedData+1
      }
    case 'fillControledDataForTask':
      return {
        ...state,
        pendingTask:payload.pendingTask,
        closedTask:payload.closedTask,
        countLoadedData:state.countLoadedData+1

      }

      case 'fillControledDataForPerfomance':
        return {
          ...state,
          quality_performance:payload.quality_performance,
          quantity_performance:payload.quantity_performance,
          overall_performace:payload.overall_performace,
          turnaround_time_performance:payload.turnaround_time_performance,
          countLoadedData:payload.countLoadedData===1?state.countLoadedData+1:0

        }

    default:
      throw new Error();
  }
}


const Individual = () => {
  const [state,dispatch]=useReducer(Reducer,initialIndividualData)
  const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
  const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');


  const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
  const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');


  const ORG_NAME = localStorage.getItem('current_organization_short_name');
  const handleError = useErrorHandler();
  const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
  const toast =  useToast();
  const [employeeData,setEmployeeData]=useState<null|EmployeeData>(null);
  const [isLoading,setIsLoading] = useState(false);


  // console.log()
  const cardDetails = [
    {
      title: 'My Pending Task',
      value: state.pendingTask,
      rate: 4,
      width:"30%",
      allow_percent:false,
    },
    {
      title: 'My Overdue Task',
      value: state.over_dueTask,
      rate: 4,
      width:"30%"
      ,allow_percent:false,

    },
    {
      title: 'My Completed Task',
      value: state.closedTask,
      rate: -5,
      width:"30%"
      ,allow_percent:false,
      
    },
    {
      title: 'My Active Task',
      value: state.activeTask,
      rate: -5,
      width:"30%"
      ,allow_percent:false,
  
    },
    {
      title: 'My Rework Task',
      value: state.reworkTask,
      rate: -5,
      width:"30%"
      ,allow_percent:false,
  
    },
    {
      title: 'Task Awaiting Rating',
      value: state.awaitingTask,
      rate: -5,
      width:"30%"
      ,allow_percent:false,
  
    },
    {
      title: 'My Rework OverDue Task',
      value: state.rework_overdue,
      rate: -5,
      width:"30%"
      ,allow_percent:false,
  
    },
    {
      title: 'My Overall Performance',
      value: `${state.overall_performace}%`,
      rate: 4,
      width:"30%"
  
    },
    {
      title: 'My Job Quality Performance',
      value: `${state.quality_performance}%`,
      rate: 4,
      width:"30%"
    },
    {
      title: 'My Job Quantity Performance',
      value: `${state.quantity_performance}%`,
      rate: 4,
      width:"30%"
    },
    {
      title: 'My Turnaround Time performance',
      value: `${state.turnaround_time_performance}%`,
      rate: -12,
      width:"30%"
    },
    // {
    //   title: 'My Contribution To Team',
    //   value: 0,
    //   rate: 4,
    //   width:"30%"
    // },
  ];

  const getEmployeeInfo = async()=>{
    if(!ORG_NAME) return 
setIsLoading(true)
try{

    const response  = await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
  console.log({
    "employeeData":response.data.data
  })
    setEmployeeData(response.data.data[0])
}
catch(err:any){

  if(err.response?.status===401){
    handleError(err)
  }
}

      
  }
  const getControledTasks= async ()=>{
    //controlled task are task the tabs affect meaning the dates
    if(!ORG_NAME) return 
    try{
      // ?owner_email=${loggedinUser?.email}&
      const pendingResponseCount =await axios.get(`/client/${ORG_NAME}/task/?task_status=pending&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&owner_email=${loggedinUser?.email}`)
      const closedResponseCount = await axios.get(`/client/${ORG_NAME}/task/?task_status=closed&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&owner_email=${loggedinUser?.email}`)

      console.log({
        pendingResponseCount
      })
        dispatch({type:"fillControledDataForTask",payload:{
          pendingTask:pendingResponseCount.data.count,
          closedTask:closedResponseCount.data.count,
          countLoadedData:1


    
          
        }})
    }
    catch(err:any){
      console.log(err)
      if(err.response?.status === 401){
        handleError(err);
      }
      else{
        displayError({ title:"Connection Error",description:"please connect to a good internet!",})

      }
    }

  }
 
  const displayError=({title,description}:{title:string,description:string})=>{
    toast({
      "title":title,
      "description":description,
      status: "error",
    position: "top",
    duration: 5000,
    isClosable: true,
    })
  } 
 
  const getAllDashBoardDataAreNotAffectedbyTabs = async ()=>{
     Promise.allSettled([
       axios.get(`/client/${ORG_NAME}/task/?owner_email=${loggedinUser.email}&task_status=active`),
       axios.get(`/client/${ORG_NAME}/task/?owner_email=${loggedinUser.email}&task_status=over_due`),
       axios.get(`/client/${ORG_NAME}/task/?owner_email=${loggedinUser.email}&task_status=rework`),
       axios.get(`/client/${ORG_NAME}/task/?owner_email=${loggedinUser.email}&task_status=awaiting_rating`),
       axios.get(`/client/${ORG_NAME}/task/?owner_email=${loggedinUser.email}&task_status=rework_over_due`),
      ])

      .then((results)=>{
        // console.log({results})
        dispatch({type:"fillNotControledDataForTask",payload:{
        "activeTask":results[0].status==="fulfilled"?results[0].value.data.count  :0,                                    
        "over_dueTask":results[1].status==="fulfilled"?results[1].value.data.count:0 ,                                     
        "reworkTask":results[2].status==="fulfilled"?results[2].value.data.count    :0  ,                                
        "awaitingTask":results[3].status==="fulfilled"?results[3].value.data.count :0  ,                                   
        "rework_overdue":results[4].status==="fulfilled"?results[4].value.data.count :0   , 
  countLoadedData:1
        }})

      })
      .catch((err:any)=>{

        console.log(err)
          if(err.response?.status===401){
            handleError(err)
          }else{
        // displayError({ title:"Connection Error",description:"Task Info",})

          }
      })

  }
  const getPerfomanceRelatedData = async()=>{
    
    try{

      const response = await  axios.get(`/client/${ORG_NAME}/task/report/user/${loggedinUser.uuid}/?dashboard_report=True&?start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}`)
     if(response.data.data.length!==0){
      const data = response.data.data[0]
      console.log({"performance":data})
      dispatch({type:"fillControledDataForPerfomance",payload:{
        "quality_performance":data.percentage_cumulative_quality_target_point_achieved,
        "quantity_performance":data.percentage_cumulative_quantity_target_point_achieved,
        "overall_performace":data.percentage_cumulative_target_point_achieved,
        "turnaround_time_performance":data.percentage_cumulative_turn_around_time_target_point_achieved,
        countLoadedData:1

      }})
     }
     else{
      dispatch({type:"fillControledDataForPerfomance",payload:{
        "quality_performance":0,
        "quantity_performance":0,
        "overall_performace":0,
        "turnaround_time_performance":0,
        countLoadedData:1

      }})
     }
      
    }
    catch(err:any){
      if(err.response?.status === 401){
        handleError(err);
      }
      else{
        // displayError({ title:"Connection Error",description:"we could not get performance data",})
        
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
  },[])

  useEffect(()=>{
    getAllDashBoardDataAreNotAffectedbyTabs()
    getControledTasks()
    getPerfomanceRelatedData()
    getEmployeeInfo()
    
    return ()=>{
      // dispatch({type:"fillControledDataForTask",payload:{...initialIndividualData}})
      // dispatch({type:"fillNotControledDataForTask",payload:{...state}})
      dispatch({type:"fillControledDataForPerfomance",payload:{...initialIndividualData}})

    }
  } ,[])

  useEffect(()=>{
    if(start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past){
      // console.log({
      //   start_date_before,start_date_after
      // })
      getControledTasks()
      //this is also controled by the tabs
      getPerfomanceRelatedData()
    }

    return ()=>{
      // dispatch({type:"fillControledDataForTask",payload:{...initialIndividualData}})
        // dispatch({type:"fillNotControledDataForTask",payload:{...initialIndividualData}})
      dispatch({type:"fillControledDataForPerfomance",payload:{...initialIndividualData}})
    
    }
  },[start_date_before__Future,start_date_after__Future,start_date_before__Past,start_date_after__Past])

// console.log(
//   {'dd':state.countLoadedData}
// )
  return (
    <>


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
      {/* //this numbers means that after dispatch is called 5 times then stop the preloader */}
    {/* {state.countLoadedData} */}
    {!(state.countLoadedData>=2) && <Preloader /> }
    <CardListForTab cardDetails={cardDetails} employeeData={employeeData}/>
    </TabPanel>
    ))
  }


  
    </TabPanels>
  
  </Tabs>
  <Heading as="h2" fontSize="lg">
    Task Table
  </Heading>
  <br />
  {(start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past)?
  <TaskListTable isInTaskPage={false} owner_email={loggedinUser.email}
  
  // start_date_before={start_date_before}
  // start_date_after={start_date_after}
   />:""
  }
  </>
  );
};

export default Individual;



const CardListForTab=({cardDetails,employeeData}:{cardDetails:any,employeeData:null|EmployeeData})=>{


// console.log(cardDetails)
  return (


    <Grid gap="7" mb="6" templateColumns="repeat(4, 1fr)">
    <Box gridColumn="span 3">
 
      <Grid templateColumns="repeat(3, 1fr)" gap="4">

        <CardList cardDetails={cardDetails} allow_percent={false}/>



      </Grid>
    </Box>
    <Stack spacing="3" color="primary">
      <Box>
        <Text fontWeight="semibold" mb="1">
          Staff Name
        </Text>
        <Text as="small" color="gray.500">
         {employeeData?.user?.first_name}
        </Text>
      </Box>

      {employeeData?.career_path!==null?

<Box>
<Text fontWeight="semibold" mb="1">
  Grade Level
</Text>
<Text as="small" color="gray.500">
{employeeData?.career_path.level}
</Text>
</Box>:""
      }
      
      <Box>
        <Text fontWeight="semibold" mb="1">
          Work Anniversary Date
        </Text>
        <Text as="small" color="gray.500">
          12-03-2021
        </Text>
      </Box>
      <Box>
        <Text fontWeight="semibold" mb="1">
          Team
        </Text>
        <Text as="small" color="gray.500">
          {employeeData?.corporate_level?.name}
          {employeeData?.department?.name}
          {employeeData?.division?.name}
          {employeeData?.group?.name}
          {employeeData?.unit?.name}
        </Text>
      </Box>
      <Box>
        <Text fontWeight="semibold" mb="1">
          Designation
        </Text>
        <Text as="small" color="gray.500">
          {employeeData?.employee_basic_information?.designation.name}
        </Text>
      </Box>
      {
        employeeData?.employee_employment_information?.upline!==undefined?
        <Box>
        <Text fontWeight="semibold" mb="1">
          Reporting line
        </Text>
        <Text as="small" color="gray.500">
          {`${employeeData?.employee_employment_information?.upline?.first_name} ${employeeData?.employee_employment_information?.upline?.last_name}`}
        </Text>
      </Box>:""
      }

    
    </Stack>
  </Grid>
  )
}