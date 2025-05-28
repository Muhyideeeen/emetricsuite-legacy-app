
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
  ModalHeader,FormControl,
  ModalOverlay,Input,
  useDisclosure,FormLabel,MenuItem,Skeleton,
  useToast,Textarea ,Checkbox, Tooltip
} from "@chakra-ui/react";
import bagIcon from "../../assets/icons/bag-frame.svg";
import InputWithLabel from "../../components/InputWithLabel";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid_v4 } from "uuid";
import { useAppDispatch,useAppSelector } from "../../redux/hooks";
import { selectTaskSubmission } from "../../redux/TaskSubmission/TaskSubmissionSlice";
import { getTaskSubmission,createTaskSubmission, handleCreateError } from "../../redux/TaskSubmission/TaskSubmissionApi";
import { useErrorHandler } from "react-error-boundary";
import axios from "../../services/api";
import { useState,useEffect } from "react";
import errorMessageGetter from "../../utils/errorMessages";
import ReworkTaskModl from "./ReworkTaskModal";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";
import GoodAlert from "../../components/GoodAlert";
import Preloader from "../../components/Preloader";
import { createDanloadAbleFile } from "../../services/extraFunctions";


export interface SubmitTaskModalType{
    "rating_remark":string;
    quality_target_point_achieved?:number;
    quantity_target_unit_achieved?:number;
    submission:any;
    use_owner_submission:boolean;
}

const schema = yup.object().shape({
  rating_remark:yup.string().required("enter your remark"),
    quality_target_point_achieved:yup.number(),
    quantity_target_unit_achieved:yup.number(),
    submission:yup.mixed(),
    use_owner_submission:yup.boolean(),
})
// .test("quality_target_point_achieved","",(obj)=>{
// console.log(obj)
  

//   return true
// })

const RateTaskModal:React.FC<{
   
    task_id:string;task_type:string;
    isOwner:boolean;isCorporateTeamLead:boolean;
    status:string;quantity_target_point?:string;
    quality_target_point:number;
}>=({
    
    task_id,task_type,isOwner,isCorporateTeamLead,
    status,quantity_target_point,quality_target_point
})=>{
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const  { isOpen: isReworkOpen , onOpen: onReworkOpen, onClose: onReworkClose } = useDisclosure();
  const handleError = useErrorHandler();
  const dispatch=useAppDispatch();
  const  {
    status:tasksSubmmissionStatus,tasksSubmmission,errorMessage
  } = useAppSelector(selectTaskSubmission)

  const toast = useToast();

  const {
    register,
    handleSubmit,control,setValue,
    formState: { errors },reset,getValues
  } = useForm<SubmitTaskModalType>({ resolver: yupResolver(schema) });
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [useSubmmisonFile,setUseSubmmisonFile]=useState<boolean>(false);
  const [useOwnerQtySubmmision,setUseOwnerQtySubmmision] = useState(false)
  const SubmitTaskApi=  async (form:FormData)=>{

    const org_name = localStorage.getItem("current_organization_short_name");

    if(org_name){
      
      console.log(task_id,"myid")
      // console.log(data,'rting data')
      try{
        
        const resp = await axios.put(`client/${org_name}/task/${task_id}/rate/`,form)
        setIsLoading(false)//here it will stop Loading..

        console.log(resp.data,"Stuff status")
        toast({
          title:"Rated Successfully!",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        })
       
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }
      catch(err:any){
        console.log({err})
        if(err.response.status === 401){
              handleError(err)
        }else{
          console.log(err.response)
          if(err.response.status === 403){
            toast({
              title:( err.response.data.message )  ,
              status: "error",
              position: "top",
              duration: 5000,
              isClosable: true,
            })
          }else{  
            let errorData:any=handleCreateError(err.response.data)[0]

            // if()
            try{
              toast({
                title:errorData.message[errorData.field],
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
              })
            }catch(err:any){
              toast({
                title:errorData.message,
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
              })
            }
            

          }
          setIsLoading(false)//here it will stop Loading..
          console.log(err.response.data,"the status")
          console.log(err.response,'some error occured')
                }
      }
      
    }

    

  }

  const onSubmit:SubmitHandler<SubmitTaskModalType>=(data)=>{
    setIsLoading(true)
      const form = new FormData();
      form.append("rating_remark",data.rating_remark);

    // task_type
    if((taskType==="qualitative")|| (taskType==="quantitative_and_qualitative")){
      if(data.quality_target_point_achieved){
        form.append('quality_target_point_achieved',JSON.stringify(+data.quality_target_point_achieved))
        // form.append('quality_target_point_achieved',JSON.stringify(+data.quality_target_point_achieved))
      }


    }

  

//this menas if there is use_owner_submission true upload the file else just tell the backeend it we dont want to submit file
      if(data.use_owner_submission === false){
        form.append('submission',data.submission[0])
      }
if(useSubmmisonFile === false){
  if(data.quantity_target_unit_achieved){
    form.append('quantity_target_unit_achieved',JSON.stringify(+data.quantity_target_unit_achieved))
  }

}

      form.append("use_owner_submission",JSON.stringify(
        data.use_owner_submission
        ))

      console.log({
        "user owner":form.get("use_owner_submission"),
        "quality_target_point_achieved":form.get("quality_target_point_achieved"),
        "submission ":form.get("submission"),
        "form form":"you"
      
      })

  // this function submitts the Data
      SubmitTaskApi(form)
  }

    const [taskType,setTaskType] = useState(task_type)


const handleAbleToRate=():boolean=>{
  let allow = false//dont allow
  if(TypeVerifierUserChecker(["team_lead"],"client_tokens")){
    // check first if this person is a team lead... give access
    
    if(isCorporateTeamLead){
      //if is corprate give him access 
      return true
    }else if(isOwner){
      //else if this person is a owner_and_team dont give access to rate his stuff
      return false
    }else{
      //else this means he is just a team lead not a corprate or an owner of a task
      return true
    }

  }
  return false
}



useEffect(()=>{
setValue("use_owner_submission",useSubmmisonFile)
},[useSubmmisonFile])

useEffect(()=>{
  
  if(quality_target_point){
    setValue("quality_target_point_achieved",+quality_target_point)
  }


      
    },[])

  useEffect(()=>{
  let org_name = localStorage.getItem('current_organization_short_name')

    if(org_name){
      if(isOpen){
        dispatch(getTaskSubmission({org_name,handleError,"task_id":task_id}))
      }
    }
    console.log({isOpen})
  },[isOpen])
    
useEffect(()=>{
  if(tasksSubmmissionStatus==='succeeded'){
    if(quantity_target_point){
      //after we got the subbission we set the quantity_target_unit_achieved in the form
      if(tasksSubmmission.length !==0){
        let quantity_target_unit_achieved= tasksSubmmission[0].quantity_target_unit_achieved
        if(quantity_target_unit_achieved){
        console.log("called",{'q':tasksSubmmission[0].quantity_target_unit_achieved})

          setValue("quantity_target_unit_achieved",+quantity_target_unit_achieved)
        }
      }
    }

    console.log({
      tasksSubmmission
    })
  }
},[tasksSubmmissionStatus])
return (
/*
On load of the modal show the alert
if yes enable file submmision,
if no disable file submmission

but there should be a checkBox That allows u to toggle later
*/ 

    <>
    {/* //   <Button onClick={onOpen}>Setup Corporate Level</Button> */}
    {(taskType==="qualitative")|| (taskType==="quantitative_and_qualitative") || taskType===('quantitative')?
    <MenuItem 

    isDisabled={!(handleAbleToRate()&&['awaiting_rating'].includes(status) )}
          onClick={onOpen}>Rate</MenuItem>:""}
    <Box
     
    >
      <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
        <Text fontWeight="semibold" color="secondary.900" mb="4">
      Rate Task
      </Text>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex my="3" ml="0">
              <Image src={bagIcon} ml={2} />
              <Box ml={2}>
                <Text as="h1" fontWeight="bold">
                 Rate Task
                </Text>
                <Text as="h2" fontSize="md" color="gray.600">
                  {/* Start to su up your organisation structure here */}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton size="xs" />
          <ModalBody>
         
          {tasksSubmmissionStatus==='loading'&&<Preloader/>}
    

          {/* for creating quantitative task or quantitative_and_qualitative */}
          <form id="rate-task"
             onSubmit={handleSubmit(onSubmit)}
          >
{/* 
<GoodAlert 
            title="Are you adopting the submitted file?"
            details={`
                    
            Are you adopting the submitted file (report) as the final copy for report generation?   
    
            `}
            closeText={"No"}
            submitText={'Yes'}
            onCloseFunc={()=>{
              setUseSubmmisonFile(false)
            }}
            onSubmitFunc={()=>setUseSubmmisonFile(true)}
        /> */}

          {
           (taskType==="qualitative")|| (taskType==="quantitative_and_qualitative")?
           <>
      
        <InputWithLabel
        id="quality_target_point_achieved"
        label="Quality Target Point Achieved"
        size="lg"
        variant="filled"
        placeholder=""
        bg="secondary.200"
        //  disabled={true}
        //  value={quantity_target_point}
        // disabled={false}
        register={register('quality_target_point_achieved')}
        />
        
         </>
          :""}


{/* Quantitative */}

{/* <GoodAlert 
            title="Are you able to accept and confirm the quantity submission made by the task owner?"
            details={`
            If the answer is yes, then the assiggnor will be required to just add his or her remark. 
            ,and the system uses the quantity submitted by the task owner for the rating
            `}
            closeText={"No"}
            submitText={'Yes'}
            onCloseFunc={()=>{
              setUseOwnerQtySubmmision(false)
            }}
            onSubmitFunc={()=>setUseOwnerQtySubmmision(true)}
        /> */}
{
   (taskType==="quantitative")|| (taskType==="quantitative_and_qualitative")?
<>

        {
          (useOwnerQtySubmmision)?"":
            <InputWithLabel
            id="quantity_target_point_achieved"
            label="Quantity Target Point Achieved"
            size="lg"
            variant="filled"
            placeholder=""
            bg="secondary.200"
            register={register('quantity_target_unit_achieved')}
            />
           
          }
  <Tooltip label="Using the task owner quantity submission, means the assiggnor will be required to just add his or her remark. 
            ,and the system uses the quantity submitted by the task owner for the rating">
          
        <Box>
        <Checkbox 
          onChange={(e)=>setUseOwnerQtySubmmision(!useOwnerQtySubmmision)}
          // value={'true'}
          isChecked={useOwnerQtySubmmision}
          >use the quantity submitted by the task owner</Checkbox>

        </Box>
  </Tooltip>

</>
   :""
   
}
   
<br />
<Controller
              name={'rating_remark'}
control={control}
render={({field})=>(
<Textarea 
                id="rating_remark"
                // @ts-ignore
                label="Rating Remark"

                size="lg"
                variant="filled"
                placeholder="enter your remark here"
                bg="secondary.200"
                // {...register('rating_remark')}
                onChange={(e)=>{
                  return field.onChange(e)
              }}
                // type={'number'}
                
                // isReadOnly={true}
                // value={current_organization_short_name}
                // register={register("quantity_target_unit_achieved")}
                // formErrorMessage={errors.quantity_target_unit_achieved?.message}
              />

)} 
/>


{!useSubmmisonFile&&(
  <Box>
  <Text fontWeight="semibold" fontSize="sm" mb="4">
  Upload corrected file
  </Text>
  <HStack mb="5">
    <FormControl id="submission">
      <Input type="file" 
      {...register('submission')}
      variant="filled" bg="transparent" />
    </FormControl>
  {/* @ts-ignore */}
    <Text color={"crimson"}>{errors?.use_owner_submission}</Text>
  </HStack>
</Box>
         )}

<Tooltip label="Are you adopting the submitted file (report) as the final copy for report generation?">
<Box>

          <Checkbox 
          onChange={(e)=>setUseSubmmisonFile(!useSubmmisonFile)}
          // value={'true'}
          isChecked={useSubmmisonFile}
          >adopt Submitted File</Checkbox>
        </Box>
    </Tooltip>

<br />
<br />

  {
    (tasksSubmmissionStatus==='succeeded'&&tasksSubmmission.length !==0)?

    <Text as="a" 
    colorScheme={'blue'}
  href={tasksSubmmission[0].submission?tasksSubmmission[0].submission:'#'}
        rel="nofollow noreferrer" download
        target={'_blank'}
  >
    <Button fontSize={'.8rem'}> 
        {
          tasksSubmmission[0].submission?'download employee uploaded file':'employee did not upload any data'
        }
    </Button>
    </Text>:''
  } 
          </form>

          </ModalBody>
          <ModalFooter>
            <Flex width={"100%"}  justifyContent={"space-between"}>
            <Button
              type="submit"
              form="rate-task"
              variant="primary"
              w="full"
              isLoading={isLoading}
              loadingText="Submitting"
              marginRight={"10px"}
            >
              Submit
            </Button>


           

        
            </Flex>

          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
</>
  )
}


export default RateTaskModal