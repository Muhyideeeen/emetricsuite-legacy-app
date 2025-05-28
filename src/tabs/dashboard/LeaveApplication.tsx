
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
import React, { useEffect,useMemo, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { HiDotsHorizontal, HiOutlineBriefcase, HiOutlinePlus } from 'react-icons/hi';
import { date } from 'yup/lib/locale';
import CustomModal from '../../components/CustomModal';
import InputWithLabel from '../../components/InputWithLabel';
import Preloader from '../../components/Preloader';
import AddLeaveApplication from '../../drawers/AddLeaveApplication';
import CustomDrawer from '../../drawers/CustomDrawer';
import AssignDeputisingOffice from '../../modal/leaveApplication/AssignDeputisingOfficer';
import SubmitReviewModal from '../../modal/leaveApplication/SubmitReview';
import { GetEmployeeTeam } from '../../redux/employees/employeesAPI';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getLeaveApplicationApi } from '../../redux/LeaveApplication/LeaveApplicationApi';
import { selectLeaveApplication } from '../../redux/LeaveApplication/LeaveApplicationSlice';
import axios from '../../services/api';
import { getMyInfo } from '../../services/auth.service';
import { createDanloadAbleFile } from '../../services/extraFunctions';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
import GetAssignHandOver from '../home/getAssignHandOver';
import HrLeaveManagement from '../home/HrLeaveManagement';





const LeaveApplication = ():React.ReactElement=>{
  return (
    <Tabs colorScheme="primary" 
    isLazy
    // index={tabIndex}
    // onChange={(currentIndex)=>{
    //   setTabIndex(currentIndex);
    //   localStorage.setItem("StrategyDeckPageTab",JSON.stringify(currentIndex))

    // }}
    >

      <TabList>
      <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            My Leave application
          </Tab>

          {
        TypeVerifierUserChecker(['team_lead'],'client_tokens')?
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Team Leave Application 
          </Tab>:'' 
               }

{
        TypeVerifierUserChecker(['team_lead'],'client_tokens')?
          <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
           Downline Team Leave Application 
          </Tab>:'' 
               }

              {
        TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
        <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
             Leave Mangagement 
          </Tab>
        :
        ''
              }
                            {
        !TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
        <Tab fontSize="sm" fontWeight="bold" color="gray.600" mr="5">
            <Box as="span" mr="2">
              <HiOutlineBriefcase size="22px" />
            </Box>
            Get Assign Hand Over
          </Tab>
        :
        ''
              }
      </TabList>
      


      <TabPanels pt="3">
        <TabPanel px="0">
          <p>
          <LeaveStatusTab tabType={'individual'}/>
          </p>
        </TabPanel>

      {
        TypeVerifierUserChecker(['team_lead'],'client_tokens')?
        <TabPanel px="0">
          <LeaveStatusTab tabType='team'/>
        </TabPanel>:''
      }
            {
        TypeVerifierUserChecker(['team_lead'],'client_tokens')?
        <TabPanel px="0">
          <TeamLeaveApplication team_data_type={'downlineteam'} status_tab_look_up={`get_team_leave_application/`}/>
        </TabPanel>:''
      }

{
        TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
        <TabPanel px="0">
         <HrLeaveManagement/> 
        </TabPanel>:''
      }

{
        !TypeVerifierUserChecker(['admin_hr'],'client_tokens')?
        <TabPanel px="0">
        <GetAssignHandOver/>
        </TabPanel>:''
      }
      </TabPanels>
    </Tabs>

  )
}

export default  LeaveApplication






type LeaveStatusTabProp ={
  tabType:'team'|'individual'
}
const LeaveStatusTab = ({tabType}:LeaveStatusTabProp):React.ReactElement=>{
  const [TabStatusIndex,setStatusTabIndex] = useState(0);
  const [isLoading,setLoading] = useState(false);
  const [pageNum,setPageNum] = useState(1);
  const [lookUp,setLookUp] = useState<string>(TypeVerifierUserChecker(['team_lead','employee'],'client_tokens')?
  '?team_lead_approve=pending':'?hradmin_lead_approve=pending&is_hradmin_can_see=True')

  const status:string[] = ["Pending","Approved","Disapproved",'Request A New Date',]
  return (
    <Tabs 
    isLazy
    //  defaultIndex={1}
    index={TabStatusIndex}
     colorScheme={'blue'}
    isFitted variant='enclosed' onChange={(currenttabIndex)=>{
      setStatusTabIndex(currenttabIndex)
 
      if(TypeVerifierUserChecker(['team_lead','employee'],'client_tokens')){
        if(currenttabIndex ===0 ){
          setLookUp(`?team_lead_approve=pending`)
        }
        if(currenttabIndex ===1 ){
          setLookUp(`?team_lead_approve=approved`)
        }
        if(currenttabIndex ===2 ){
          setLookUp(`?team_lead_approve=disapproved`)
        }
        if(currenttabIndex ===3 ){
          setLookUp(`?team_lead_approve=request_a_new_date`)
        }
      }
      else{
        if(currenttabIndex ===0){
          setLookUp(`?hradmin_lead_approve=pending&is_hradmin_can_see=True`)
        }
  
        if(currenttabIndex ===1 ){
          setLookUp(`?hradmin_lead_approve=approved&is_hradmin_can_see=True`)
        }
        if(currenttabIndex ===2 ){
          setLookUp(`?hradmin_lead_approve=disapproved&is_hradmin_can_see=True`)
        }
  
        if(currenttabIndex ===3 ){
          setLookUp(`?hradmin_lead_approve=request_a_new_date&is_hradmin_can_see=True`)
        }
      }
      


     

}}>
      <TabList mb='0'  padding={'0'}>
       {/*   */}
        {
          status.map((taskStatus,index)=>(
    
            <Tab 
            isDisabled={isLoading} 
            // disabled={isLoading}
            style={{"color":isLoading?"gray":""}}
            key={index}>{taskStatus}</Tab>
          ))
        }

        
      </TabList>
      <TabPanels>
    
    
          {
            status.map((i:string,index:number)=>
              <TabPanel key={index}>
              {/* navigate up to see the table */}
                {/* 
                pending -0 represtents Pending
                */}
              {
                tabType==='individual'?
                <LeaveApplicationTable look_up={lookUp}/>
                :
                <TeamLeaveApplication status_tab_look_up={`get_team_leave_application/${lookUp}`}/>
              }
              </TabPanel>
              )
          }
    
        
       
    
      </TabPanels>
    </Tabs>

  )
}




type  LeaveApplicationTableProp = {
  look_up:string;
}

const LeaveApplicationTable = ({look_up='',}:LeaveApplicationTableProp):React.ReactElement=>{
  const dispatch = useAppDispatch();
  const { status, data,errMessage} = useAppSelector(selectLeaveApplication)
  const org_name=  localStorage.getItem('current_organization_short_name')
  const handleError = useErrorHandler();
  const loggedinUser:any= getMyInfo();
  
  const canUseMenu =(employee:any):boolean=>{
    let can_use = false
    console.log({look_up,'include':look_up.includes('corporate_level__uuid')})
    if(look_up.includes('hradmin')){
      if(TypeVerifierUserChecker(['admin_hr'],'client_tokens')){
        can_use=true
      }else{
        can_use=false
      }
    }else{
      if(TypeVerifierUserChecker(['team_lead'],'client_tokens')){
        const explanation =`
          hear  team lead can only edit thier members data they can edit thier data
          they can't edit their data except coporate team lead
          they can edit their downline team_lead application
          `
          can_use=true
        //check if this person is same as the logged in user(tea_lead) set can see to false
        if(employee.user.email===loggedinUser.email){
          can_use=false
        }
        if(employee.corporate_level){
          //check if he is a corporate tema lead set can see to true
          can_use=true
        }
        if(look_up.includes('only_team_lead')){
          //check if he is in only_team_lead which means is in the downlineLeave application view so hear he can use the can see
          can_use=true
        }
        // console.log({employee,loggedinUser})
        
      }else{
        can_use=false
      }
    }



    return can_use
  }
  useEffect(()=>{
      if(org_name){
        console.log({look_up})
          dispatch(getLeaveApplicationApi({org_name,handleError,look_up}))
      }
  },[look_up])
  console.log({data})
  return (
      <div>
        <Box>
          
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          Showing 0 of 0  Leaves
          <br />
        </Text>
       

        <Stack direction="row" spacing={4}>

          {
            TypeVerifierUserChecker(['team_lead','employee'],'client_tokens')?
          <CustomDrawer
            showModalBtnText="Apply for Leave"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm">
              <AddLeaveApplication/>
          </CustomDrawer>:''
          }

            
          <CustomDrawer
            showModalBtnText="..."
            showModalBtnVariant="outline"
            // showModalBtnColor="white"
            showModalBtnColor="primary"
            disabled={true}
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <p>Hello my firend</p>
          </CustomDrawer>
        </Stack>
      </Flex>
      {status==='pending' &&<Preloader/>}
      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden"
      whiteSpace={'nowrap'}
      >
        <Thead bg="gray.200">
          <Tr>
            <Th py="3" style={{"textTransform":"capitalize"}}> Level Type</Th>
            <Th py="3" style={{"textTransform":"capitalize"}}> Employee Name</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>Team Name</Th>
            <Th py="3"  style={{"textTransform":"capitalize"}}>Allowance</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>Start Date</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>End Date</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}} >Duration</Th>
            {/* <Th py="2"  style={{"textTransform":"capitalize"}}>Remark</Th> */}
            {/* <Th py="2"  style={{"textTransform":"capitalize"}}>Routine Round</Th> */}
            <Th py="2"  style={{"textTransform":"capitalize"}}>Team Lead Approval</Th>
            <Th py="2"  style={{"textTransform":"capitalize"}}>Admin Hr Approval</Th>
            <Th py=""  style={{"textTransform":"capitalize"}}></Th>
              {/* // this is for hr and team leads */}
              <Th py=""  style={{"textTransform":"capitalize"}}></Th>

          </Tr>
        </Thead>
        <Tbody>
        {
          data.length!==0?
          data.map((item,index:number)=>(
              <Tr key={index}>
                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.leave_type.leave_choice}
                      </Text>
                  </Td>
                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.employee[0]?item.employee[0].user.email:''}
                      </Text>
                  </Td>

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.employee[0]?GetEmployeeTeam(item.employee[0])?.name:''}
                      </Text>
                  </Td>
                  {/*  */}
                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.recorded_allowance}
                      </Text>
                  </Td>

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.start_date}
                      </Text>
                  </Td>

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.end_date}
                      </Text>
                  </Td>

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.deputizing_officer}

                      </Text>
                  </Td>

             

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.recorded_duration}
                      </Text>
                  </Td>
                  

                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.team_lead_approve}
                      </Text>
                  </Td>


                  <Td>
                      <Text  mb="2" fontSize="sm">
                          {item.hradmin_lead_approve}
                      </Text>
                  </Td>


                  
              <Td>
                <Menu>
                    <MenuButton
                     as={IconButton}
                        aria-label="Options"
                      icon={<HiDotsHorizontal />}
                      variant="outline"
                      disabled={(item.hradmin_lead_approve==='approved'&&item.team_lead_approve==='approved')?false:true}
                      />
                  <MenuList>
                    <MenuItem>
                    <CustomModal
                      openBtnText='Assign Deputising Officer'
                      headingText='Assign Deputising Officer'
                      subHeadText='..'
                      size='sm'
                      children={
                       <AssignDeputisingOffice employee_leave_application_id={item.id}/>
                      }
                    />
                    </MenuItem>
                </MenuList>
                </Menu>  
              </Td>

                    <Td>

                    <Menu>
                    <MenuButton
                as={IconButton}
                disabled={canUseMenu(item.employee[0])?false:true}
                aria-label="Options"
                icon={<HiDotsHorizontal />}
                variant="outline"
              />
              
              <MenuList>
                <SubmitReviewModal leave_application_id={item.id}/>

                <MenuItem>
                  <Text  mb="2" fontSize="sm">
                            {}

                            <a 
                            target={'_blank'}
            href={item.hand_over_report?item.hand_over_report:'#'}
              style={{
                "color":item.hand_over_report?"blue":"gray",
                cursor:"pointer"
              }}
              rel="nofollow noreferrer" download
              >
                Download report
              </a>
                        </Text>
                  </MenuItem>

                  <MenuItem>
                  {
                    item.remark?
                    <CustomModal
                      openBtnText='View remark'
                      headingText='Remark'
                      subHeadText='Remark'
                      size='sm'
                      children={<p>{item.remark}</p>}
                    />:
                    'No Remark'
                  }
                    
                  </MenuItem>
              </MenuList>
              

                    </Menu>
                    </Td>
              </Tr>
          )):''

      }
        </Tbody>
      </Table>

     
      {/* <PaginatedItems
      pageCount={num_of_page}
      onPageClick={(pageNumberClick)=>{

      }}
      /> */}
    </Box>
      </div>
  )
}





const TeamLeaveApplication = ({status_tab_look_up,team_data_type='myteam'}:{status_tab_look_up:string,team_data_type?:'myteam'|'downlineteam'}):React.ReactElement=>{

  const [isLoading,setIsLoading] = useState(false);
  const loggedinUser:any= getMyInfo();
  const [teamLead,setTeamData] = useState<any>()
  const [team_lookup,setTeam_lookup] = useState<null|string>(null)


  const getLoggedInTeamLeadUUID =async()=>{
    const ORG_NAME = localStorage.getItem('current_organization_short_name');
    if (!ORG_NAME) return
    setIsLoading(true)  
    

        try{
            const response =await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
                  // console.log(response)
                  if(response.data.data.length!==0){
                      let TeamLead = response.data.data[0]
                      // TeamLead.corporate_level||TeamLead.department||TeamLead.division||TeamLead.group||TeamLead.unit
                      
                      setTeamData(

                        TeamLead

                      )
    setIsLoading(false)  
                   
                      
                  }
                  // console.log(Team)
              }   
              catch(err:any){
                  // console.log(err)
                  // if(err.response.status==401){
                  //   handleError(err)
                  // }
                }
      
              setIsLoading(false)


}

  const getTeamApplication = async ()=>{
    if( teamLead.corporate_level){
      setTeam_lookup(`corporate_level__uuid=${teamLead.corporate_level.uuid}`)
    }
    if(teamLead.department){
      setTeam_lookup(`department__uuid=${teamLead.department.uuid}`)

    }
    if(teamLead.division){
      setTeam_lookup(`division__uuid=${teamLead.division.uuid}`)

    }
    if(teamLead.group){
      setTeam_lookup(`group__uuid=${teamLead.group.uuid}`)
    }
    if(teamLead.unit){
      setTeam_lookup(`unit__uuid=${teamLead.unit.uuid}`)
     
    }
  }

  const getDownlineTeamApplication = async ()=>{
    if( teamLead.corporate_level){
      setTeam_lookup(`only_team_lead=team_lead&corporate_view_division=${teamLead.corporate_level.uuid}`)
    }
    if(teamLead.department){
      setTeam_lookup(`only_team_lead=team_lead&department_view_unit=${teamLead.department.uuid}`)

    }
    if(teamLead.division){
      setTeam_lookup(`only_team_lead=team_lead&division_view_group=${teamLead.division.uuid}`)

    }
    if(teamLead.group){
      setTeam_lookup(`only_team_lead=team_lead&group_view_department=${teamLead.group.uuid}`)
    }
    if(teamLead.unit){
      setTeam_lookup(`'`)
     
    }
  }


  useEffect(()=>{
    getLoggedInTeamLeadUUID()
    

  },[])

  useEffect(()=>{
    if(teamLead){
      if(team_data_type === 'myteam'){
        getTeamApplication()
      }else{
        getDownlineTeamApplication()
      }
    }
  },[teamLead])


return (
  <div>
    {isLoading &&<Preloader/>}
    {/* {`${status_tab_look_up}&${team_lookup}`} */}
    {
      team_lookup?
      <LeaveApplicationTable look_up={team_data_type==='myteam'?`${status_tab_look_up}&${team_lookup}`:`get_team_leave_application/?${team_lookup}`}/>:''
    }

  </div>
)

}