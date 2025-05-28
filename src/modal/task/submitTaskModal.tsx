
import { useEffect,useState } from "react";
import {
  Box,
  Text,
  Center,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,Input,
  useDisclosure,FormLabel,
  useToast,Checkbox
} from "@chakra-ui/react";
import bagIcon from "../../assets/icons/bag-frame.svg";
import InputWithLabel from "../../components/InputWithLabel";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid_v4 } from "uuid";
import { useAppDispatch,useAppSelector } from "../../redux/hooks";
// import {selectTaskSubmission} from "../../redux/TaskSubmission/TaskSubmissionSlice"

import { selectTaskSubmission } from "../../redux/TaskSubmission/TaskSubmissionSlice";
import { getTaskSubmission,createTaskSubmission ,handleCreateError} from "../../redux/TaskSubmission/TaskSubmissionApi";
import { useErrorHandler } from "react-error-boundary";



export interface submitTaskModalInput{
  "task_id":string;
  submission_file:any;
  quantity_target_unit_achieved?:string;
  is_qualitative:boolean;

}
const schema = yup.object().shape({
  submission_file:yup.mixed(),
  quantity_target_unit_achieved:yup.mixed(),
  is_qualitative:yup.boolean()
}).test("customTest","",(obj)=>{

  if(obj.is_qualitative==true){
   if(!obj.quantity_target_unit_achieved){
     console.log("What ft")
    return new yup.ValidationError('qty Achieved is required ',null,"quantity_target_unit_achieved")

   }
      if(isNaN(parseInt(obj.quantity_target_unit_achieved))){

    return new yup.ValidationError('qty Achieved is required and must be a number ',null,"quantity_target_unit_achieved")

      
    }

  }

  return true

})
const SubmitTaskModal:React.FC<{
  isOpen:any;
  onOpen:()=>void;
  onClose:()=>void;
  task_id:string;
  task_type:string;
}> = ({
  isOpen,
   onOpen,
    onClose ,task_id,task_type
})=>{


  const toast =useToast()
  const {
    register,
    handleSubmit,control,setValue,
    formState: { errors },reset,getValues
  } = useForm<submitTaskModalInput>({ resolver: yupResolver(schema) });
  
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
const {
 status
} =  useAppSelector(selectTaskSubmission)
  // selectTaskSubmission  
  const [isUploadFile,setIsUploadFile] =useState(true)

  // const { isOpen, onOpen, onClose } = useDisclosure();
   
  const onSubmit:SubmitHandler<submitTaskModalInput>= (data) => {
    console.log({"submitted ata":data})
    const formdata=new FormData()
    


    formdata.append("task[task_id]",task_id)

  
    if((
      (task_type=== "quantitative")
      ||
      (task_type==="quantitative_and_qualitative"))
       ){
         if(isUploadFile ===true){
           // if its quantitative then it optional
           formdata.append('submission',data.submission_file[0])
         }
    }else{
      if(task_type==="quantitative_and_qualitative"){
        if(isUploadFile ===true){
          // if its quantitative then it optional
          formdata.append('submission',data.submission_file[0])
        }
      }
      //eles it a qualitative task then we must submit
      formdata.append('submission',data.submission_file[0])
    }


    if(task_type==="quantitative"){
      if(data.quantity_target_unit_achieved){
        formdata.append("quantity_target_unit_achieved",JSON.stringify(+data.quantity_target_unit_achieved))
      }
    }
console.log({isUploadFile})
    
    
    dispatch(createTaskSubmission({
      "formData":formdata,handleError
    }))
  };



  useEffect(()=>{
    setValue("is_qualitative",((task_type=="quantitative")|| (task_type=="quantitative_and_qualitative")))
  },[])

  useEffect(()=>{
      if(status==="added"){
          toast({
            title:"Task Submission has been added successfully",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
          })      
      }


  },[status])

    return (


<>
    {/* //   <Button onClick={onOpen}>Setup Corporate Level</Button> */}
      <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
        <Text fontWeight="semibold" color="secondary.900" mb="4">
        Submit Your Task
      </Text>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex my="3" ml="0">
              <Image src={bagIcon} ml={2} />
              <Box ml={2}>
                <Text as="h1" fontWeight="bold">
                  Submit your task 
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

              

{
                (isUploadFile||(task_type==='qualitative')||(task_type==="quantitative_and_qualitative"))?
                <Box>
                <FormLabel fontSize="xs" htmlFor={'submission_file'} fontWeight="semibold">
                   Upload Task File
                </FormLabel>
  
                <Input type="file"
                  // accept="application/pdf" 
                required
                {...register('submission_file')}
                variant="filled" bg="transparent" 
                      />
  
                </Box>:""
              }
              {
                ((task_type==="qualitative")|| (task_type==="quantitative_and_qualitative"))?""
              
               
                : <Text>
                
                <small>
                remove file upload?
                </small>
                <Checkbox onChange={()=>setIsUploadFile((prevValue)=>!prevValue)} />
              </Text>
               
              }
              
            

              {((task_type==="quantitative")|| (task_type==="quantitative_and_qualitative"))?
              <InputWithLabel
                id="qty_unit_achievd"
                  // @ts-ignore
                label="Qty unit achieved"
                size="lg"
                variant="filled"
                placeholder=""
                bg="secondary.200"
                // type={'number'}
                // isReadOnly={true}
                // value={current_organization_short_name}
                register={register("quantity_target_unit_achieved")}
                formErrorMessage={errors.quantity_target_unit_achieved?.message}
              />:""}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="corporate-level"
              variant="primary"
              w="full"
              isLoading={status ==="adding"}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

</>
    )
}


export default SubmitTaskModal