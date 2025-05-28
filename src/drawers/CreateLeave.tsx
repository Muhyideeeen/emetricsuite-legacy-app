import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Button,
    FormControl,
    FormLabel,
    Text,
    Select,
    useToast,
    Skeleton, Checkbox, CheckboxGroup
  } from "@chakra-ui/react";


  import { useForm, SubmitHandler } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
import InputWithLabel from "../components/InputWithLabel";
import SelectAsyncPaginate from "../components/AsyncSelect";
import { useEffect, useState } from "react";
import { createLeaveApi, LeaveType } from "../redux/LeaveManagement/LeaveManagementApi";
import { useErrorHandler } from "react-error-boundary";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useSelector } from "react-redux";
import { selectLeave, setLeaveStatusToIdle } from "../redux/LeaveManagement/LeaveManagementSlice";
  


const schema = yup.object().shape({
    leave_choice: yup.string().required("Leave Choice is required"),
    duration: yup.number().required("duration is required"),
    leave_allowance: yup.string().required(),
    leave_formula:yup.number().required(),
    grade_level:yup.string(),
})
const CreateLeave = ()=>{
    const org_name=  localStorage.getItem('current_organization_short_name')
    const [careerPaths,setCareerPaths] =useState<any>()
    const handleError = useErrorHandler();
    const dispatch  = useAppDispatch()
    const { status ,data ,errMessage } = useAppSelector(selectLeave)
    const [forAll,setForAll] = useState(true)
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,setValue
      } = useForm<LeaveType>({ resolver: yupResolver(schema) });

      const onSubmit: SubmitHandler<LeaveType> = submited_data =>{
        if(org_name){
            dispatch(createLeaveApi({handleError,data:submited_data,org_name,forAll}))
        }
      }

      useEffect(()=>{
        if(status==='created'){
            toast({
                title: 'Created Successfully',
                status: "success",
                position: "top",
                duration: 3000,
                isClosable: true,
              })
              //set status to idle
              dispatch(setLeaveStatusToIdle({}))
              if(forAll){
                setTimeout(()=>{
                    window.location.reload()
                },2000)

              }
        }
        if(status==='error'){
            toast({
                title:errMessage,
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
              })
              dispatch(setLeaveStatusToIdle({}))

        }
      },[status])

      
      return (
        <>
        <DrawerCloseButton />
        <DrawerHeader fontSize="md">Leave Creation</DrawerHeader>


            <DrawerBody>
                <form
                onSubmit={handleSubmit(onSubmit)}
                id="add-leave-form">
       <FormLabel  mb="3" fontSize="xs" htmlFor={'leave_type'} fontWeight="semibold">
                Leave Type
                </FormLabel>
                    <Select   mb="3" placeholder='Leave Type'
                    {...register('leave_choice')}
                    >
                    <option value='annual'>Annual</option>
                    <option value='sick'>Sick</option>
                    <option value='maternity'>Maternity</option>
                    <option value='paternity'>Paternity</option>
                    <option value='bereavement'>Bereavement</option>
                    <option value='compensatory'>Compensatory</option>
                    <option value='sabbatical'>Sabbatical</option>
                    </Select><br />
                    <InputWithLabel 
                     id="duration"
                     type="number"
                     label="Number of days(duration)"
                     variant="filled"
                     bg="secondary.200"
                     name="duration"
                     register={register('duration')}
                     formErrorMessage={errors.duration?.message}
                     mb="3"
                    //  isInvalid={errors.name && true}
                    />  

                    <InputWithLabel 
                     id="leave_allowance"
                     type="number"
                     label="Leave Allowance"
                     variant="filled"
                     bg="secondary.200"
                     name="leave_allowance"
                     register={register('leave_allowance')}
                     formErrorMessage={errors.leave_allowance?.message}
                     mb="3"
                    //  isInvalid={errors.name && true}
                    />  

         

        <br/>
         
                 <FormLabel fontSize="xs" htmlFor={'leave_type'} fontWeight="semibold">
                 Leave Formuala
                </FormLabel>
                    <Select placeholder='Leave Formuala'
                    {...register('leave_formula')}
                    >
                    <option value='5'>5%</option>
                    <option value='10'>10%</option>
                    <option value='15'>15%</option>
                    <option value='20'>20%</option>
                    <option value='25'>25%</option>
                    <option value='30'>30%</option>
                    <option value='35'>35%</option>
                    <option value='40'>40%</option>
                    <option value='45'>45%</option>
                    <option value='50'>50%</option>
                    <option value='55'>55%</option>
                    <option value='60'>60%</option>
                    <option value='65'>65%</option>
                    <option value='70'>70%</option>
                    <option value='75'>75%</option>
                    <option value='80'>80%</option>
                    <option value='85'>85%</option>
                    <option value='90'>90%</option>
                    <option value='95'>95%</option>
                    <option value='100'>100%</option>
                    </Select>  


            <br />
                    
                    {
                      forAll?
                      ''          
                      :
                    <FormControl >
              <FormLabel fontSize="xs" htmlFor="level_id" fontWeight="semibold">
                Pick Career Path Level(Grade Level)
              </FormLabel>
              {/* /client/${org_name}/career-path */}
              <SelectAsyncPaginate
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              // key={currentlySelectedStructure}
              url={`/client/${org_name}/career-path?me=1`}
              value={careerPaths}
              onChange={(value)=>{
                console.log("setCareerPaths",value)
                setValue("grade_level",value?.level)
                setCareerPaths(value)
                 return value
              }}
              SelectLabel={(option:any)=>`${option.name}`}
              SelectValue={(option:any)=> {
                return `${option.level}`
              } }
              placeholder={""}
              
              />
              
             
              <Text fontSize="sm" color="crimson">
                {/* {errors.level_id?.message} */}
              </Text>
            </FormControl> 
              
                    }

                    <Checkbox isChecked={forAll} onChange={(e)=> setForAll(!forAll)}>
                      {
                        
                        'Apply for all level'
                      }
                    
                    </Checkbox>
                </form>
            </DrawerBody>

            <DrawerFooter>
                <Button
                type="submit"
                form="add-leave-form"
                variant="primary"
                w="full"
                  isLoading={status ==='pending'}
                loadingText="Creating Leave..."
                >
                    Create Leave
                </Button>
      </DrawerFooter>
        </>
    )
}

export default CreateLeave