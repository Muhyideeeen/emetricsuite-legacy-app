/*

Start Date ->start_date_after
end Date  -> start_date_before
*/
import { useEffect,useLayoutEffect } from "react";
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
  Button,
  Flex,useToast,
  Stack,Select,Checkbox,
  Tabs,TabList,Tab,TabPanel,TabPanels,
} from "@chakra-ui/react";
import { useErrorHandler } from "react-error-boundary";
import { HiOutlinePlus } from "react-icons/hi";
import AddObjective from "../../drawers/AddObjective";
import CustomDrawer from "../../drawers/CustomDrawer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {  deleteBulkObjective, deleteObjective} from "../../redux/objective/objectiveAPI";
import { selectObjective } from "../../redux/objective/objectiveSlice";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';

import { v4 as uuid_v4 } from "uuid";
import UploadObjectives from "../../drawers/UploadObjective";
import { useState } from "react";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import { Objective as ObjectiveType} from "../../redux/objective/objectiveSlice"
import ObjectiveDetails from "../../drawers/ObjectiveDrawer";
import {weekGetter} from "../../services/extraFunctions";
import UpdateObjective from "../../drawers/UpdateObjective";
import moment from "moment"
import {setTimeFilter} from "../../services/extraFunctions";
import Preloader from "../../components/Preloader";
import axios from "../../services/api";
import { BsFillTrash2Fill } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import PaginatedItems from "../../components/Pagination/Pagination";
import {setListOfSelectedObjectiveid } from '../../redux/objective/objectiveSlice'

interface ownerObjectType{
  full_name:string;
  email:string
}
interface ownersofObjectiveStateInterface{
  'list_of_owners':ownerObjectType[];
  'current_owner':string;
  'ShouldFilter':boolean;

}

const ObjectiveTable:React.FC<{
  objectives:any,
  status:string,
  ownersofObjective:ownersofObjectiveStateInterface,
  currentTabNumber:number,  dispatch:any,
  isInObjectivePage:boolean,
}>=({objectives,status,ownersofObjective,
  currentTabNumber,dispatch,isInObjectivePage
})=>{

  
  // const [listOfSelectedUsersid,setListOfSelectedUsersid] =useState<string[]>([])
  const { listOfSelectedObjectiveid } = useAppSelector(selectObjective)

  return (
    <>
          <Table size="sm" variant="striped" borderRadius="lg"
           overflow="hidden">
        <Thead  bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th></Th>
            <Th py="6"
              style={{"textTransform":"capitalize"}}
            >Objective</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            
            >Owner/Team</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            
            >Duration</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            
            >Routine Options</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            
            >Routine Count</Th>
            <Th
            
            ></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {status === "loading" ? (
           <>
           <Preloader />
           </>
          ) : !objectives.length ? (
            <Tr>
      
              <Td>
                <Text>No Objectives found. Please create/upload Objective</Text>
              </Td>
            </Tr>
          ) : (
            objectives.filter((data:ObjectiveType)=>{
              type statusType= "pending"|"active"|"closed";
              var status:statusType;
              status='active'
              
              if(currentTabNumber==0){
                status =  'pending'
              }
              if(currentTabNumber==1){
                status =  'active'
              }
              if(currentTabNumber==2){
                status =  'closed'
              }   

              return data.objective_status==status
            }).filter((data:ObjectiveType)=>{
              if(ownersofObjective.current_owner){
                return  data.owner.email==ownersofObjective.current_owner
              }
              return true
            }).map((objective:ObjectiveType) => {



                if(objective){

                  return (
                    (
                      <Tr key={uuid_v4()} style={{"textTransform":"capitalize"}}>
                      {
                        status==="deleting"?
                        <Preloader/>:''
                      }
                        <Td>
                          <Checkbox disabled={status=='closed'}
                          isChecked={listOfSelectedObjectiveid.includes(objective.objective_id)}
                           onChange={(e)=>dispatch(setListOfSelectedObjectiveid(objective.objective_id))}
                           />
                        </Td>
                        <Td>
                          <Text mb="2">{objective.name}</Text>
                        </Td>
                        <Td>{objective.owner.email?objective.owner.email:""}</Td>
            <Td>{weekGetter({"startDate":objective.start_date,"endDate":objective.end_date})}</Td>
                        <Td textTransform="capitalize">{objective.routine_option.replace("_"," ")}</Td>
                        <Td>{objective.routine_round}</Td>
                        <Td>
                          {/* <Button size="sm">View</Button> */}
                          <CustomDrawer showModalBtnText="View" drawerSize="md">
                            <ObjectiveDetails {...objective} />
                          </CustomDrawer>
                        </Td>

                        <Td>
                  <Button
                  loadingText=""
                  // isLoading={status==="deleting"}
                  leftIcon={<RiDeleteBinLine/>}
                  disabled={!isInObjectivePage}
                  onClick={(e)=>{
              const ORG_NAME = localStorage.getItem("current_organization_short_name");
              if(!ORG_NAME) return 
              if(window.confirm("Are You Sure You want to delete")){
                // if(window.confirm(''))
                if(objective.routine_option!=='once'){
                  //if it not once ask the user if you only want to delete this item or following re-coocuring item
                  if(window.confirm('Do you only want to delete this item and following re-coocuring item ')){
                    dispatch(deleteObjective({"ORG_NAME":ORG_NAME,"uuid":objective.objective_id,recurring:true}))
                  }else{
                    //i just want to delete one out of the re-occuring
                    dispatch(deleteObjective({"ORG_NAME":ORG_NAME,"uuid":objective.objective_id,recurring:false}))
                  }

                }else{
                  dispatch(deleteObjective({"ORG_NAME":ORG_NAME,"uuid":objective.objective_id,recurring:false}))
                }
              }
                  
            }}
                  ></Button>
                  
                </Td>

              <Td>

              <CustomDrawer showModalBtnText='' leftIcon={<AiOutlineEdit/>} drawerSize="md" > 
                <UpdateObjective 
                name={objective.name}
                corporate_level= {{
                  uuid:objective.corporate_level.uuid,
                  name:objective.corporate_level.name
                }}
                routine_option = {objective.routine_option}
                start_date = {objective.start_date}
                end_date={objective.end_date}
                perspective={objective.perspectives}
                objective_id={objective.objective_id}
                />
              </CustomDrawer>
                {/* <Button
                    leftIcon={<AiOutlineEdit/>}
                    disabled={currentTabNumber==2}//this means it closed
                >
                  

                </Button> */}
              </Td>
                {/* <Td >
                {
                  objective.objective_status==="pending"?
                  <CustomDrawer
                  showModalBtnText=""
                  showModalBtnVariant="primary"
                  showModalBtnColor="white"
                  leftIcon={<RiSendPlaneFill />}
                drawerSize="md"
                  >
                    
                      <UpdateObjective 
                      // corporate_level={}
                      {...objective} />
                  </CustomDrawer>
                :""}
                
                </Td> */}

                
                      </Tr>
                    )
                  )
                }


                return ""

            })
          )}
        </Tbody>
      </Table>
    
    </>
  )
}

const ObjectiveStatusTab:React.FC<{
  objectives: any,
  status:string;
  ownersofObjective:ownersofObjectiveStateInterface;
  StatusTabIndex:number,
  dispatch:(obj:any)=>void;
  setStatusTabIndex:(arg:any)=>void
  isInObjectivePage:boolean
  setPageNum:(value:number)=>void;
}> = ({
  objectives,
  ownersofObjective,
  status,
  StatusTabIndex,
  dispatch
  ,setStatusTabIndex,
  isInObjectivePage,
  setPageNum
})=>{

  // const [StatusTabIndex,setStatusTabIndex]= useState<number>(0)
  useEffect(()=>{
    const ObjectivesetStatusTabIndex = localStorage.getItem('ObjectivesetStatusTabIndex')
    if(ObjectivesetStatusTabIndex){
      setStatusTabIndex(JSON.parse(ObjectivesetStatusTabIndex))
    }
  },[])
  return (

    
    <Tabs 
    isLazy
    index={StatusTabIndex}
    colorScheme='blue'
    isFitted variant='enclosed' 
    onChange={(currenttabIndex)=>{
      localStorage.setItem('ObjectivesetStatusTabIndex',JSON.stringify(currenttabIndex))
      setPageNum(1)
      setStatusTabIndex(currenttabIndex)
    }
    }
    >
<TabList mb='1em' >
  <Tab >Pending</Tab>{/* tabIndex = 0 */}
  <Tab>Active</Tab>{/* tabIndex = 1*/}
  <Tab>Closed</Tab>{/* tabIndex = 2 */}

  
</TabList>

<TabPanels>
   

<TabPanel>
        
         <ObjectiveTable
          objectives={objectives}
          status={status}
          ownersofObjective={ownersofObjective}
          currentTabNumber={StatusTabIndex}
          dispatch={dispatch}
          isInObjectivePage={isInObjectivePage}
        />
        </TabPanel>


        <TabPanel>
        
         <ObjectiveTable
          objectives={objectives}
          status={status}
          ownersofObjective={ownersofObjective}
          currentTabNumber={StatusTabIndex}
          dispatch={dispatch}
          isInObjectivePage={isInObjectivePage}

        />
        </TabPanel>


        <TabPanel>
        
         <ObjectiveTable
          objectives={objectives}
          status={status}
          ownersofObjective={ownersofObjective}
          currentTabNumber={StatusTabIndex}
          dispatch={dispatch}
          isInObjectivePage={isInObjectivePage}

        />
        </TabPanel>
{/* {
      [... new Array(7)].map(i=>
        <TabPanel>
        
         <ObjectiveTable
          objectives={objectives}
          status={status}
          ownersofObjective={ownersofObjective}
          currentTabNumber={TabIndex}
          dispatch={dispatch}
        />
        </TabPanel>
        )
    } */}


</TabPanels>

    </Tabs>

  )
}






















const Objectives = ({isInObjectivePage=true}:{isInObjectivePage?:boolean}) => {
  const dispatch = useAppDispatch();
  const { listOfSelectedObjectiveid} = useAppSelector(selectObjective)
  const toast = useToast();
  const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
  const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');


  const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
  const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');


  const [ownersofObjective,setOwnersofObjective]=useState<ownersofObjectiveStateInterface>(
    {
      'list_of_owners':[],
      //the defualt means all
      'current_owner':"",
      //this means don't filter once it true then we can filter
      'ShouldFilter':false,
    }
  )
  const [StatusTabIndex,setStatusTabIndex]= useState<number>(1)

  const [objectives,setObjectives] =useState<ObjectiveType[]>([]);
    //pagination states
    const [pageNum,setPageNum] = useState(1);
    const [nextPage,setNextPage]=useState<string|null|undefined>(null);
    const [previousPage,setPreviousPage]=useState<string|null|undefined>(null);
    const [NumOfData,setNumOfData]=useState<number|undefined>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [num_of_page,setNum_of_pages] =useState(0)
    // const [status,setStatus] =useState<"idle" | "loading" |"succeeded">("idle");
    //end pagination states
  const { 
    status,
    //  objectives,
  //    count:NumOfData,
  //   next:nextPage,previous:previousPage  
  } = useAppSelector(selectObjective);

  const handleError= useErrorHandler()
  const ORG_NAME = localStorage.getItem("current_organization_short_name");



  const getObjective = async ({statusNum=0}:{statusNum?:number})=>{
    setIsLoading(true)
    const ObjectiveStatus:any = {
      0:"pending",
      1:"active",
      2:"closed"
    }
    //if none of the if statement is true the this is a Active status
    let url =`/client/${ORG_NAME}/objective/?objective_status=active&page=${pageNum}`
    if(ObjectiveStatus[statusNum]==="closed"){
        url = `/client/${ORG_NAME}/objective/?objective_status=${ObjectiveStatus[statusNum]}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
        console.log({
          url,"current status":ObjectiveStatus[statusNum],start_date_before__Past,start_date_after__Past
        })
      }
    else if(ObjectiveStatus[statusNum]==="pending"){
      url = `/client/${ORG_NAME}/objective/?objective_status=${ObjectiveStatus[statusNum]}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`
      console.log({
        url,"current status":ObjectiveStatus[statusNum],
        start_date_before__Future,
        start_date_after__Future
      }) 
    }

    
    try {
    
        // url=`/client/${ORG_NAME}/objective/?objective_status=${ObjectiveStatus[statusNum]}&page=${pageNum}`

    

      const response = await axios.get(url);
       console.log({
        response
       })
      setNum_of_pages(response.data.page_count)

      // set the Objective Wegot
      setObjectives(response.data.data)
      setNextPage(response.data.next)
      setPreviousPage(response.data.previous)
      setNumOfData(response.data.count)
    } catch (err: any) {
      
      if(err.response.status==401){
        handleError(err)
      }
      return err.response;
    }
  
    setIsLoading(false)
  
  }


  const handleBulkDelete =(data:string[])=>{
    //
    // dispatch(deleteObjective({"ORG_NAME":ORG_NAME,"uuid":objective.objective_id,recurring:false}))
    if(data.length===0){
      toast({
        title: 'Please at least select one objective',
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
      return
    } 
    if(ORG_NAME){
      dispatch(deleteBulkObjective({"ORG_NAME":ORG_NAME,data}))

    }

    // deleteBulkObjective
  }






  useEffect(()=>{

    if(status==="succeeded"){
      setOwnersofObjective({...ownersofObjective,"list_of_owners":[...objectives.map((data:any)=>{
          return {
            "full_name":data.owner.first_name +" "+data.owner.last_name,
            "email":data.owner.email
          }
      }
      
      )]})
    }
    if(status ==="deleted"){
      toast({
        title: 'deleted successfully',
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
      setTimeout(()=>{
        window.location.reload()
      },2000)
    }
  },[status])


      

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
    if(start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past&&ORG_NAME){
      // if this two are there we can call the dispatch using this filter
      // ?start_date_before=${start_date_before}&start_date_after=${start_date_after}
// console.log({
//   start_date_before,start_date_after
// })
      // dispatch(getObjectives({ORG_NAME,"pagenum":pageNum,handleError,start_date_before,start_date_after}));
      
      getObjective({"statusNum":StatusTabIndex})
    }

    
  },[start_date_before__Future,start_date_after__Future,
    start_date_before__Past,start_date_after__Past,pageNum,StatusTabIndex])
  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          {/* Showing 10 of 40  */}
          Showing {objectives.length!==0?objectives.length:0} of {NumOfData?NumOfData:0} Objectives

        </Text>


       

{
  isInObjectivePage?
        <Stack direction="row" spacing={4}>

          <CustomDrawer
            showModalBtnText="Add New Objective"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <AddObjective />
          </CustomDrawer>
          <CustomDrawer
            showModalBtnText="Upload Objective"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
          >
            <UploadObjectives/>
          </CustomDrawer>


          {/* <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete All
      </Button> */}
      <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
        onClick={(e)=>handleBulkDelete(listOfSelectedObjectiveid)}
      >
        Delete Selected
      </Button>
        </Stack>:""
}

      </Flex>
<Tabs
isLazy
onChange={(currentIndex)=>{
  console.log({currentIndex})
  setPageNum(1)
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
     
     <ObjectiveStatusTab 
     objectives={objectives}
     ownersofObjective={ownersofObjective}
     status={status}
     dispatch={dispatch}
     StatusTabIndex={StatusTabIndex}
     setStatusTabIndex={setStatusTabIndex}
     isInObjectivePage={isInObjectivePage}
     setPageNum={setPageNum}
     />
     </TabPanel>
 
   ))
 }
    
    </TabPanels>
</Tabs>


{isLoading&& <Preloader />}







{/* 
      <Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button> */}
    <PaginatedItems 

    pageCount={num_of_page}
    onPageClick={(pageNumberClick)=>{
      setPageNum(pageNumberClick)//this would trigger
    }} />
    </Box>
  );
};

export default Objectives;
