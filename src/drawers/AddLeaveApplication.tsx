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
    useToast,Input,
    Skeleton,Textarea
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
import { createLeaveApplicationApi, CreateLeaveApplicationPayload, getLeaveApplicationApi } from "../redux/LeaveApplication/LeaveApplicationApi";
import DateInputWithLabel from "../components/DateInputWithLabel";
import { ExcludeDaysInCalendar } from "../components/DateInput";
import { CurrentOrgnisationSettingsType } from "../services/list.service";
import moment from "moment";
import { selectLeaveApplication, setLeaveApplicationToIdle } from "../redux/LeaveApplication/LeaveApplicationSlice";
import Preloader from "../components/Preloader";
import axios from "../services/api";
import { getLoggedin_userEmail } from "../services/auth.service";
  



const schema = yup.object().shape({
    recorded_allowance: yup.number(),
    start_date: yup.string().required('Start Date is required'),
    end_date:yup.string(),
    leave_type_id:yup.number().required('You Need to Pick a Leave'),
    duration:yup.number().required('Number of Days is need'),
    deputizing_officer:yup.string().required('please fill the info of the deputizing_officer'),
    hand_over_report:yup.mixed().required('please submit hand over report')

})




export interface  MutatedCreateLeaveApplicationPayload extends CreateLeaveApplicationPayload{
    duration:number;
    deputizing_officer:string;
    hand_over_report:any;
}
const AddLeaveApplication = ():React.ReactElement=>{
    const org_name=  localStorage.getItem('current_organization_short_name')
    const handleError = useErrorHandler();
    const dispatch  = useAppDispatch()
    const [currentLeave,setCurrentLeave] = useState<any>()
    const { status ,data ,errMessage } = useAppSelector(selectLeaveApplication)
    const toast = useToast()
    const [loggedInEmployee,setLoggedInEmployee] = useState<any>(null)
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
    const [selectedDeputizingOfficer,setSelectedDeputizingOfficer] = useState<any>(null)
    const {
        register,
        handleSubmit,control,
        formState: { errors },
        reset,setValue
      } = useForm<MutatedCreateLeaveApplicationPayload>({ resolver: yupResolver(schema) });



      const onSubmit: SubmitHandler<MutatedCreateLeaveApplicationPayload>= submited_data =>{
        const start_date_formated = moment(new Date(submited_data.start_date)).format('YYYY-MM-DD')
        const start_date = new Date(submited_data.start_date)
        const end_date = moment(new Date().setDate(start_date.getDate()+submited_data.duration)).format("YYYY-MM-DD")
        // console.log({'submitted':submited_data,'end_date':end_date})


        const data = {
          'recorded_allowance':submited_data.recorded_allowance,
          'start_date':start_date_formated,
          'end_date':end_date,
          leave_type_id:submited_data.leave_type_id,
          duration:submited_data.duration,
          deputizing_officer:submited_data.deputizing_officer,
          hand_over_report:submited_data.hand_over_report[0]
        }

        console.log({'backend data':data})
        if(org_name){
          dispatch(createLeaveApplicationApi({data,handleError,org_name}))
        }
      }

      const get_employee_careerpath = async( )=>{
        //
        let loggedInuserEmail = getLoggedin_userEmail('client_tokens')

        try{
          const resp:any= await axios.get(`client/${org_name}/employee/?user__email=${loggedInuserEmail}`)

          if(resp.data.data){
            const employee  =resp.data.data[0]
            if(employee){
              let data:any ={'my_level_id':employee.career_path?employee.career_path.level:null,}
              if(employee.corporate_level){
                data['team_id_filter']=`corporate_level__uuid=${employee.corporate_level.uuid}`
              }
              if(employee.department){
                data['team_id_filter']=`department__uuid=${employee.department.uuid}`
              }
              if(employee.division){
                data['team_id_filter']=`division__uuid=${employee.division.uuid}`
              }
              if(employee.group){
                data['team_id_filter']=`group__uuid=${employee.group.uuid}`
              }
              if(employee.unit){
                data['team_id_filter']=`unit__uuid=${employee.unit.uuid}`

              }
              setLoggedInEmployee(data)
              localStorage.setItem('my_level_id_and_employee_id',JSON.stringify(data))
            }
            else{
              setLoggedInEmployee(null)
              toast({
                title:"Please ask your admin HR to asssign career path to you",
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
              }) 
            }
          }
        }
        catch(err:any){
          //
          toast({
            title:"Please relogin we could not proccess your info",
            status: "error",
            position: "top",
            duration: 3000,
            isClosable: true,
          }) 

        }
      }

      useEffect(()=>{

        let org_settings = localStorage.getItem('org_info')
        if(org_settings){
            setCurrentOrgnisationSettings(JSON.parse(org_settings))
        }
        setValue('recorded_allowance',100.00)//this will be set in the backend bro so this just a place holder
        const my_level_id_and_employee_id  = localStorage.getItem('my_level_id_and_employee_id')
        if(my_level_id_and_employee_id){
          setLoggedInEmployee(JSON.parse(my_level_id_and_employee_id))
        }
        else{
          get_employee_careerpath()
        }

    },[])

    useEffect(()=>{
        if(status==='created'){
          toast({
            title: 'Created Successfully',
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
          })
          if(org_name){
            dispatch(getLeaveApplicationApi({org_name,handleError,look_up:''}))
          }
          // dispatch(setLeaveApplicationToIdle({}))
        }

        if(status==='error'){
          toast({
              title:errMessage,
              status: "error",
              position: "top",
              duration: 3000,
              isClosable: true,
            })         
            dispatch(setLeaveApplicationToIdle({}))


      }
      },[status])
    return (
        <div>
          {status==='pending'&&<Preloader/>}
        <DrawerCloseButton />
        <DrawerHeader fontSize="md">Leave Application</DrawerHeader>
        <DrawerBody>

          {
            loggedInEmployee?
            <form  
            id="apply-leave-form"
            onSubmit={handleSubmit(onSubmit)}
            >
                <br />

                <FormControl mb='4'>
              <FormLabel fontSize="xs" htmlFor="level_id" fontWeight="semibold">
              Available Leave
              </FormLabel>
              {/* /client/${org_name}/career-path */}
              <SelectAsyncPaginate
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              // key={currentlySelectedStructure}
              url={`/client/${org_name}/leave-management/hr-leave-management/?filter_by_grade_level_id=${loggedInEmployee.my_level_id}`}
              value={currentLeave}
              onChange={(value)=>{
                setValue("leave_type_id",value?.id)
                setCurrentLeave(value)
                 return value
              }}
              SelectLabel={(option:any)=>`${option.leave_choice}  for  level ${option.grade_level}`}
              SelectValue={(option:any)=> {
                return `${option.leave_choice}`
              } }
              placeholder={""}
              
              />
              
             
              <Text fontSize="sm" color="crimson">
                {/* {errors.level_id?.message} */}
              </Text>
            </FormControl>  
            <br />


<FormLabel fontSize="xs"  fontWeight="semibold">
Start Date
</FormLabel>

              <ExcludeDaysInCalendar 
                    name='start_date'
                    control={control}
                    days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                    placeholder={"Enter Start Date"}
                    formErrorMessage={errors?.start_date?.message?"Start Date Can Not Be empty":""}
                    dateFormat ="yyyy/MM/dd"
              />
<br />

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
  
         <FormLabel fontSize="xs" htmlFor={'deputizing_officer'} fontWeight="semibold">
           Hand over report
         </FormLabel>
            <Input type="file"
                  accept="application/pdf" 
                  required
                  variant="filled" bg="transparent" 
            {...register('hand_over_report')}
            />

            

<br />
<br />
        {/* <FormLabel fontSize="xs" htmlFor={'deputizing_officer'} fontWeight="semibold">
          Deputizing officer
        </FormLabel>
        <Textarea
        {...register('deputizing_officer')}
        >

        </Textarea> */}




<FormControl mb='4'>
<FormLabel fontSize="xs" htmlFor="level_id" fontWeight="semibold">
Deputizing officer 
</FormLabel>
{/* /client/${org_name}/career-path */}
<SelectAsyncPaginate
//?me=1 added this dummy params so i can tag on &page=1 dynamically
// key={currentlySelectedStructure}
url={`/client/${org_name}/employee/?${loggedInEmployee.team_id_filter}`}
value={selectedDeputizingOfficer}
onChange={(value)=>{
setValue("deputizing_officer",value?.user.email)
setSelectedDeputizingOfficer(value)
 return value
}}
SelectLabel={(option:any)=>`${option.user.first_name}  ${option.user.last_name}`}
SelectValue={(option:any)=> {
return `${option.user.email}`
} }
placeholder={""}

/>


<Text fontSize="sm" color="crimson">
{/* {errors.level_id?.message} */}
</Text>
</FormControl>  
<br />
                    
<Button
                type="submit"
                form="apply-leave-form"
                variant="primary"
                w="full"
                isLoading={status ==='pending'}
                loadingText="Applying for Leave..."
                >
                    Submit Application
                </Button>       
            </form>:
            <Preloader/>
          }
        </DrawerBody>

        {/* <DrawerFooter>
                
      </DrawerFooter> */}
        </div>
    )
}


export default AddLeaveApplication