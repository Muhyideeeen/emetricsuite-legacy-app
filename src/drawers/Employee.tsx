import {useState,useEffect} from "react"
import {
  DrawerBody,
  DrawerHeader,
  Flex,
  Text,
  Image,
  Box,
  Button,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  DrawerCloseButton,
  Heading,
  Grid,useDisclosure, useToast
} from "@chakra-ui/react";
import axios from "../services/api";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import {BsFolder}
from  "react-icons/bs";
import perspectivesIcon from "../assets/icons/perspectivesIcon.svg";
import folder from "../assets/icons/folder.svg";
import avatar from "../assets/icons/avatar.png";
import tempAvatar from "../assets/icons/tempAvatar.svg";
import { Employee, selectEmployees } from "../redux/employees/employeesSlice";
import {useErrorHandler} from "react-error-boundary";
import moment from "moment";
import UploadEmployeeDocs from "../modal/UploadEmployeeDocs";
import Preloader from "../components/Preloader"
import {RiDeleteBin5Fill} from "react-icons/ri";
import {GrInstallOption} from "react-icons/gr";
import { EditEmployee, EmployeeData } from "../redux/employees/employeesAPI";
import {createDanloadAbleFile} from '../services/extraFunctions'
import EmployeeStatus from "../tabs/EmployeeStatus";
import { AddEmployeeInputs } from "./AddEmployee";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const EmployeeDrawer: React.FC<EmployeeData> = (props) => {
  const org_name = localStorage.getItem("current_organization_short_name");
  const dispatch = useAppDispatch()
  const {status:employee_api_status} = useAppSelector(selectEmployees)
  const handleError = useErrorHandler()
  const handleImageChange =({data,profile_image}:{data:EmployeeData,profile_image:any})=>{
    //
    console.log({profile_image})
    if(!profile_image) return 
    const ready_file_profile_pic:any = profile_image
    if(org_name){
      const structure:any =(data?.corporate_level&&data?.corporate_level) ||
      (data?.group&&data?.group) ||
      (data?.unit&&data?.unit) ||
      (data?.division&&data?.division)||(data?.department&&data?.department)
      
      if(!structure)return 
      
      let level_name = ''
      if(data.corporate_level){
          level_name='corporate_level'
      }
      if(data.group){
          level_name='group'
      }
      if(data.department){
          level_name='department'
      }
      if(data.unit){
          level_name='unit'
      }
      if(data.division){
          level_name='division'
      }
      if(data.department){
          level_name='department'
      }
      const final_data:AddEmployeeInputs={
          first_name:data.user.first_name,
          last_name:data.user.last_name,
          email:data.user.email,
          phone_number:data.user.phone_number,
          role:data.user.user_role,
          date_of_birth:data.employee_basic_information.date_of_birth,
          brief_description:data.employee_basic_information.brief_description,
          personal_email:data.employee_contact_information.personal_email,
          address:data.employee_contact_information.address,
          guarantor_one_first_name: data.employee_contact_information.guarantor_one_first_name,
          guarantor_one_last_name: data.employee_contact_information.guarantor_one_last_name,
          guarantor_one_address: data.employee_contact_information.guarantor_one_address,
          guarantor_one_occupation:data.employee_contact_information.guarantor_one_occupation,
          guarantor_one_age:+data.employee_contact_information.guarantor_one_age,
          "guarantor_one_id_card":null,
          "guarantor_one_passport":null,
          
          guarantor_two_first_name:data.employee_contact_information.guarantor_two_first_name,
          guarantor_two_last_name: data.employee_contact_information.guarantor_two_last_name,
          guarantor_two_address:data.employee_contact_information.guarantor_two_address,
          guarantor_two_occupation:data.employee_contact_information.guarantor_two_occupation,
          guarantor_two_age:+data.employee_contact_information.guarantor_two_age,
          "guarantor_two_id_card":null,
          "guarantor_two_passport":null,
          date_employed: data.employee_employment_information.date_employed?data.employee_employment_information.date_employed:'',
          level:level_name,
          level_id:structure.uuid,
          designation_name:data.employee_basic_information.designation.name,
          career_path_level:data.career_path?data.career_path.level.toString():'',
          education_details:data.employee_basic_information.education_details,
          employee_uuid:data.uuid,
          status:data.employee_employment_information.status?data.employee_employment_information.status:'active',
          'profile_picture':ready_file_profile_pic
      }
      dispatch(EditEmployee({data:final_data,org_name,handleError}))
  }
  }
  return (
    <>
    {employee_api_status==='updating'&&<Preloader/>}
    {/* @ts-ignore */}
      <DrawerHeader w="85%" mx="auto" mt="5">
        <Flex justify="space-between">
          <Flex alignItems="baseline">
            <DrawerCloseButton
              as={HiOutlineChevronLeft}
              display="block"
              position="relative"
            />
            <Text mt={-1} ml={5} fontSize="lg">
              Employee Page
            </Text>
          </Flex>
          <Image src={avatar} objectFit="contain" />
        </Flex>
        <Flex mt="5" mb="2">
          <Image src={
            props.employee_basic_information.profile_picture?
            props.employee_basic_information.profile_picture:
            tempAvatar
            } mr={2} style={{'width':'150','height':'150px','borderRadius':'50%'}} />
         {/* @ts-ignore */}
          <Box justify="center" mt={5}>
            <Text fontSize="lg">
              {props.user.first_name} {props.user.last_name}
            </Text>
            <Text as="small" fontSize="md">
              {" "}
              Grade Level : {props.career_path?props.career_path?.level:"No Career Path at the moment"}
            </Text>
          </Box>
        </Flex>
        <input type="file" onChange={(e)=>{handleImageChange({data:props,profile_image:e.target.files})}} />
      </DrawerHeader>

      <DrawerBody w="85%" mx="auto">
        <Tabs colorScheme="primary">
          <TabList>
            <Tab fontWeight="bold" color="gray.600" mr={8}>
              <Image src={perspectivesIcon} mr={2} />
              Employee Information
            </Tab>
            <Tab fontWeight="bold" color="gray.600">
              <Image src={folder} mr={2} />
              Document
            </Tab>
            <Tab fontWeight="bold" color="gray.600">
              <Image src={folder} mr={2} />
              Employee Status
            </Tab>

          </TabList>

          <TabPanels>
            <TabPanel>
              <EmployeeInformation
                // designation={props.employee_designation?props.employee_designation:""}
                profile={props.employee_basic_information?props.employee_basic_information.brief_description:null}
                personalEmail={props.user.email?props.user.email:""}
                officialEmail={props.employee_contact_information?
                  props.employee_contact_information.official_email:""}
                phoneNumber={props.user.phone_number?props.user.phone_number:""}
                dateEmployed={props?.employee_employment_information?.date_employed}
                dateOfBirth={props.employee_basic_information?props.employee_basic_information.date_of_birth:null}
                address={props.employee_contact_information?props.employee_contact_information.address:null}
                team_lead={props.employee_employment_information?.upline}
                designationProp={props.employee_basic_information}
                level={
                  (props?.corporate_level&&props?.corporate_level) ||
                  (props?.group&&props?.group) ||
                  (props?.unit&&props?.unit) ||
                  (props?.division&&props?.division)||"error finiding level"
                }
                
                data={props}
             />
            </TabPanel>
            <TabPanel>
              <Document {...props} />
            </TabPanel>

            <TabPanel>
              <EmployeeStatus  {...props}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DrawerBody>
    </>
  );
};
export default EmployeeDrawer;

export const EmployeeInformation: React.FC<{
  address:string|null;
  // designation: string;
  profile: string|null;
  personalEmail: string|null;
  officialEmail: string|null;
  phoneNumber: string|null;
  dateEmployed: string|null;
  dateOfBirth: string|null;
  team_lead:any;
  designationProp:any;
  level:any;
  data:EmployeeData;
  // { user_id:string;email:string;first_name:string;last_name:string;}
}> = ({ address, designationProp, profile,
   personalEmail, officialEmail, phoneNumber,
    dateEmployed, dateOfBirth,team_lead,level,
   
  data
  }) => {
    
  return (
    <Stack spacing="6">
      <Box>
        <Heading as="h5" size="sm" color="primary" mb="4">
          Basic Information
        </Heading>
        <Box mb="4">
          <Text fontWeight="semibold">Profile</Text>
          <Text fontSize="smaller">{profile}</Text>
        </Box>
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
          <Box>
            <Text mb={1} fontWeight="semibold">
              Team
            </Text>
            <Text as="small" color="gray.500">
              {data?.department?.name}
              {data?.corporate_level?.name}
              {data?.unit?.name}
              {data?.group?.name}
              {data?.division?.name}
            </Text>
          </Box>
          <Box>
            <Text mb={1} fontWeight="semibold">
              Designation
            </Text>
            <Text as="small" color="gray.500">
              {designationProp?
            designationProp.designation?.name:"NiLL"  
            }
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Date of birth
            </Text>
            <Text as="small" color="gray.500">
              {dateOfBirth}
            </Text>
          </Box>


          <Box>
            <Text fontWeight="semibold" mb="1">
             Email
            </Text>
            <Text as="small" color="gray.500">
              {data.user.email}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
             Phone number
            </Text>
            <Text as="small" color="gray.500">
              {data.user.phone_number}
            </Text>
          </Box>


          
        </Grid>
      </Box>

      <Box>
      <Heading as="h5" size="sm" color="primary" mb="4">
      Education Details
        </Heading>

          
        {data.employee_basic_information.education_details.map((emp_data)=>(
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
          
              <Box>
              <Text fontWeight="semibold" mb="1">
              Institution
            </Text>
              <Text as="small" color="gray.500">
              {emp_data.institution}
              </Text>
              </Box>


              <Box>
              <Text fontWeight="semibold" mb="1">
              Year
            </Text>
            <Text as="small" color="gray.500">
                  {emp_data.year}
              </Text>
              </Box>

              <Box>
              <Text fontWeight="semibold" mb="1">
              Qualification
            </Text>
            <Text as="small" color="gray.500">
                  {emp_data.qualification}
              </Text>
              </Box>
          
        </Grid>
))}
             


      </Box>



      <Box>
        <Heading as="h5" size="sm" color="primary" mb="4">
          Contact Information
        </Heading>
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
          <Box>
            <Text mb={1} fontWeight="semibold">
              Personal Email
            </Text>
            <Text as="small" color="gray.500">
              {personalEmail}
            </Text>
          </Box>
          <Box>
            <Text mb={1} fontWeight="semibold">
              Official Email
            </Text>
            <Text as="small" color="gray.500">
             {officialEmail}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Phone Number
            </Text>
            <Text as="small" color="gray.500">
              {phoneNumber}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Address
            </Text>
            <Text as="small" color="gray.500">
              {address}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor One Full Name
            </Text>
            <Text as="small" color="gray.500">
              {data?.employee_contact_information?.guarantor_one_first_name
              } 
                {" "}
                {data?.employee_contact_information?.guarantor_one_last_name}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor One Address
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_one_address } 
              
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor One Occupation
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_one_occupation } 
              
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor One Age
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_one_age } 
              
            </Text>
          </Box>
<Box></Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor two Full Name
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_two_first_name
              } 
                {" "}
                {data?.employee_contact_information?.guarantor_two_last_name}
            </Text>
          </Box>


          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor two Address
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_two_address } 
              
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor two Occupation
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_two_occupation } 
              
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
            Guarantor two Age
            </Text>
            <Text as="small" color="gray.500">
            {data?.employee_contact_information?.guarantor_two_age } 
              
            </Text>
          </Box>

        </Grid>
      </Box>

      <Box>
        <Heading as="h5" size="sm" color="primary" mb="4">
          Employment Information
        </Heading>
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
          <Box>
            <Text mb={1} fontWeight="semibold">
              Date employed
            </Text>
            <Text as="small" color="gray.500">
              {dateEmployed}
            </Text>
          </Box>
          <Box>
            <Text mb={1} fontWeight="semibold">
              Date of last promotion
            </Text>
            <Text as="small" color="gray.500">
              {data?.employee_employment_information?.date_of_last_promotion}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Name of upline/team lead
            </Text>
            <Text as="small" color="gray.500">
             {team_lead?
            team_lead.first_name+"  "+team_lead.last_name:"NiL" 
            }
            </Text>
          </Box>
        </Grid>
      </Box>
    </Stack>
  );
};
export const Document:React.FC<EmployeeData> = ({removeAddDoc=true,...props}) => {
  interface DocsType{
    "uuid": string,
    "name": string,
    "value": number|string,
    "file": string,
    "created_at": string
  }
  const handleError = useErrorHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading,setIsLoading]=useState(false)
  const [docs,setDocs] = useState<DocsType[]>([])
  const toast = useToast()
  const getDocs = async()=>{
    const org_name =localStorage.getItem("current_organization_short_name")
        
        if(!org_name) return 
        setIsLoading(true);
        try{
            const resp = await axios.get(`/client/${org_name}/employee-file/?employee_id=${props.uuid}`)
           console.log({
               resp
           })
           const ConfirmData= resp.data.data
           
           setDocs(ConfirmData.map((data:DocsType)=>{
             return {"uuid":data.uuid,"name":data.name,"value":data.value,
             "file":data.file,"create_at":data.created_at
            }
           }))
           setIsLoading(false);

        }
        catch(err:any){
            console.log({
                err
            })
            if(err.status===401||err.response.status===401){
                handleError(err)
              
            }
           setIsLoading(false);

        }
        setIsLoading(false);

  } 

  const handleDelete = async(uuid:string)=>{
    const org_name =localStorage.getItem("current_organization_short_name")
        
    if(!org_name) return 
    setIsLoading(true);
    try{
        const resp = await axios.delete(`/client/${org_name}/employee-file/${uuid}/`)
       console.log({
           resp
       })
      //  const ConfirmData= resp.data.data
       
      //  setDocs(ConfirmData.map((data:DocsType)=>{
      //    return {"uuid":data.uuid,"name":data.name,"value":data.value,
      //    "file":data.file,"create_at":data.created_at
      //   }
      //  }))
      if(resp.status==204){

          // docs
          setDocs([...docs.filter(data=>data.uuid !==uuid)])
        toast({
          title: "Deleted Successfully",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
      }
       setIsLoading(false);

    }
    catch(err:any){
        console.log({
            err
        })
        if(err.status===401||err.response.status===401){
            handleError(err)
          
        }
       setIsLoading(false);

    }
    setIsLoading(false);
  }

  useEffect(()=>{
    getDocs()
  },[])
  return (
    <Box mt={4}>
      <Text>Showing {docs.length} documents</Text>
     
    {isLoading&& <Preloader/>}
      <Grid
      gridTemplateColumns="repeat(2, 1fr)"
      alignItems="end"
      columnGap="3"
      rowGap={"3"}
      mb="3"
      >

{
  removeAddDoc?
  <>
      <Flex
            w="300px"
            h="200px"
            border="dashed"
            borderColor="gray.400"
            borderRadius="md"
            p="10"
            mt="4"
            align="center"
            justify="center"
          >
            <Flex
              color="gray.400"
              align="center"
              justify="center"
              direction="column"
            >
              <Button
                color="gray.400"
                _hover={{ bgColor: "white" }}
                bgColor="white"
                onClick={onOpen}
              >
                <HiOutlinePlus size="sm" color="gray.400" />
              </Button>
              <Text>Add new document</Text>
            </Flex>
          </Flex>
          
          <UploadEmployeeDocs

    isOpen={isOpen} 
    onOpen={onOpen}
    onClose={onClose}
    employee_uuid={props.uuid}
    />
   </> 
    :""
 
}







{
  docs.map(docData=>(

    <Flex
    w="300px"
    h="200px"
    border="1px"
    borderColor="gray.400"
    borderRadius="md"
    p="10"
    mt="4"
    align="center"
    justify="center"
    style={{"position":"relative"}}
  >
{
  removeAddDoc?
<Button 
leftIcon={<RiDeleteBin5Fill/>}
style={{"backgroundColor":"white","position":"absolute","right":"0","top":"0"}}
onClick={(e)=>handleDelete(docData.uuid)}
isLoading={isLoading===true}
/>:""
}

    
    <Flex
      color="gray.400"
      align="center"
      justify="center"
      direction="column"
    >
        <BsFolder  color="gray.400"
       style={{"fontSize":"2.3rem"}} 
        />
      <Text>
      {/* @ts-ignore */}
        {docData.value>1?docData.name+`s (${docData.value})`: docData.name}</Text>
    </Flex>

    <Flex
    justifyContent={"space-between"}
    alignItems={"center"}
  style={{
    "backgroundColor":"#F2F2F2",
    "position":"absolute",
    "bottom":"0",
    "left":"0","width":"100%","padding":".3rem .5rem",
    "borderBottomRightRadius":"9px",
    "borderBottomLeftRadius":"9px",

  }}
    >
      {/* <a >dd</a> */}
      
      <Text as="a" 
      href={createDanloadAbleFile(docData.file)}
            rel="nofollow noreferrer" download
      >
        
        <GrInstallOption/>
      </Text>

      <Text>
        {moment(docData.created_at).format("DD-MM-YYYY")}
      </Text>
    </Flex>
  </Flex>

  ))
}




      </Grid>

    </Box>
  );
};
