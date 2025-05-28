import { useState, useEffect } from "react";

import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  UnorderedList,
  ListItem,
  Center,
  Stack,Button,useToast, Checkbox, Input, InputGroup, FormControl, FormLabel, Select
} from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight, HiOutlinePlus } from "react-icons/hi";
import EmployeeDrawer from "../../drawers/Employee";
import CustomDrawer from "../../drawers/CustomDrawer";
import AddEmployee from "../../drawers/AddEmployee";
import UploadEmployees from "../../drawers/UploadEmployees";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  DeleteEmployeeApi,
  EmployeeData,
  getAllEmployees,
} from "../../redux/employees/employeesAPI";
import { selectEmployees } from "../../redux/employees/employeesSlice";
import axios from "../../services/api";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import { useErrorHandler } from "react-error-boundary";
import UpdateEmployee from "../../drawers/UpdateEmployee";
import { RiDeleteBinLine, RiSendPlaneFill } from "react-icons/ri";
import Preloader from "../../components/Preloader";
import { BsFillTrash2Fill } from "react-icons/bs";
import { IoIosMailUnread } from "react-icons/io";
import { sendActivationMail } from "../../redux/ResendActivationMail/ResendActivationMailApi";
import { selectResendActivationMail, setStatusToIdle } from "../../redux/ResendActivationMail/ResendActivationMailApiSlice";
import PaginatedItems from "../../components/Pagination/Pagination";
import CustomPopOver from "../../components/PopOver/PopOver";
import { RiUserSearchLine } from 'react-icons/ri';
import {FaFilter} from 'react-icons/fa'
import SelectAsyncPaginate from "../../components/AsyncSelect";


const Employees:React.FC<{
  showAddAndUploadButton?:boolean;
}> = ({
  showAddAndUploadButton=false
}) => {
  const [listOfSelectedUsersid,setListOfSelectedUsersid] =useState<string[]>([])
  //pagination states
  const [pageNum,setPageNum] = useState(1);
  //end pagination states
  const [isLoading, setIsLoading] = useState(false);
const [selectedLevel, setSelectedLevel] = useState<string>('');
const [currentCoprate,setCurrentCoprate]= useState<{ name: string; uuid: string }>();
  const dispatch = useAppDispatch();
  const { status:sendingActivationStatus,message:ActivationMessage } = useAppSelector(selectResendActivationMail)
  const { employees,status,num_of_page
  } = useAppSelector(selectEmployees);
  const [searchText,setSearchText] = useState<string>();
  const handleError = useErrorHandler();
  const ORG_NAME = localStorage.getItem("current_organization_short_name"); 

  const org_name = localStorage.getItem("current_organization_short_name"); 

  const toast = useToast()
  // const getEmployeesList = async () => {
  //   setIsLoading(true);
  //   const ORG_NAME = localStorage.getItem("current_organization");
  //   try {
  //     const response = await axios.get(`/client/${ORG_NAME}/employee/`);
  //     console.log(response.data);
  //     setEmployeesData(response.data.data);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //     setIsLoading(false);
  //     throw err;
  //   }
  // };


  useEffect(() => {
    if (ORG_NAME) {
      dispatch(getAllEmployees({"org_name":ORG_NAME,"pagenum":1,handleError}))
    }
  }, []);

  useEffect(()=>{
      if(status ==="deleted"){
        toast({
          title:"Deleted Successfully",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        })
      }
  },[status])
  useEffect(()=>{
    if(sendingActivationStatus==='succeeded'){
      toast({
        title:ActivationMessage,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      })
      dispatch(setStatusToIdle({}))
    }
  },[sendingActivationStatus])
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const handleCheckBox = (user_id:string)=>{

    if(listOfSelectedUsersid.includes(user_id)){
      console.log('remove',user_id)
      setListOfSelectedUsersid([...listOfSelectedUsersid.filter(data=>data!==user_id)])
    }else{
      console.log('add',user_id)
      setListOfSelectedUsersid([...listOfSelectedUsersid,user_id])
    } 
    // setListOfSelectedUsersid
    // listOfSelectedUsersid
  }


  const sendUserIdsForReActivation = ()=>{
    if(listOfSelectedUsersid.length===0){
      toast({
        title:'Please Select at least one employee',
        status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
      })
    }
    else{
      console.log({'data to be re-activated':listOfSelectedUsersid})
      const org_name = localStorage.getItem("current_organization_short_name"); 
      if(org_name){
        dispatch(sendActivationMail({
          org_name,handleError,users:listOfSelectedUsersid
        }))
        console.log('sents')
      }
    }
  }

  const handleClickSearch =()=>{
    //search employee 
    if(searchText){
      console.log({searchText})
      if(ORG_NAME){
        dispatch(getAllEmployees({"org_name":ORG_NAME,"pagenum":1,handleError,searchText}))
      }
    }else{
      toast({
        title:"Please fill the search box with words",
        status: 'error',
        position: "top",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const handleSearch =(searchText:string)=>{
    if(ORG_NAME){
      dispatch(getAllEmployees({"org_name":ORG_NAME,"pagenum":1,handleError,searchText}))
    } 
  }
  return (
    <Box>


  <Flex justifyContent="space-between" alignItems="center" mb="4">
  <Text
    as="small"
    display="inline-block"
    fontWeight="semibold"
    alignSelf="flex-end"
    color="gray.700"
  >
   Page { pageNum }  of {employees.length} Employees
  </Text>
  {
  !showAddAndUploadButton?
  <Stack direction="row" spacing={4}>
    <CustomDrawer
      showModalBtnText="Add Employee"
      showModalBtnVariant="primary"
      showModalBtnColor="white"
      leftIcon={<HiOutlinePlus />}
      drawerSize="md"
    >
      <AddEmployee />
    </CustomDrawer>
    <CustomDrawer
      showModalBtnText="Upload Employees"
      showModalBtnVariant="outline"
      showModalBtnColor="primary"
      leftIcon={<HiOutlinePlus />}
      drawerSize="sm"
    >
      <UploadEmployees />
    </CustomDrawer>
    <Button
      leftIcon={<IoIosMailUnread />}
        variant={'outline'}
        color={'primary'}
        mr="2"
        size="sm"
        fontWeight="semibold"
        onClick={sendUserIdsForReActivation}
      >
        Resend Activation mail
      </Button>


      <Button
      leftIcon={<BsFillTrash2Fill />}
        color={'white'}
        // variant={showModalBtnVariant}
        backgroundColor='red.600'
        mr="2"
        size="sm"
        fontWeight="semibold"
      >
        Delete Selected
      </Button>

      <CustomPopOver
      triggericon={<RiUserSearchLine/>}
      >
        <InputGroup>
              <Input type='text' placeholder='search'
              onChange={(e)=>setSearchText(e.target.value)}
              />
              <Button
              variant="primary"
              color="white"
              loadingText="searching.."
              onClick={(e)=>handleClickSearch()}
              >
                  <RiUserSearchLine/>
              </Button>
        </InputGroup>
      </CustomPopOver>

      <CustomPopOver 
      triggericon={<FaFilter/>}
      >
          <FormControl mb="5">
            <FormLabel htmlFor="structure_level" fontSize="xs" fontWeight="semibold">
              Pick a Structure Level
            </FormLabel>
            <Select
              placeholder="Select Structure Level"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              id="structure_level"
              // value={}
              // {...register('level')}
              onChange={(e) => {
              setSelectedLevel(e.target.value)
                
              }}
            >
              <option value="corporate-level">Corporate</option>
              <option value="divisional-level">Division</option>
              <option value="group-level">Group</option>
              <option value="departmental-level">Department</option>
              <option value="unit-level">Unit</option>
            </Select>
          </FormControl>
          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontSize="xs" fontWeight="semibold">
              Level Name
            </FormLabel>
            <SelectAsyncPaginate
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
          key={selectedLevel}
          url={`/organization/setup/${selectedLevel}/list/${org_name}/?me=1`}
          value={currentCoprate}
          onChange={(value:any)=>{
            console.log('the value name',value)
            handleSearch(value?.name)
          return   setCurrentCoprate(value)
          
          }}
          SelectLabel={(option:any)=>`${option.name}`}
          SelectValue={(option:any)=> {
            return `${option.uuid}`
          } }
          placeholder={""}
              
              />
            
            <Text fontSize="sm" color="crimson">
              {/* {errors.level.message} */}
            </Text>
          </FormControl>



      </CustomPopOver>
  </Stack>
:""
}
</Flex>
     
      <Table variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.200" >
          <Tr fontWeight="bold" style={{"textTransform":"capitalize"}}>
            <Th></Th>
            <Th  style={{"textTransform":"capitalize"}}>EMPLOYEE</Th>
            <Th  style={{"textTransform":"capitalize"}}>TEAM</Th>
            <Th  style={{"textTransform":"capitalize"}}>DESIGNATION</Th>
            <Th  style={{"textTransform":"capitalize"}}>DATE EMPLOYED</Th>
            <Th  style={{"textTransform":"capitalize"}}>Status</Th>
            <Th  style={{"textTransform":"capitalize"}}></Th>
            <Th  style={{"textTransform":"capitalize"}}>Update</Th>
            <Th  style={{"textTransform":"capitalize"}}>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {status=='loading'&& <Preloader />}
          {sendingActivationStatus=='loading'&& <Preloader />}
          {employees.length === 0 ? (
            <Tr>
              <Td>No Employees have been added. Add/Upload employees</Td>
            </Tr>
          ) : (
            employees.map((singleEmployee) => (
              <Tr key={singleEmployee.uuid} style={{"textTransform":"capitalize"}}>
                <Td>
                  <Checkbox onChange={(e)=>handleCheckBox(singleEmployee.user.user_id)}/>
                </Td>
                <Td>
                  <Flex direction="column">
                    <Text fontSize="xs">
                      {singleEmployee?.user?.first_name?singleEmployee?.user?.first_name:""} {singleEmployee?.user?.last_name?singleEmployee?.user?.last_name:""}
                    </Text>
                    <Text as="small" color="gray.500">
                    {singleEmployee.corporate_level && "Corporate Level"}
                  {singleEmployee.division && "Division Level"}
                  {singleEmployee.group && "Group Level"}
                  {singleEmployee.department && "Department Level"}
                  {singleEmployee.unit && "Unit Level"}
                    </Text>
                  </Flex>
                </Td>
                <Td fontSize="xs">
                  {singleEmployee.corporate_level && singleEmployee.corporate_level.name}
                  {singleEmployee.division && singleEmployee.division.name}
                  {singleEmployee.group && singleEmployee.group.name}
                  {singleEmployee.department && singleEmployee.department.name}
                  {singleEmployee.unit && singleEmployee.unit.name}
                </Td>
<Td fontSize="xs">{ singleEmployee?.employee_basic_information?
(singleEmployee?.employee_basic_information.designation)?singleEmployee?.employee_basic_information.designation.name:""
// .name

:""}</Td>
                <Td fontSize="xs">{singleEmployee?.employee_employment_information?
                singleEmployee?.employee_employment_information?.date_employed:""}</Td>
                {/* <Td fontSize="sm">{singleEmployee?.employee_basic_information}</Td> */}
                <Td>
                  <Text >
                    active 
                    {/* or inactive or leave */}
                  </Text>
                </Td>
                <Td>
                  <CustomDrawer showModalBtnText="View" drawerSize="xl">
                    <EmployeeDrawer {...singleEmployee} />
                  </CustomDrawer>
                </Td>
                <Td>
                  <CustomDrawer
                  leftIcon={<RiSendPlaneFill />}
                  showModalBtnText="" drawerSize="xl">
                    <UpdateEmployee 
                    first_name={singleEmployee?.user?.first_name} 
                    last_name={singleEmployee?.user?.last_name} 
                    phone_number={singleEmployee?.user?.phone_number} 
                    email={singleEmployee?.user?.email}

                    role={singleEmployee?.user?.user_role}
                    date_of_birth={singleEmployee?.employee_basic_information?.date_of_birth}
                    brief_description={singleEmployee?.employee_basic_information?.brief_description}
                    personal_email={singleEmployee?.employee_contact_information?.personal_email}
                    // personal_email={singleEmployee?.employee_contact_information.personal_email}
                    address={singleEmployee?.employee_contact_information?.address}
                    guarantor_one_first_name={singleEmployee?.employee_contact_information?.guarantor_one_first_name}
                    guarantor_one_last_name={singleEmployee?.employee_contact_information?.guarantor_one_last_name}
                    guarantor_one_address={singleEmployee?.employee_contact_information?.guarantor_one_address}
                    guarantor_one_occupation={singleEmployee?.employee_contact_information?.guarantor_one_occupation}
                    guarantor_one_age={
                      parseInt(
                        singleEmployee
                      ?.employee_contact_information?.guarantor_one_age
                      )}
                    guarantor_one_id_card={singleEmployee?.employee_contact_information?.guarantor_one_id_card}
                    guarantor_one_passport={singleEmployee?.employee_contact_information?.guarantor_one_passport}



                    guarantor_two_first_name={singleEmployee?.employee_contact_information?.guarantor_two_first_name}
                    guarantor_two_last_name={singleEmployee?.employee_contact_information?.guarantor_two_last_name}
                    guarantor_two_address={singleEmployee?.employee_contact_information?.guarantor_two_address}
                    guarantor_two_occupation={singleEmployee?.employee_contact_information?.guarantor_two_occupation}
                    guarantor_two_age={parseInt(singleEmployee?.employee_contact_information?.guarantor_two_age)}
                    guarantor_two_id_card={singleEmployee?.employee_contact_information?.guarantor_two_id_card}
                    guarantor_two_passport={singleEmployee?.employee_contact_information?.guarantor_two_passport}
                    level={
                      (singleEmployee?.corporate_level&&"corporate_level") ||
                      (singleEmployee?.group&&"group") ||
                      (singleEmployee?.unit&&"unit") ||
                      (singleEmployee?.division&&"division")||"error finiding level"
                    }
                    // level_name={}
                    level_id={
                      singleEmployee?.corporate_level?.uuid ||
                      singleEmployee?.group?.uuid ||
                      singleEmployee?.unit?.uuid ||
                      singleEmployee?.division?.uuid||"error finiding level"
                    }
                    designation_name={singleEmployee?.employee_basic_information?.designation.name}
                    career_path_level={singleEmployee?.career_path?.level?JSON.stringify(singleEmployee?.career_path.level):""}
                    education_details={
                      singleEmployee?.employee_basic_information?singleEmployee?.employee_basic_information?.education_details:[
                        {
                          institution: "",
                          year: 2020,
                          qualification: "",
                        }
                      ]
                    }
                    date_employed={singleEmployee.employee_employment_information?.date_employed|| ""}
                    employee_uuid={singleEmployee?.uuid}
                    />
                  </CustomDrawer>
                </Td>
                <Td>
                  <Button
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{
                    if(!org_name) return 
      if(window.confirm("Are Sure You Want to Delete")){
        dispatch(DeleteEmployeeApi({"uuid":singleEmployee.uuid,"org_name":org_name,handleError}))
}
                  }}
                  ></Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      


      {/* <Button disabled={!previousPage || status=='loading'}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage  || status=='loading'}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button> */}

    <PaginatedItems 
      pageCount={num_of_page}
      onPageClick={(pageNumberClick)=>{
        if (!org_name) return 
        dispatch(getAllEmployees({"org_name":org_name,"pagenum":pageNumberClick,handleError}))
      }}
    />
    </Box>
  );
};
export default Employees;
