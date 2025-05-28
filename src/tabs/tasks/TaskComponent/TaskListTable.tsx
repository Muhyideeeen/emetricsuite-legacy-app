import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
    Box,
    Text,
    Grid,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    IconButton,
    Stack,
    Flex,Tabs,TabList,Tab,TabPanel,
    TabPanels,useDisclosure,Button,useToast, Checkbox
  } from '@chakra-ui/react';
import { useEffect,useMemo } from 'react';
  import { HiDotsHorizontal, HiOutlinePlus } from 'react-icons/hi';
  import { Link as ReactRouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { deleteTask, } from '../../../redux/Task/taskAPI';
import { selectTask } from '../../../redux/Task/taskSlice';
import {Task} from "../../../redux/Task/taskSlice"
import { useState ,useLayoutEffect} from 'react';
import { getLoggedin_userEmail } from '../../../services/auth.service';
import CustomDrawer from '../../../drawers/CustomDrawer';
import TaskDetailDrawers from "../../../drawers/TaskDetailDrawers"
import { useErrorHandler } from 'react-error-boundary';
import TypeVerifierUserChecker from "../../../utils/UserScreenAuthentication";
import RateTaskModal from '../../../modal/task/RateTaskModal';
import ReworkTaskModl from "../../../modal/task/ReworkTaskModal";
import {getMyInfo} from "../../../services/auth.service";
import {GrFormPreviousLink,GrFormNextLink} from "react-icons/gr";
import { setTimeFilter,createDanloadAbleFile } from '../../../services/extraFunctions';
import axios from '../../../services/api';
import Preloader from '../../../components/Preloader';
import CardList from '../../../components/CardList';
import { number } from 'yup';
import PaginatedItems from '../../../components/Pagination/Pagination';
import { selectTaskSummary, updateTaskSummaryState } from '../../../redux/TaskSummary/TaskSummarySlice';


const TaskTable = ({ tasks,currentTabNumber =0,
  LoadingTask=false
  ,pageNum,
  setPageNum
  ,nextPage,
  page_count,
  previousPage,ReduxTaskstatus,dispatch

}:{
    tasks:any,
    currentTabNumber:number,
    LoadingTask:boolean,
    pageNum:number,
    nextPage?:boolean,
    previousPage?:boolean,
    setPageNum:(e:number)=>void,
    ReduxTaskstatus:string;
    dispatch:(arg:any)=>void;
    page_count:number;
  })=>{
    const tabsStatusObj:any={
      0:"pending",
      1:"active",
      2:"over_due",
      3:"awaiting_rating",
      4:"rework",
      5:"rework_over_due",
      6:"closed",
    
    }
  type statusType= "pending"|"active"|"over_due"|"awaiting_rating"|"rework"|"rework_over_due"|"closed";
  const [status,setStatus] = useState<statusType>(tabsStatusObj[currentTabNumber]);
    const [isLoading,setIsLoading] = useState(false)
  const logginUserData:any= useMemo(()=>getMyInfo(),[])
  const toast = useToast()


  // console.log({"logginUserData":logginUserData.uuid})
  // console.log({
  //   "tasks":tasks
  // })
// useEffect(()=>{

// setStatus(tabsStatusObj[currentTabNumber])
// },[currentTabNumber])
// console

   
// useEffect(()=>{

// },[ReduxTaskstatus])

const handleDelete = async(data:{
  routine_option:string,taskID:string
})=>{

  const ORG_NAME = localStorage.getItem("current_organization_short_name");
  let is_recurring = false
  if(!ORG_NAME) return 
  if(window.confirm("Are You Sure You want to delete")){
    // if(window.confirm(''))
    if(data.routine_option!=='once'){
      //if it not once ask the user if you only want to delete this item or following re-coocuring item
      if(window.confirm('Do you only want to delete this item and following re-coocuring item ')){
        console.log("deleted task",data,'delete re-occuring')
        is_recurring=true
      }else{
        //i just want to delete one out of the re-occuring
        console.log("deleted task",data,'delete once')
      }

    }else{
      console.log("deleted task",data,'delete once')
    }
  }
  setIsLoading(true)
  console.log("Renderer")
  try {
    const resp = await axios.delete(`/client/${ORG_NAME}/task/${data.taskID}/${is_recurring?'?recurring=True':''}`)
    console.log({'deleted data task':resp})
    setIsLoading(false)
    if(resp.status===204){
      toast({
        title: 'Deleted Successfully',
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      })

      setTimeout(()=>{
        window.location.reload()
      },2000)
    }
  } catch (err:any) {
    setIsLoading(false)
    
    console.log({err})
    if(err.response.status==404){
      toast({
        title: 'Deleted Succefully',
        status: 'error',
        position: "top",
        duration: 3000,
        isClosable: true,
      })  
      
      setTimeout(()=>{
        window.location.reload()
      },2000)
    }else{
      toast({
        title: 'Some Error Occured Successfully',
        status: 'error',
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    }
  }

}
  return (
    <>

{tasks.length!=0?
    
      <Table size="sm" 
      // variant="unstyled" 
      borderRadius="lg" d="block" overflow="scroll"
      // border-collapse={"collapse"}
      variant='striped' 
      style={{"width":"100%"}}
      >
     
      <Thead bg="gray.200" >
        <Tr style={{"textTransform":"capitalize"}}>
          <Th></Th>
          <Th 
          //  px="5"
          // paddingRight={"30px"}
           px={"0"}  textTransform={"capitalize"}>
            Task Name
          </Th>

          <Th  px={"0"}  textTransform={"capitalize"}>
            Task Type
          </Th>

          <Th  px={"0"}  textTransform={"capitalize"}>
             {/* Start Date and Start Time */}
             Start Time
          </Th>
          <Th   px={"0"}  textTransform={"capitalize"}>
            Routine Option
          </Th>
          {/* <Th fontWeight="bold" px="3">
            Routine Round
          </Th> */}
          <Th  px={"0"}  textTransform={"capitalize"}>
             Brief
          </Th>
          <Th     textTransform={"capitalize"}>
            {/* QlyTP */}
             QlyTarget point
          </Th>

          <Th     textTransform={"capitalize"}>
            {/* QtyTU */}
            QtyTarget Unit
          </Th>
          <Th     textTransform={"capitalize"}>
            {/* QtyTP */}
            QtyTarget Point
          </Th>
          <Th  px={"0"}  textTransform={"capitalize"}>Status</Th>
        
          <Th></Th>
        </Tr>
       
      </Thead>
      <Tbody>
  {
       tasks
       //we dont need to filter by status again we handled that already with the getTask function
       .map((task:any, index:number) => (
        <Tr >
          <Td>
            <Checkbox disabled={status==='closed'}/>
          </Td>
          <Td>
            <Text fontSize="xs" >
              {task.name } ({task.routine_round})
             
            </Text>
          </Td>
        
          <Td >
            <Text>
              {task.task_type==="quantitative_and_qualitative"?"Quantitative And Qualitative":""}
              {task.task_type==='qualitative'?"Qualitative":""}
              {task.task_type==='quantitative'?"Quantitative":""}
            </Text>
          </Td>                

          <Td > 
            <Text>{task.start_date}</Text>
            <Text>{task.start_time}</Text>
          </Td>

          <Td >
            <Text>{task.routine_option}</Text>
          </Td>                
        
          {/* <Td fontSize="xs" px="3">
            <Text>{task.routine_round?task.routine_round:"No Routine Round"}</Text>
          </Td>    */}

          <Td >
          <a 
          // href={encodeURIComponent(createDanloadAbleFile(task.target_brief))}
          href={task.target_brief}
            style={{
              "color":task.target_brief?"blue":"gray",
              cursor:"pointer"
            }}
            rel="nofollow noreferrer" download
            >
              
          Download Brief
            </a>
          </Td>
          <Td >
           {task.quality_target_point}
          </Td>
          <Td >
            {task.quantity_target_unit}
          </Td>
          <Td >
           {task.quantity_target_point}
          </Td>
          {/* <Td fontSize="xs" px="3">
            {task.average_system_based_score}
          </Td> */}
          <Td style={{"textAlign":"center",}} >
              <Text  
              fontSize={"small"}
              style={{"textAlign":"center",
              // 
              "backgroundColor":(task.task_status==="active")?"#0ba30bd":(task.task_status==="closed")?"red":"#D97706",
              "color":"whitesmoke","padding":".2rem 0","borderRadius":"5px"}}>
              {task.task_status.replace("_"," ")}
              </Text>
          </Td>

          <Td cursor="pointer" px="3">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HiDotsHorizontal />}
                variant="outline"
              />
              <MenuList>
                <CustomDrawer showModalBtnText="View" drawerSize="md">
                {/* <p>Hello world</p> */}
                <TaskDetailDrawers 
                {...task}
                />
                </CustomDrawer>

          {/* {
            logginUserData===false?//this means the user needs to relogin to get this data
            "":

            (
              logginUserData?.user_id===task.upline_initiative.owner.user_id?"u cant submit ur task":

              <MenuItem to={`/dashboard/submit-task/${task.task_id}/${task.rework_limit}/${task.task_type}/${task.name}`} as={ReactRouterLink}>
                Submit
              </MenuItem>
            )   } */}

<MenuItem                                                                          //if it is inside this list allow submssion
isDisabled={!((task.upline_initiative.owner?.user_id ===logginUserData.uuid)&&(["over_due","rework","rework_over_due","active"].includes(status)))}
to={`/dashboard/submit-task/${JSON.stringify(task.upline_initiative.owner?.user_id ===logginUserData.uuid)}/${task.task_id}/${task.rework_limit}/${task.task_type}/${encodeURIComponent(task.name)}`} as={ReactRouterLink}>
                Submit
              </MenuItem>


              <MenuItem  
              // (task.upline_initiative.owner?.user_id ===logginUserData.uuid)&&                                                                        //if it is inside this list allow submssion
isDisabled={!((["over_due","rework","rework_over_due",'awaiting_rating','closed'].includes(status)))}
//encodeURIComponent help me fix the URIError-> there was a percentage in the task.name
to={`/dashboard/submit-task/${JSON.stringify(task.upline_initiative.owner?.user_id ===logginUserData.uuid)}/${task.task_id}/${task.rework_limit}/${task.task_type}/${encodeURIComponent(task.name)}`} as={ReactRouterLink}>
                List Of Submitted task
              </MenuItem>

                  
<>
                  {/* <MenuItem 
                  onClick={onOpen}

                  >Rate</MenuItem> */}
                  
                 
                  {/* <Button size="sm"
                  leftIcon={<RiSendPlaneFill />}
                  variant="primary"
                  // disabled={item?.used_submission?false:true}
                  >
                  Submit Task
          </Button> */}

        <RateTaskModal 
        
        task_id={task.task_id} task_type={task.task_type}
        isOwner={(task.upline_initiative?.owner?.user_id ===logginUserData.uuid)}
        isCorporateTeamLead={(task.upline_initiative.assignor === null)}
        status={status}
        quantity_target_point={task.quantity_target_point}
        quality_target_point ={task.quality_target_point}

        
        />


           
            </>
            <ReworkTaskModl
      isOwner={(task.upline_initiative?.owner?.user_id ===logginUserData.uuid)}
      isCorporateTeamLead={(task.upline_initiative.assignor === null)}
      status={status}
      task_id={task.task_id} task_type={task.task_type} rework_num={task.rework_limit} />

      <MenuItem
      // type="submit"
      // form="rate-task"
      // @ts-ignore
      variant="ghost"
      w="full"
      isDisabled={true}

      >
      Edit
      </MenuItem>
      
      <MenuItem
      // @ts-ignore
      variant="ghost"
      style={{'color':'red'}}
       w="full"
       isDisabled={task.upline_initiative?.owner?.user_id ===logginUserData.uuid}
       onClick={(e)=>{
        handleDelete({'taskID':task.task_id,'routine_option':task.routine_option})
       }}
      >
        Delete
      </MenuItem>

{/* <MenuItem

  disabled={!(task.upline_initiative?.owner?.user_id ===logginUserData.uuid)}
  onClick={()=>{
    let org_name = localStorage.getItem("current_organization_short_name")
    if(!org_name) return
    dispatch(deleteTask({"ORG_NAME":org_name,uuid:task.task_id}))
  }}
  >
    
    {ReduxTaskstatus==="deleting"?"Deleteing":"Delete"}
 
  </MenuItem> */}

              </MenuList>
              
            </Menu>
          </Td>
          
        </Tr>
      ))
     
     
     } 
     </Tbody>
    </Table>
    :<Text></Text> 
  }

    {/* <br />
<Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button> */}
    {/* </Box> */}

{/* page_count */}
<br />

<Box>

<PaginatedItems 
  pageCount={page_count}
  onPageClick={(pageNumberClicked)=>{
    console.log(pageNumberClicked)
    setPageNum(pageNumberClicked)
  }}
/>
</Box>

    </> 
    )
}

type TaskListTableType ={

  owner_email:string|boolean,
  isInTaskPage?:boolean,
  isGet_allTeamMemberTask?:boolean,
  admin_lookUp?:string
  useLookup?:boolean
}
const TaskListTable = ({ owner_email ,
  isInTaskPage=true,
  isGet_allTeamMemberTask=false,
  admin_lookUp,useLookup=false }:TaskListTableType)=>{
  const handleError = useErrorHandler()
    const dispatch = useAppDispatch();
    //for paginated button
  const [pageNum,setPageNum] = useState(1);
    const {status,
      // tasks,message,errorMessage,
      count:NumOfData,
    
      // next:nextPage, commented this cus am not using this
      // previous:previousPage
    
    } = useAppSelector(selectTask)
    const taskSummaryState = useAppSelector(selectTaskSummary)

    const [nextPage,setNextPage] = useState(false);
    const [previousPage,setPreviousPage] = useState(false);
    const [pageCount,setPageCount] = useState(0)
    const [TabStatusIndex,setStatusTabIndex]= useState<number>(1)
    const [LoadingTask,setLoadingTask] =useState<boolean>(false)
    const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
  const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');


  const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
  const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');

    // const [currentTab]
    const [tasks,setTasks]= useState<Task[]>([])

    const org_name=localStorage.getItem('current_organization_short_name');

    const [isLoading,setIsLoading]=useState<boolean>(false);

    



    const getTask  = async ({statusNum=0}:{statusNum?:number})=>{
        //this just get an email either well .. the logged in user or some one email whic was passed as a prop or somthing
      let SafeOwnerEmail =owner_email?owner_email:getLoggedin_userEmail()
      console.log({SafeOwnerEmail})
    
      if(TypeVerifierUserChecker(["admin","super_admin",'admin_hr'],"client_tokens")){
       if(admin_lookUp){
        //if the admin wants to use look up then set override the SafeOwnerEmail to the lookup
        SafeOwnerEmail =admin_lookUp
       }else{

         SafeOwnerEmail=""
       }
      }
      if(!org_name) return 

const tabsStatusObj:any={
  0:"pending",
  1:"active",
  2:"over_due",
  3:"awaiting_rating",
  4:"rework",
  5:"rework_over_due",
  6:"closed",

}

      // /client/${org_name}/task/?owner_email=${owner_email}&start_date_before=${start_date_before}&start_date_after=${start_date_after}&page=${pagenum}
  //if none of the if statement is true the this is a Active status
let url ="we look it task depending on the status"

if(tabsStatusObj[statusNum]){
  // else just take the type as long as it not pending and closed
  if(useLookup){
    url =`/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}${admin_lookUp}&page=${pageNum}`
  }else{
    url =`/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}&${
     isGet_allTeamMemberTask?"assignor_email":"owner_email"
    }=${SafeOwnerEmail}&page=${pageNum}`

  }


}


  if(tabsStatusObj[statusNum]==="closed"){
    if(useLookup){
      url = `/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}${admin_lookUp}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
    }else{
      url = `/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}&${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
       }=${SafeOwnerEmail}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
    }

    }
  if(tabsStatusObj[statusNum]==="pending"){
    if(useLookup){
      url = `/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}${admin_lookUp}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`
    }else{
      url = `/client/${org_name}/task/?task_status=${tabsStatusObj[statusNum]}&${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
       }=${SafeOwnerEmail}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`
    }

  }
  
 

  setIsLoading(true)
  if(tabsStatusObj[statusNum] =="closed"){
      if(!(start_date_before__Past&&start_date_after__Past)){
        return
      }
  }

  if(tabsStatusObj[statusNum] =="pending"){
    if(!(start_date_before__Future&&start_date_after__Future)){
      return
    }
}


console.log({
  url
  })
  try {
  
      // url=`/client/${ORG_NAME}/objective/?objective_status=${ObjectiveStatus[statusNum]}&page=${pageNum}`

  
    const response = await axios.get(url);
    
    // set the Objective Wegot
    
    setTasks(response.data.data)
    console.log({"currentTabName":tabsStatusObj[statusNum]},statusNum)
    
    setNextPage(response.data.next==null?false:true)
    setPreviousPage(response.data.previous==null?false:true)
    setPageCount(response.data.page_count)


  } catch (err: any) {
    
    if(err.response.status==401){
      handleError(err)
    }
    return err.response;
  }

  setIsLoading(false)


    }




    const getAllDashBoardDataAreNotAffectedbyTabs = async ()=>{
    //this just get an email either well .. the logged in user or some one email whic was passed as a prop or somthing
    let SafeOwnerEmail =owner_email?owner_email:getLoggedin_userEmail()
    if(TypeVerifierUserChecker(["admin","super_admin"],"client_tokens")){
      if(admin_lookUp){
        //if the admin wants to use look up then set override the SafeOwnerEmail to the lookup
        SafeOwnerEmail =admin_lookUp
       }else{

         SafeOwnerEmail=""
       }
    }
    let pendingUrl = 'this url am using it in the dashboard function'
    let closedUrl = 'this url am using it in the dashboard function'
    let activeUrl = ''
    let over_dueUrl=''
    let awaiting_ratingUrl=''
      ///this url closedUrl and pendingUrl are for the funtion that get data and fill it on our task dashboard that appears in the 
    if(useLookup){
      closedUrl =`/client/${org_name}/task/?task_status=closed${admin_lookUp}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
      
       pendingUrl = `/client/${org_name}/task/?task_status=pending${admin_lookUp}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`

       activeUrl=`/client/${org_name}/task/?me=1${admin_lookUp}&task_status=active`

       over_dueUrl=`/client/${org_name}/task/?me=1${admin_lookUp}&task_status=over_due`
       awaiting_ratingUrl=`/client/${org_name}/task/?me=1${admin_lookUp}&task_status=awaiting_rating`

    }else{

      awaiting_ratingUrl=`/client/${org_name}/task/?${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
        }=${TypeVerifierUserChecker(["admin","super_admin"],"client_tokens")?`${admin_lookUp?admin_lookUp:''}`:owner_email}&task_status=awaiting_rating`


      over_dueUrl=`/client/${org_name}/task/?${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
        }=${TypeVerifierUserChecker(["admin","super_admin",'admin_hr'],"client_tokens")?`${admin_lookUp?admin_lookUp:''}`:owner_email}&task_status=over_due`


      activeUrl=`/client/${org_name}/task/?${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
        }=${TypeVerifierUserChecker(["admin","super_admin",'admin_hr'],"client_tokens")?`${admin_lookUp?admin_lookUp:''}`:owner_email}&task_status=active`

      closedUrl =`/client/${org_name}/task/?task_status=closed&${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
       }=${SafeOwnerEmail}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
      
       pendingUrl = `/client/${org_name}/task/?task_status=pending&${
        isGet_allTeamMemberTask?"assignor_email":"owner_email"
       }=${SafeOwnerEmail}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`

    }

   console.log({
    activeUrl,pendingUrl,closedUrl,awaiting_ratingUrl,
   })

    Promise.allSettled([
axios.get(activeUrl),

axios.get(over_dueUrl),
axios.get(pendingUrl),
axios.get(closedUrl),
axios.get(awaiting_ratingUrl)
])
      //in this promise function that is getting the exception is if it a admin that has logged in he can use lookup variable else we just user the owner email
 
       .then((results)=>{
      dispatch(updateTaskSummaryState({'taskType':'active',count:results[0].status==="fulfilled"?results[0].value.data.count:0}))
      dispatch(updateTaskSummaryState({'taskType':'over_due',count:results[1].status==="fulfilled"?results[1].value.data.count:0}))
      dispatch(updateTaskSummaryState({'taskType':'pending',count:results[2].status==="fulfilled"?results[2].value.data.count:0}))
      dispatch(updateTaskSummaryState({'taskType':'completed',count:results[3].status==="fulfilled"?results[3].value.data.count:0}))
      dispatch(updateTaskSummaryState({'taskType':'awaiting',count:results[4].status==="fulfilled"?results[4].value.data.count:0}))


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

  
  useEffect(()=>{
  getAllDashBoardDataAreNotAffectedbyTabs()
},[start_date_before__Future,start_date_after__Future,
  start_date_before__Past,start_date_after__Past,admin_lookUp])



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

    // we get the task here depening on the tab we filter
  useEffect(()=>{
    // const owner_email = getLoggedin_userEmail()
  
    if(org_name&&owner_email
      ){
      // console.log(start_date_before,start_date_after,'from TaskList Table')
      // dispatch(getTasks({ org_name,owner_email:owner_email?owner_email:getLoggedin_userEmail(),handleError,
      //   "start_date_before":start_date_before,"start_date_after":start_date_after,
      //   "pagenum":pageNum,
      // }))
      
      getTask({"statusNum":TabStatusIndex})
    }
    if(org_name&&admin_lookUp
      ){
      // console.log(start_date_before,start_date_after,'from TaskList Table')
      // dispatch(getTasks({ org_name,owner_email:owner_email?owner_email:getLoggedin_userEmail(),handleError,
      //   "start_date_before":start_date_before,"start_date_after":start_date_after,
      //   "pagenum":pageNum,
      // }))
      
      getTask({"statusNum":TabStatusIndex})
    }
    else{
      setLoadingTask(false)

    }
  },[owner_email,
    start_date_before__Future,start_date_after__Future,
    start_date_before__Past,start_date_after__Past,pageNum,
    TabStatusIndex,admin_lookUp
  ])

  useEffect(()=>{
    const taskTabIndex = localStorage.getItem('taskTabIndex');
    if(taskTabIndex){
      setStatusTabIndex(JSON.parse(taskTabIndex))
    }
  },[])
  
    return (
        <>
     <br/>
        {
          isInTaskPage?
          <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
          <CardList allow_percent={false} cardDetails={
[
{
  title: 'My Pending Task',
  value: taskSummaryState.pending,
  rate:taskSummaryState.pending,
  allow_percent:false
},
{
  title: 'My Active Task',
  value: taskSummaryState.active,
  rate: taskSummaryState.active,
  allow_percent:false
},
{
  title: 'My Overdue Task',
  value: taskSummaryState.over_due,
  rate: taskSummaryState.over_due,
  allow_percent:false
},
{
  title: 'My Awaiting Rating Task',
  value: taskSummaryState.awaiting,
  rate: taskSummaryState.awaiting,
  allow_percent:false
},

{
  title: 'My Completed Task',
  value: taskSummaryState.completed,
  rate: taskSummaryState.completed,
  allow_percent:false
},
// {
//   title: 'My Work In Progress Task',
//   value: 10,
//   rate: 4,
// },
]


          } />
        </Grid>
          :""
        }
   

        

{isLoading &&    <Preloader />}
        <Tabs
      
        isLazy
        onChange={(currentTimeFilterIndex)=>{
  setPageNum(1)//everu time a tab is chage get page one of the new tab

          setTimeFilter({
            currentTab:currentTimeFilterIndex,
            "setStart_date_after":setStart_date_after__Future,
            "setStart_date_before":setStart_date_before__Future,
            timeType:"future",
          })
        
          setTimeFilter({
            currentTab:currentTimeFilterIndex,
            "setStart_date_after":setStart_date_after__Past,
            "setStart_date_before":setStart_date_before__Past,
            timeType:"past",
          })
        }}
        >

<TabList  
        
>
  {
    ["Day","Week","Month","Quarter","Bi-Annual","Annual"].map((word,index)=>(

      <Tab isDisabled={isLoading} key={index}>{word}</Tab>
    ))
  }
      {/* <Tab>Week</Tab>
      <Tab>Month</Tab>
      <Tab>Quarter</Tab>
      <Tab>Bi-Annual</Tab>
      <Tab>Annual</Tab> */}
    </TabList>


    <TabPanels>
          {
             [...new Array(6)].map(()=>(




              <TabPanel>





<Tabs 
isLazy
//  defaultIndex={1}
index={TabStatusIndex}
 colorScheme={'blue'}
isFitted variant='enclosed' onChange={(currenttabIndex)=>{
  localStorage.setItem('taskTabIndex',JSON.stringify(currenttabIndex))
  setPageNum(1)//everu time a tab is chage get page one of the new tab
  setStatusTabIndex(currenttabIndex)
}}>
  <TabList mb='1em' >
   {/*   */}
    {
      ["Pending","Active","Over Due","Awaiting Rating","Rework",
    "Rework Over Due","Closed"
    ].map((taskStatus,index)=>(

        <Tab 
        isDisabled={isLoading} 
        // disabled={isLoading}
        style={{"color":isLoading?"gray":""}}
        key={index}>{taskStatus}</Tab>
      ))
    }
        {/* <Tab >Pending</Tab>tabIndex = 0 */}
    {/* <Tab>Active</Tab>tabIndex = 1
    <Tab>Over Due</Tab>2
    <Tab>Awaiting Rating</Tab>tabIndex = 3
    <Tab>Rework</Tab>tabIndex = 4
    <Tab>Rework Over Due</Tab>tabIndex = 5
    <Tab>Closed</Tab>tabIndex = 6 */}
    {/* tabIndex = 7 */}
    
  </TabList>
  <TabPanels>


      {
        [...new Array(7)].map(i=>
          <TabPanel>
          {/* navigate up to see the table */}
            {/* 
            pending -0 represtents Pending
            */}
         
            <TaskTable 
            tasks={tasks} 
            LoadingTask={LoadingTask} 
             currentTabNumber={TabStatusIndex}
             page_count={pageCount}
             pageNum={pageNum}
             setPageNum={setPageNum}
             nextPage={nextPage}
             previousPage={previousPage}
           ReduxTaskstatus={status}
           dispatch={dispatch}
             />
          </TabPanel>
          )
      }

    
   

  </TabPanels>
</Tabs>


</TabPanel>








             ))
          }
</TabPanels>

        </Tabs>

        


      </>
    )
}


export default TaskListTable
