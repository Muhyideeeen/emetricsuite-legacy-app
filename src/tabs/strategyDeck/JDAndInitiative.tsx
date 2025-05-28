import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Stack,
  Tag,Button,Select,
  Tabs,TabList,Tab,TabPanel,TabPanels, useToast, Checkbox,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import AddJDAndInitiative from "../../drawers/AddJDAndInitiative";
import CustomDrawer from "../../drawers/CustomDrawer";
import { useAppSelector ,useAppDispatch} from "../../redux/hooks";
import { selectJdIntiatives, setListOfSelectedInitiativeid } from "../../redux/jdsAndIntiatives/jdsAndIntiativesSlice";
import { useEffect, useState,useLayoutEffect } from "react";
import axios from "../../services/api";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import {RiSendPlaneFill} from "react-icons/ri";
import UploadInitiative  from "../../drawers/UploadInitiative";
import { getMyInfo } from "../../services/auth.service";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";
import { JdDetailDrawer } from "../../drawers/JdDetailDrawer";
import { Link } from "react-router-dom";
import UpdateJDandInitiaitive from "../../drawers/UpdateJDandInitiaitive";
import {deleteBulkJDandInitiativeApi, DeleteJDandInitiativeApi} from "../../redux/jdsAndIntiatives/jdsAndIntiativesApi"
import { RiDeleteBinLine } from "react-icons/ri";
import { useErrorHandler } from "react-error-boundary";
import  "../../components/removeChakraTabelPadding.css";
import {setTimeFilter,createDanloadAbleFile} from "../../services/extraFunctions";
import Preloader from "../../components/Preloader";
import { BsFillTrash2Fill, BsPencil } from "react-icons/bs";
import PaginatedItems from "../../components/Pagination/Pagination";
import { AiOutlineEdit } from "react-icons/ai";
import { selectObjective } from "../../redux/objective/objectiveSlice";

/* 
this component is ment to be access by only the admin
we can get all the data ..(on getiing of the data we extract owners an put them in a state)
we can filter by owner
*/
interface ownerObjectType{
  full_name:string;
  email:string
}
interface ownersofInitiativeStateInterface{
  'list_of_owners':ownerObjectType[];
  'current_owner':string;
  'ShouldFilter':boolean;
}


const JDAndInitiativesTab:React.FC<{
  isLoading:boolean,
  initiatives:any,
  ownersofInitiative:ownersofInitiativeStateInterface,
  status:string,
  StatusTabIndex:number,
  setStatusTabIndex:(arg:any)=>void,
  isInInitiaivePage:boolean,
  setPageNum:(value:number)=>void

}>=({
  isLoading,initiatives,ownersofInitiative,status,
  setStatusTabIndex,
  StatusTabIndex,isInInitiaivePage,setPageNum
})=>{

  useEffect(()=>{

    const KpisetStatusTabIndex = localStorage.getItem('KpisetStatusTabIndex')
    if(KpisetStatusTabIndex){
      setStatusTabIndex(JSON.parse(KpisetStatusTabIndex))
    }
  },[])

  return (
    <Tabs 
    isLazy
    defaultIndex={StatusTabIndex}
    colorScheme={isLoading?'gray':'blue'}
        isFitted variant='enclosed' 
       index={StatusTabIndex}
    onChange={(currenttabIndex)=>{
      localStorage.setItem('KpisetStatusTabIndex',JSON.stringify(currenttabIndex))
      setPageNum(1)
      setStatusTabIndex(currenttabIndex)
    }}
        

       >
    <TabList mb='1em' >
      <Tab   isDisabled={isLoading}>Pending</Tab>{/* tabIndex = 0 */}
      <Tab  isDisabled={isLoading}>Active</Tab>{/* tabIndex = 1*/}
      <Tab  isDisabled={isLoading}>Closed</Tab>{/* tabIndex = 2 */}
  
      {/* tabIndex = 7 */}
      
    </TabList>
  
    <TabPanels>
       
  
  
  {
          [... new Array(3)].map(i=>
            <TabPanel>
            {/* navigate up to see the table */}
              {/* 
              pending -0 represtents Pending
              */}
             <JDAinitiativesTable
      isLoading={isLoading}
      initiatives={initiatives}
      ownersofInitiative={ownersofInitiative}
      currentTabNumber={StatusTabIndex}
      status={status}
      isInInitiaivePage={isInInitiaivePage}
    />
            </TabPanel>
            )
        }
  
  
    </TabPanels>
  
    </Tabs>
  )
}






const JDAinitiativesTable =({currentTabNumber,isLoading,initiatives,ownersofInitiative,status,
  isInInitiaivePage=true
}:{currentTabNumber:number,isLoading:boolean,initiatives:any,ownersofInitiative:ownersofInitiativeStateInterface,
  status:string;isInInitiaivePage:boolean})=>{
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  const org_name = localStorage.getItem("current_organization_short_name"); 
  const { listOfSelectedInitiativeid } = useAppSelector(selectJdIntiatives)
  return (

    <Table size="sm"className="table-tiny" variant="simple" borderRadius="lg" overflow="hidden">
    <Thead bg="gray.100">
      <Tr style={{"textTransform":"capitalize"}}>
        <Th py="6"></Th>
        <Th py="6"   fontSize="xs" 
              style={{"textTransform":"capitalize"}}
        
        >KPI Name</Th>
        <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
        
        >TaT(EndTime)</Th>
        <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
        
        > Target Point</Th>
         <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
         
         >Qly Target Brief</Th>
         <Th   fontSize="xs"
              style={{"textTransform":"capitalize",width:"1%"}}>Routine </Th>
         {/* <Th></Th> */}
          <Th></Th>
          <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
          
          >Update</Th>
          <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
          
          >Deleted</Th>
      </Tr>
    </Thead>

    {isLoading?<Preloader />:(

    <Tbody>
     
      {
      initiatives.length!=0?
      [...initiatives]
      
      // .filter((data:any)=>{
      //   if(ownersofInitiative.current_owner){
      //     return  data.owner.email==ownersofInitiative.current_owner
      //   }
      //   return true
      // })
      .map((item:any, index) => (
        <Tr key={index} style={{"textTransform":"capitalize"}}>
          <Td>
            <Checkbox disabled={status==='closed'}
              isChecked={listOfSelectedInitiativeid.includes(item.initiative_id)}
              onChange={e=>dispatch(setListOfSelectedInitiativeid(item.initiative_id as string))}
            />
          </Td>
          <Td fontSize="xs" style={{width:"100%"}}>
            <Text mb="2" style={{width:"100%"}}>{item.name}</Text>
            </Td>
          <Td fontSize="xs"
          style={{"textAlign":'center'}}
          >
            <Text>{item.end_date}</Text>
            {/* <Text>12:00</Text> */}
          </Td>
          <Td 
          style={{"textAlign":'center'}}
          
          >{item.target_point}</Td>
          <Td fontSize="xs">
            <a href={createDanloadAbleFile(item.initiative_brief)}
            style={{
              "color":item.initiative_brief?"blue":"gray",
              cursor:"pointer"
            }}
            rel="nofollow noreferrer" download
            >
              
          Download Brief
            </a></Td>
         <Td fontSize="xs" 
          style={{"textAlign":'center'}}
         >
         {item.routine_round}</Td>
         {/* https://resx.cloudinary.com/haqszgzma/raw/upload/v1/media/company_logo/2022/03/28/8906e9ff-6650-4d53-8c58-6ed46f2a3abd_vinxrb.jpg */}
          {/* <Td><Link to={`#`}>View Report</Link></Td> */}
          {/* <Td><a download={"wow.jpg"}  href={"https://www.res.cloudinary.com/haqszgzma/raw/upload/v1/media/company_logo/2022/03/28/8906e9ff-6650-4d53-8c58-6ed46f2a3abd_vinxrb.jpg"}>View Report</a></Td> */}
         <Td>
             <CustomDrawer showModalBtnText="View" drawerSize="md">
             <JdDetailDrawer {...item} />
             </CustomDrawer>
          </Td>

          <Td >
         
            {
            item.initiative_status!=='closed'?
<CustomDrawer 
  showModalBtnText=""
  // showModalBtnVariant="primary"
  // showModalBtnColor="white"
  leftIcon={<AiOutlineEdit />}
drawerSize="md">
                 <UpdateJDandInitiaitive {...item}
                //  owner_email={item.owner.email}
                 />
             </CustomDrawer>:
             
            <Button isDisabled={false}>Edit</Button>
             }
             {/* <CustomDrawer showModalBtnText="Edit" drawerSize="md">
                 <UpdateJDandInitiaitive {...item}
                //  owner_email={item.owner.email}
                 />
             </CustomDrawer> */}
          </Td>

          <Td>
                  <Button
                  leftIcon={<RiDeleteBinLine/>}
                  loadingText="deleting"
                  isLoading={status==="deleting"}
                  disabled={!isInInitiaivePage}
                  onClick={(e)=>{
                    
                    if(!org_name) return 
                    if(window.confirm("Are Sure You Want to Delete")){
                      if(item.routine_option!=='once'){
                        if(window.confirm('Do you only want to delete this item and following re-coocuring item ')){
                          dispatch(
                            DeleteJDandInitiativeApi({"uuid":item.initiative_id,"handleError":handleError,"org_name":org_name,reOccuring:true})
                            )
                        }else{
                          dispatch(
                            DeleteJDandInitiativeApi({"uuid":item.initiative_id,"handleError":handleError,"org_name":org_name,reOccuring:false})
                          )
                        }

                      }else{
                        // this will only delete on
                        console.log('trying to delete')
                        dispatch(DeleteJDandInitiativeApi({"uuid":item.initiative_id,"handleError":handleError,"org_name":org_name,reOccuring:false}))

                      }
                    }
                  }}
                  ></Button>
          </Td>
        </Tr>
      )):<p>You dont Have KPI at this point</p>
      
      }
    </Tbody>
    )}
  </Table>
  )
}

type JDAndInitiativesPropType = {
  isInInitiaivePage?:boolean;
  team_lead_lookUp?:string;
  team_info?:{
      level_name:string,
      level_id:string
    }
}
const JDAndInitiatives = ({isInInitiaivePage=true,team_lead_lookUp='',team_info}:JDAndInitiativesPropType) => {
  const { listOfSelectedInitiativeid} = useAppSelector(selectJdIntiatives)
  //pagination states
  const [pageNum,setPageNum] = useState(1);
  const [nextPage,setNextPage]=useState<string|null|undefined>(null);
  const [previousPage,setPreviousPage]=useState<string|null|undefined>(null);
  const [NumOfData,setNumOfData]=useState<number|undefined>(0);
  const [initiatives,setInitiative] = useState<any[]>([]=[])
  const [num_of_pages,setNum_of_pages] = useState(0)
  //end pagination states
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch()

  const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
  const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');


  const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
  const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');
  const [StatusTabIndex,setStatusTabIndex]= useState<number>(1)

  const { status,} =useAppSelector(selectJdIntiatives)
    //this st
   const ORG_NAME = localStorage.getItem("current_organization_short_name");

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  // filtering table State
  const [ownersofInitiative,setOwnersofInitiative]=useState<ownersofInitiativeStateInterface>(
    {
      'list_of_owners':[],
      //the defualt means all
      'current_owner':"",
      //this means don't filter once it true then we can filter
      'ShouldFilter':false,
    }
  )


  const getInitiatives=async (pagenum=1,statusNum:number=0)=>{
   
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    setIsLoading(true)
    const InitiativeStatus:any = {
      0:"pending",
      1:"active",
      2:"closed"
    }

    try {
      //generalUrl
      let url:string;
      //ownerUrl
      // url =`/client/${ORG_NAME}/initiative/?owner_email=${getLoggedin_userEmail()}&page=${pagenum}`
    
      //this for active
      url =`/client/${ORG_NAME}/initiative/?initiative_status=active${team_lead_lookUp}&page=${pagenum}`
      

      if(InitiativeStatus[statusNum]==="closed"){
        url = `/client/${ORG_NAME}/initiative/?initiative_status=${InitiativeStatus[statusNum]}${team_lead_lookUp}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}&page=${pageNum}`
        
      }
      else if(InitiativeStatus[statusNum]==="pending"){
        url = `/client/${ORG_NAME}/initiative/?initiative_status=${InitiativeStatus[statusNum]}${team_lead_lookUp}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}&page=${pageNum}`
        
    }
    console.log({url})
      const response = await axios.get(url);
      setInitiative(response.data.data);

      
      setNum_of_pages(response.data.page_count)
      setNumOfData(response.data.count);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);

    setIsLoading(false)
    } catch (err: any) {
      if(err?.response?.status==401){
        handleError(err)
      }
      console.log(err);
      setInitiative([]);

      
    }
    setIsLoading(false)

  }


  const handleBulkDelete = ()=>{
    //
    if(listOfSelectedInitiativeid.length===0){
      toast({
        title: 'Please at least select one Initative',
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    console.log({listOfSelectedInitiativeid})
    if(ORG_NAME){
      dispatch(deleteBulkJDandInitiativeApi({data:listOfSelectedInitiativeid,handleError,org_name:ORG_NAME}))
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


  useEffect(() => {
    //this only get initiatives only when the status is any of them below
    // console.log(status)
    
    if(status==="updated"){
      getInitiatives()
      toast(
        {
          title: "updated Successfully",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        }
      )
    }

    if(status==="deleted"){
      getInitiatives()
      toast(
        {
          title: "deleted Successfully",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        }
      )
    }
  }, [status,])



  useEffect(()=>{
    if(
      start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past&&ORG_NAME
    ){
      // if this two are there we can call the dispatch using this filter
      // ?start_date_before=${start_date_before}&start_date_after=${start_date_after}

      // dispatch(getObjectives({ORG_NAME,"pagenum":pageNum,handleError,start_date_before,start_date_after}));
        getInitiatives(pageNum,StatusTabIndex)
    }

    
  },[
    start_date_before__Future,start_date_after__Future,
    start_date_before__Past,start_date_after__Past,pageNum,StatusTabIndex

  ])

  
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          Showing {initiatives.length} of {NumOfData} KPI
        </Text>

       {
         isInInitiaivePage?
        <Stack direction="row" spacing={4}>
          
          <CustomDrawer
            showModalBtnText="Add KPI"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="md"
          >
            <AddJDAndInitiative from_team_leadpage={team_lead_lookUp?true:false} team_info={team_info}/>
          </CustomDrawer>
          <CustomDrawer
            showModalBtnText="Upload KPI"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="md"
          >
            <UploadInitiative />
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
        onClick={(e)=>handleBulkDelete()}
      >
        Delete Selected
      </Button>
        </Stack>:""
       }
      </Flex>

      {/* JDAndInitiativesTab     */}
      <Tabs
isLazy
onChange={(currentIndex)=>{
  // console.log(currentIndex)
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
      <Tab isDisabled={isLoading}>Week</Tab>
      <Tab isDisabled={isLoading}>Month</Tab>
      <Tab isDisabled={isLoading}>Quarter</Tab>
      <Tab isDisabled={isLoading}>Bi-Annual</Tab>
      <Tab isDisabled={isLoading}>Annual</Tab>
    </TabList>



    <TabPanels>
    
    {
      [...new Array(6)].map(()=>(
        <TabPanel>

        <JDAndInitiativesTab 
          isLoading={isLoading}
          initiatives={initiatives}
          ownersofInitiative={ownersofInitiative}
          status={status}
          StatusTabIndex={StatusTabIndex}
          setStatusTabIndex={setStatusTabIndex}
          isInInitiaivePage={isInInitiaivePage}
          setPageNum={setPageNum}
        />
    </TabPanel>
      ))
    }





  </TabPanels>
  </Tabs>










      {/* <Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button> */}

    <PaginatedItems 
      pageCount={num_of_pages}
      onPageClick ={(pageNumberClicked)=>{
        setPageNum(pageNumberClicked)
      }}
    />
    </Box>
  );
};

export default JDAndInitiatives;
