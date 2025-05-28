
import {
    Box,
    Text,
    Center,
    Button,
    Flex,
    Image,
    Modal,HStack,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,Input,Select,
    useDisclosure,FormLabel,
    useToast,Textarea ,MenuItem,FormControl
  } from "@chakra-ui/react";

  import { useForm, SubmitHandler,Controller } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../../services/list.service";

  import bagIcon from "../../assets/icons/bag-frame.svg";
import { ExcludeDaysInCalendar } from "../../components/DateInput";
import { useEffect,useState } from "react";
import moment from "moment";
import errorMessageGetter from "../../utils/errorMessages";
import axios from "../../services/api";
import { useErrorHandler } from "react-error-boundary";
import { handleCreateError } from "../../redux/TaskSubmission/TaskSubmissionApi";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";

export interface ReworkTaskModal{
  "rework_remark":string;
  rework_end_date :string;
  rework_end_time :string;
}


const schema = yup.object({
  rework_remark:yup.string().required("enter your remark"),
  rework_end_date:yup.string().required("enter end date"),
  rework_end_time:yup.string().required("enter end date"),
})
const ReworkTaskModal:React.FC<{
  task_id:string;
  task_type:string;
  rework_num:number;
  isOwner:boolean;
  isCorporateTeamLead:boolean;
  status:string;
}>=(props)=>{
  const  { isOpen: isReworkOpen , onOpen: onReworkOpen, onClose: onReworkClose } = useDisclosure();
  console.log({'rework_limit':props.rework_num})
  const {
    register,
    handleSubmit,control,setValue,
    formState: { errors },reset,getValues
  } = useForm<ReworkTaskModal>({ resolver: yupResolver(schema) });
  const [IsLoading,setIsLoading] = useState<boolean>(false)
  const toast = useToast();
  const handleError = useErrorHandler()
  const [CurrentOrgnisationSettings,setCurrentOrgnisationSettings]=useState<CurrentOrgnisationSettingsType>({
    "company_name": "",
    "owner_email": "",
    "owner_first_name":"",
    "owner_last_name": "",
    "company_short_name":"",
    "owner_phone_number":"",
    "work_start_time": "",
    "work_stop_time": "",
    "work_break_start_time": "",
    "work_break_stop_time":"",
    "work_days": [],
    "timezone": "",
})

const List_of_start_time= [
  "00:00","00:30",
  "01:00","01:30",
  "02:00","02:30",
  "03:00","03:30",
  "04:00","03:30",
  "05:00","05:30",
  "06:00","06:30",
  "07:00","07:30",
  '08:00',"08:30",
  '09:00',"09:30",
  '10:00',"10:30",
  "11:00","11:30",
  "12:00","12:30",
  "13:00","13:30",
  "14:00","14:30",
  "15:00","15:30",
  "16:00","16:30",
  "17:00","17:30",
  "18:00","18:30",
  "19:00","19:30",
  "20:00","20:30",
  "21:00","21:30",
  "22:00","22:30",
  "23:00","23:30",
  "24:00","24:30",
  ]    

useEffect(()=>{


  let org_settings = localStorage.getItem('org_info')
  if(org_settings){
      setCurrentOrgnisationSettings(JSON.parse(org_settings))
  }


},[])


const SubmitTaskApi=  async (data:ReworkTaskModal)=>{

  const org_name = localStorage.getItem("current_organization_short_name");

  if(org_name){
    
    // if(resp.st)
    setIsLoading(true)//here it will start Loading..
    
    try{
      
      const resp = await axios.put(`client/${org_name}/task/${props.task_id}/rework/`,data)

      console.log(resp,"Stuff status")
      toast({
        title:"Rework Submmited Successfully" ,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      })
      setTimeout(()=>{
        window.location.reload()
      },2000)
      // window.location.reload()

    }
    catch(err:any){
      if(err.response.status === 401){
        handleError(err)
      }else{
        setIsLoading(false)//here it will start Loading..
        console.log(err.response,"the status")
        if(err.response.data.status === 403){
          toast({
            title:err.response.data.message ,
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
          })
        }
        if(err.response.status===400){

          toast({
          // @ts-ignore
            title:handleCreateError(err.response.data.data),
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
          })
        }
        console.log(err.response,'some error occured')
              }
    }
    setIsLoading(false)//here it will start Loading..
    
  }

  

}

const onSubmit:SubmitHandler<ReworkTaskModal>=(data)=>{

    const dataToBeSubmited={
      "rework_remark":data.rework_remark,
      "rework_end_date":moment(data.rework_end_date).format("YYYY-MM-DD"),
      "rework_end_time":data.rework_end_time,
    }

    SubmitTaskApi(dataToBeSubmited)
}

const handleAbleToRework=():boolean=>{
  let allow = false//dont allow
  if(TypeVerifierUserChecker(["team_lead"],"client_tokens")){
    // check first if this person is a team lead... give access
    
    if(props.isCorporateTeamLead){
      //if is corprate give him access 
      return true
    }else if(props.isOwner){
      //else if this person is a owner_and_team dont give access to rate his stuff
      return false
    }else{
      //else this means he is just a team lead not a corprate or an owner of a task
      return true
    }

  }
  return false
}

    return (
        <Box
        as='form'
        // onSubmit={handleSubmit(onSubmit)}

      >
          {/* <MenuItem 
          onClick={onReworkOpen}>Rework</MenuItem> */}
<MenuItem
              type="submit"
              form="rate-task"
      // @ts-ignore
              variant="ghost"
              w="full"
              isDisabled={!(handleAbleToRework()&&(props.rework_num!==0)&& (['awaiting_rating'].includes(props.status))  )}
              // isLoading={isLoading}
              // loadingText="Submitting"
              onClick={onReworkOpen}
            >
              Submit Rework
            </MenuItem>

        <Modal onClose={onReworkClose} size="sm" isOpen={isReworkOpen} isCentered>
          <Text fontWeight="semibold" color="secondary.900" mb="4">
        Rework Task
        </Text>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex my="3" ml="0">
                <Image src={bagIcon} ml={2} />
                <Box ml={2}>
                  <Text as="h1" fontWeight="bold">
                   Rework Task
                  </Text>
                  <Text as="h2" fontSize="md" color="gray.600">
                    {/* Start to su up your organisation structure here */}
                  </Text>
                </Box>
              </Flex>
            </ModalHeader>
            <ModalCloseButton size="xs" />
            <ModalBody>
              <form id="corporate-level"
               onSubmit={handleSubmit(onSubmit)}
               >
                {/* <InputWithLabel
                  id="taskfile"
                  label="upload file"
                  variant="filled"
                  bg="secondary.200"
                  name="corporate-level"
                  
                  // register={register("corporateName")}
                  // formErrorMessage={errors.corporateName?.message}
                  mb="6"
                /> */}
          <Box>
  
         
             
          </Box>
 
                {/* {((task_type==="qualitative")|| (task_type==="quantitative_and_qualitative"))? */}
               

                  <Textarea 
                  id="qty_unit_achievd"
                  // @ts-ignore
                  label="Qty unit achieved"
                  required
                  size="lg"
                  variant="filled"
                  placeholder="enter your remark here"
                  bg="secondary.200"
                  {...register('rework_remark')}
                />
  <br /><br />
        <FormControl>
                  <FormLabel
                    htmlFor="structure_level"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Rework End Date
                  </FormLabel>
                  <ExcludeDaysInCalendar 
                  days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                  disabled={false}
                    name='rework_end_date'
                    control={control}
                    placeholder="Enter Start Date"
                    formErrorMessage={errors.rework_end_date?.message?"Start Date Can Not Be empty":""}
                    dateFormat ="yyyy/MM/dd"
                />

                  </FormControl>
                
                <br/>
                <Box >
                          <Select
                        id={'d4_2'}
                        variant={"filled"}
                        placeholder="Rework End Time"
                        {...register("rework_end_time")}
                          >
                            {
                                List_of_start_time.map(start_time_data=>(
                                    <option value={start_time_data}>{start_time_data}</option>

                                ))
                            }
                        </Select>
                        <Text fontSize="xs" color="crimson">
                          {errors.rework_end_time?.message} 
                          </Text>
                  </Box>
                <br/>

                {/* <Date */}
              </form>
            </ModalBody>
            <ModalFooter>
              <Flex width={"100%"}  justifyContent={"space-between"}>
              <Button
                type="submit"
                form="corporate-level"
                variant="primary"
                w="full"
                isLoading={IsLoading}
                loadingText="Submitting"
              >
                Submit
              </Button>
  
  
  
            
              
              </Flex>
  
            </ModalFooter>
          </ModalContent>
        </Modal>
        </Box>
    )
}


export default ReworkTaskModal