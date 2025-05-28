import ReuseableSelectWithLabel from "../components/ReuseableSelectWithLabel"
import {
    RadioGroup,
    Radio,
    Box,
    Text,
    Grid,Button,
    Menu,
    MenuButton,HStack,FormControl,
    MenuItem,
    MenuList,
    IconButton,
    Stack,Checkbox,Skeleton,Tooltip ,
    Flex,Input, FormLabel, Select,CheckboxGroup, useToast
  } from '@chakra-ui/react';
  import { HiDotsHorizontal, HiOutlinePlus } from 'react-icons/hi';
  import { Link as ReactRouterLink } from 'react-router-dom';
import InputWithLabel from "../components/InputWithLabel";
import { useEffect, useState } from "react";
import SelectWithLabel from "../components/selectWithLabels";
import * as yup from "yup";
import { string } from "yup/lib/locale";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import {CalendarInputWithoutPast,ExcludeDaysInCalendar} from "../components/DateInput";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from "../services/api";
import { getAllEmployees } from "../redux/employees/employeesAPI";
import { selectEmployees } from "../redux/employees/employeesSlice";
import { createTaskApi } from "../redux/Task/taskAPI";
import moment from "moment";
import { Unit } from "../redux/unit/unitAPI";
import { Department } from "../redux/department/departmentAPI";
import { Group } from "../redux/group/groupAPI";
import { Division } from "../redux/division/divisionAPI";
import { Corporate } from "../redux/corporate/corporateAPI";
import { selectTask } from "../redux/Task/taskSlice";
import TypeVerifierUserChecker from "../utils/UserScreenAuthentication"
import { getLoggedin_userEmail } from "../services/auth.service";
import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../services/list.service";
import { useErrorHandler } from 'react-error-boundary';
import DurationPicker from 'react-duration-picker'
import SelectAsyncPaginate from "../components/AsyncSelect";
// daily has - (ending task, repeat every)
//     repeat every: drop dowmn of numbers -- repeaat every day 

// weekly has ->(ending task, repeat every week,)
//     repeat every: drop dowmn of numbers -- repeaat every week 
//     occurs on ->days of the week 
    


// monthly has:
//   occurs on  day (number 1-31) 
//   or  
//   occurs on drop down(first|seconf|third|fourth|last) of (sunday-sartuday) of the month 


// ending task :
//     by date  
//     or 
//     after 1-20(drop down) occurence
 

type taskTypeInput = "qualitative"|"quantitative"|"quantitative_and_qualitative"|string;
type  routineOptionInput = "weekly"|"daily"|"monthly"|"once"|string;
interface TaskFormInput{
    name:string;
    owner:string;
    task_type:taskTypeInput;
    "initiative_id":string;
    start_date:string;
    start_time:string;
    duration:string;//whenn in the ui(hh:mm:ss format)
    // the defualt is one but once u click on recurring it becomes weekly or any of the options apart from once
    routine_option:routineOptionInput;
    //can repeat every (number of time in a) week|month|daily
    repeat_every?:number;
    after_occurrence?:number;
    end_date?:string;
    target_brief?:any;
    // rework_limit:Qualitative task is the only part u can have re-work by defualt re-work is '0'
    rework_limit?:number;
    turn_around_time_target_point:number;
    quality_target_point?:number;
    quantity_target_point?:number;
    quantity_target_unit?:number;
    // owner:string;



    // for weekly
    monday?:boolean;
    tuesday?:boolean;
    wednesday?:boolean;
    thursday?:boolean;
    friday?:boolean;
    saturday?:boolean;
    sunday?:boolean;



    // for monthly
    occurs_month_day_number?:number;
    occurs_month_day_position?:string;
    occurs_month_day?:string;

}
































const schema =yup.object().shape({
    name:yup.string().required("you need to name your task!"),
    owner: yup.string().required('You need a owner email'),
    task_type:yup.string().required("Pick a Task Type"),
    "initiative_id":yup.string().required("You need to connect an initiative to the task"),
    start_date:yup.string().required("you need a start date"),
    start_time:yup.string().required("you need a start time"),
    duration:yup.string().required("Pick a duration"),//whenn in the ui(hh:mm:ss format)
    // the defualt is one but once u click on recurring it becomes weekly or any of the options apart from once
    routine_option:yup.string().required("you need to pick between weekly,monthly or daily"),
    //can repeat every (number of time in a) week|month|daily
    repeat_every:yup.number().typeError('repeat how many time in a routine'),

    //after_occurrence and end_date u pick one of them depending on how you want to end the task 
    after_occurrence:yup.number(),
    end_date:yup.string(),
    // rework_limit:Qualitative task is the only part u can have re-work by defualt re-work is '0'
    rework_limit:yup.mixed(),
    // rework_limit:yup.number().required('Rework Limit is required now'),
    target_brief:yup.mixed(),

    // yup.number().typeError("Must be a number") 
    // for_quatitative:
    turn_around_time_target_point:yup.number().typeError("Must be a number").required("you need to specify this field"),
    quality_target_point:yup.mixed(),
    quantity_target_point:yup.mixed(),
    quantity_target_unit:yup.mixed(),

    // owner:yup.string().required("Please Enter a valid Owner"),




    // for only weekly
    monday:yup.boolean(),
    tuesday:yup.boolean(),
    wednesday:yup.boolean(),
    thursday:yup.boolean(),
    friday:yup.boolean(),
    saturday:yup.boolean(),
    sunday:yup.boolean(),


    occurs_month_day_number:yup.number().typeError('must be a number and cant be empty'),
    occurs_month_day_position:yup.string().typeError('must be a number and cant be empty'),
    occurs_month_day:yup.string().typeError('must be a number and cant be empty'),
}).test("chooseAtLeastEndBy_AfterOccurence_or_endDate","",(obj)=>{

    // const after_occurrence:number = obj.after_occurrence;
    // const end_date:string = obj.end_date;

if(obj.routine_option==="once"){
    return true
}

    if((obj.end_date ===undefined && obj.after_occurrence!==undefined)||(obj.end_date !==undefined && obj.after_occurrence===undefined)){
        
        return true
    
    }

    return new yup.ValidationError("You Have to Choose At Least 'End Date' or 'After Occurrence' ",null,'end_date')
// return true
}).test('validate_dates',"",(obj)=>{
 
    if(obj.routine_option === 'weekly'){
        
        if(obj.monday || obj.tuesday || obj.wednesday ||obj.thursday||obj.friday){
            return true 
         }
            return new yup.ValidationError(
         'At least pick a day!',
         null,
         'monday'
         );
    }
    return true
})
.test("validate_target_points","",(obj)=>{

    if(obj.task_type ==='qualitative'){
        if((obj.quality_target_point==undefined)||(obj.quality_target_point<1)){
            // we need Quality Target Point and ReWork Limit
            return new yup.ValidationError("Quality Target Point is required and can nmust be greater than 0 ",null,'quality_target_point')
        }

        if((obj.rework_limit==undefined) || (obj.rework_limit<1) ||(obj.rework_limit ==='')){
            
            return new yup.ValidationError(" Rework Limit is required and must be greater than 0 ",null,'rework_limit')
            
        }
    
    } 
    if(obj.task_type=="quantitative") {
        // quantity_target_unit
        if((obj.quantity_target_point==undefined)||(obj.quantity_target_point<1) || (obj.quantity_target_point==='')){
            return new yup.ValidationError("Quantity Target Point is required and must be greater than 0 ",null,'quantity_target_point')
        }
        if((obj.quantity_target_unit==undefined)||(obj.quantity_target_unit<1) || (obj.quantity_target_unit==='')){
            return new yup.ValidationError("Quantity Target Unit is required and must be greater than 0 ",null,'quantity_target_unit')
        }
    }

    if(obj.task_type=="quantitative_and_qualitative"){
        if((obj.quantity_target_point==undefined)||(obj.quantity_target_point<1) || (obj.quantity_target_point==='')){
            return new yup.ValidationError("Quantity Target Point is required and must be greater than 0 ",null,'quantity_target_point')
        }
        if((obj.quantity_target_unit==undefined)||(obj.quantity_target_unit<1) || (obj.quantity_target_unit==='')){
            return new yup.ValidationError("Quantity Target Unit is required and must be greater than 0 ",null,'quantity_target_unit')
        }

        
        if((obj.quality_target_point==undefined)||(obj.quality_target_point<1) ||(obj.quality_target_point =="")){
            // we need Quality Target Point and ReWork Limit
            return new yup.ValidationError("Quality Target Point is required and can nmust be greater than 0 ",null,'quality_target_point')
        }

        if((obj.rework_limit==undefined) || (obj.rework_limit<1) ||(obj.rework_limit ==='')){
            return new yup.ValidationError(" Rework Limit is required and must be greater than 0 ",null,'rework_limit')
        }
    }

    return true
})

const getEmployeeByEmail = async (email:string)=>{
    const org_name = localStorage.getItem('current_organization_short_name');

    // let  teamLeadEmail=getLoggedin_userEmail()
    const DoesTeamLeadApi = await axios.get(`/client/${org_name}/employee/?user__email=${email}`)
    let teamlead = DoesTeamLeadApi.data.data
    //this return Array of employees with that email
    return teamlead || []
}


const TaskCreateForm = ()=>{
    const toast = useToast();
    const org_name = localStorage.getItem('current_organization_short_name');
    const level_to_query:any = {
        'corporate-level':'corporate_level__uuid',
        'divisional-level':'division__uuid',
        'group-level':'group__uuid',
        'departmental-level':'department__uuid',
        "unit-level":'unit__uuid',
        "upline__email":"upline__email"//this means i want to get only the team leads down lines
      }
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
    const [isCorporateTeamLead,setisCorporateTeamLead] = useState<boolean>(false);
    const {message,status,errorMessage}  = useAppSelector(selectTask)
    const dispatch = useAppDispatch()
    const[ isLoading,setIsLoading] =useState<boolean>(true);
    const [initiative,setInitiative]=useState([]=[])
   
    const [listOfEmployees,setListOfEmployees]=useState<any>([]=[])
    const [IsemployeeLoading,setIsEmployeeLoading] =useState<boolean>(); 

    const [hasGottenEmployees,setHasGottenEmployees]=useState<boolean>(false)
    const [currentEmployueeUUid,setCurrentEmployueeUUid]=useState<string|null>(null)
    const [currentOwner,setCurrentOwner]=useState<any>();
    // const
    const {employees,status:employee_endpoint_Status}=useAppSelector(selectEmployees);
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
    const getInitiatives= async (owner_email:string)=>{
        
        
        
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
        if(ORG_NAME){


            try {
                const response = await axios.get(`/client/${ORG_NAME}/initiative/?owner_email=${owner_email}`);
                setInitiative(response.data.data);
                setIsLoading(false);
                return response.data.data;
              } catch (err: any) {
                setIsLoading(false);
                return err.response;
              } 


        }
  
    }
 

     

    const [structureLevels, setStructureLevels] = useState<
    Corporate[] | Division[] | Group[] | Department[] | Unit[]
  >([]);
  const [currentlevel,setCurrentlevel]=useState<string>('upline__email');

  const [LevelIsLoading,setLevelIsLoading] = useState<boolean>()

    const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevelIsLoading(true);
        let selectedLevel = e.target.value;
        setCurrentlevel(selectedLevel)
        const orgName=localStorage.getItem('current_organization_short_name');
        try {   
          const response = await axios.get(
            `/organization/setup/${selectedLevel}/list/${orgName}/`
          );
          setStructureLevels(response.data.data);
          setLevelIsLoading(false);
        } catch (err: any) {
          setLevelIsLoading(false);
        }
      };


    const {
        register,
        control,setValue,
        handleSubmit,
        formState: { errors },reset,getValues
      } = useForm<TaskFormInput>({ resolver: yupResolver(schema) });
      //did this cus it has extra funxtionality
     const taskTypeField = register('task_type')
    //   const RoutineOptionTypeField = register('routine_option')
     const [selectedStartDate,setSelectedStartDate]=useState<null|Date>(new Date());
    //   state for conditional inputs start
      const [currentTaskType,setCurrentTaskType] = useState<taskTypeInput>()
    //   end of state for conditional inputs start
    
    // check for reoccuring tast
    const [isReoccuring,setIsReoccuring] = useState<boolean>(false);
    const [isuploadTaskBrief,setIsuploadTaskBrief] = useState(false)
    const [selectedRoutine,setSelectedRoutine]=useState<routineOptionInput>("once");

    

        const [endByCalendarIsDisable,setEndByCalendarIsDisable] = useState<boolean>(false)
        const [endByOccurenceIsDisable,setEndByOccurenceIsDisable] = useState<boolean>(true)

        // this has to do with month
        const [occursByMonthDayNumber,setOccursByMonthDayNumber]=useState(false);
        const [occursByMonthPostion,setOccursByMonthPostion]=useState(true);

const handleError =  useErrorHandler()
// for input with the lAbel coponet
        // formErrorMessage={errors.name?.message}

        const onSubmit:SubmitHandler<TaskFormInput>=(data)=>{
           
            const formData =new FormData();
            
            formData.append('name',data.name)
            formData.append('upline_initiative[initiative_id]',data.initiative_id)
            formData.append('task_type',data.task_type)
            if(data.target_brief!==null && isuploadTaskBrief==true ){
                formData.append('target_brief',data.target_brief[0])
            }
            if(data.start_date){
                
                // let start_date = new Date(data.start_date)
                // const formater_date = `${start_date.getFullYear()}-${start_date.getMonth()>=10?'0'+start_date.getMonth():start_date.getMonth()}-0${start_date.getDay()}`
                formData.append('start_date',moment(data.start_date).format("YYYY-MM-DD"))
            }   
            // i just added secons to it
            formData.append('start_time',data.start_time)
            // formData.append('duration',JSON.stringify( moment(new Date(data.duration)).format("HH:mm:ss")))
            // formData.append('duration',moment(data.duration).format("HH:mm:ss"))
            formData.append('duration',data.duration)
            if(data.repeat_every){

                formData.append('repeat_every',JSON.stringify(data.repeat_every))
            }
            
         

            if(data.after_occurrence){
                formData.append('after_occurrence',JSON.stringify(data.after_occurrence))
            }
            if(data.end_date){
                    
                    formData.append('end_date',moment(data.end_date).format("YYYY-MM-DD"))
            }
            formData.append('routine_option',data.routine_option)
            if(data.routine_option ==='daily'){
            }
            if(data.routine_option === 'weekly'){
                const occurs_days:any = []
                


 

                if(data.monday){
                    occurs_days.push(0)
                }
            
                if(data.tuesday){
                    occurs_days.push(1)
                }
            
                    if(data.wednesday){
                    occurs_days.push(2)
                }
            
                if(data.thursday){
                    occurs_days.push(3)
                }
                    if(data.friday){
                    occurs_days.push(4)
                }
            
            
                if(data.saturday){
                    occurs_days.push(5)
                }
                
                
                if(data.sunday){
                    occurs_days.push(6)
                }               
                delete data['monday']
                delete data['tuesday']
                delete data['wednesday']
                delete data['thursday']
                delete data['friday']
                delete data['saturday']
                delete data['sunday']
                
                formData.append('occurs_days',JSON.stringify(occurs_days))
                

            }

            if(data.routine_option === 'monthly'){
                // if(data.qualitative)
                if(data.occurs_month_day_number){
                    formData.append('occurs_month_day_number',JSON.stringify(data.occurs_month_day_number))
                }
                if(data.occurs_month_day_position){
formData.append('occurs_month_day_position',data.occurs_month_day_position)

                }
                if(data.occurs_month_day){
formData.append('occurs_month_day',data.occurs_month_day)
                    
                }
            }



            if(data.task_type=='qualitative'){

                
                if(data.rework_limit){
                    formData.append('rework_limit',JSON.stringify(+data.rework_limit))
                }
                if(data.quality_target_point){
                    formData.append('quality_target_point',JSON.stringify(+data.quality_target_point))
                }
            }

            if(data.task_type=='quantitative'){
                if(data.quantity_target_point){
                    formData.append('quantity_target_point',JSON.stringify(+data.quantity_target_point))
                }
                if(data.quantity_target_unit){
                    formData.append('quantity_target_unit',JSON.stringify(+data.quantity_target_unit))
                }
            }
            
            if(data.task_type=='quantitative_and_qualitative'){
                if(data.rework_limit){
                    
                    formData.append('rework_limit',JSON.stringify(+data.rework_limit))
                }
                if(data.quality_target_point){
                    formData.append('quality_target_point',JSON.stringify(+data.quality_target_point))
                }


                if(data.quantity_target_point){
                    formData.append('quantity_target_point',JSON.stringify(+data.quantity_target_point))
                }
                if(data.quantity_target_unit){
                    formData.append('quantity_target_unit',JSON.stringify(+data.quantity_target_unit))
                }
            }

            if(data.turn_around_time_target_point){
                formData.append('turn_around_time_target_point',JSON.stringify(data.turn_around_time_target_point))
            }



 
            
            dispatch(createTaskApi({formData,handleError}))
         
        }
        // console.log(errors)
        // className="chakra-input css-gzp9gs "








useEffect(()=>{
    // message,status
    
    if(status==="added"){
        if(message){
            setTimeout(()=>{
                window.location.reload()
            },2000)
            toast({
                title:"Task Created Successfully",
                status: "success",
                position: "top",
                duration: 9000,
                isClosable: true,
            })
        }
    }
    if(status ==='failed'){

        if(errorMessage){
            toast({
                title:errorMessage,
                status: "error",
                position: "top",
                duration: 9000,
                isClosable: true,
            })
        }
    }

},[status,message])



useEffect(()=>{
    if(isReoccuring===false){

        //    so basically on load of this page set the 
        // (Recurrence-in ui) in postmane(routine_option )  to once 
            setValue('routine_option',"once")
            setValue('repeat_every',undefined)
    }

},[isReoccuring])

useEffect(()=>{ 
    //this means the user did not want to end the task with endate
    // he wants EndbyOccurence
    if(endByCalendarIsDisable===true){
        setValue("end_date",undefined)
    }
},[endByCalendarIsDisable])

useEffect(()=>{
    //it must be either after_occurence or end date
    if(endByOccurenceIsDisable === true){
        setValue('after_occurrence',undefined)
    }
},[endByOccurenceIsDisable])


// useEffect(()=>{
//     if(currentTaskType!=="qualitative"){
//         setValue('rework_limit',0)
//     }
//     if(currentTaskType!=='qualitative') {
//         setValue("quality_target_point",undefined)
//     }

//     if(currentTaskType==='qualitative') {
//         setValue("quality_target_point",0)
//     }



//     if(currentTaskType!=='quantitative') {
//         setValue("quantity_target_point",undefined)
//         setValue("quantity_target_unit",undefined)
//     }
//      if(currentTaskType==='quantitative') {
//         setValue("quantity_target_point",1)
//         setValue("quantity_target_unit",1)
//     }

//     if(currentTaskType === 'quantitative_and_qualitative'){
//         setValue("quality_target_point",0)
//         setValue('rework_limit',0)
//         setValue("quantity_target_point",1)
//         setValue("quantity_target_unit",1)
        
//     }

   
// },[currentTaskType])



// useEffect(()=>{
//     getEmployee()//on load of the page get all employee

// console.log(
// //   use for duration  moment('Thu Feb 03 2022 13:33:09 GMT-0600 (Central Standard Time)').format("hh:mm:ss")

// // for start_date moment('Thu Feb 03 2022 13:33:09 GMT-0600 (Central Standard Time)').format("yyyy:MM:DD")


// )
// },[])
useEffect(()=>{

    //on Load Of theform get the organisation like start_time and other stuff
    let org_settings = localStorage.getItem('org_info')
    if(org_settings){
        setCurrentOrgnisationSettings(JSON.parse(org_settings))
    }

    setValue('target_brief',null)
},[])
useEffect(()=>{
    //once  currentOwner is picked
    // currentOwner containes upline_email
    if(currentOwner){
        getInitiatives(currentOwner)
    }
},[currentOwner])

//now the user
useEffect(()=>{
if(occursByMonthDayNumber===true){
    // if disabled just set occurs_month_day_number to undegfined

    setValue('occurs_month_day_number',undefined)

} 
},[occursByMonthDayNumber])



useEffect(()=>{
    if(occursByMonthPostion===true){
    setValue('occurs_month_day_position',undefined)
    setValue('occurs_month_day',undefined)

    }
},[occursByMonthPostion])

    return (
        <>
            <Box
                as='form'
                onSubmit={handleSubmit(onSubmit)}
            >  
<div>
      
    </div>

    {
        //if this person is not a teamLead
        !TypeVerifierUserChecker(["team_lead"],"client_tokens")?
        <>
             <FormControl>
                  <FormLabel
                    htmlFor="structure_level"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Pick a Structure Level
                  </FormLabel>
                  <Select
                    placeholder="Select Structure Level"
                    variant="filled"
                    bg="secondary.200"
                    color="gray.400"
                    id="structure_level"
                    onChange={handleLevelChange}
                  >
                    <option value="corporate-level">Corporate</option>
                    <option value="divisional-level">Division</option>
                    <option value="group-level">Group</option>
                    <option value="departmental-level">Department</option>
                    <option value="unit-level">Unit</option>
                  </Select>
    </FormControl><br />


    <FormControl>
                  <FormLabel
                    htmlFor="Structure name"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Structure Name
                  </FormLabel>
             
                      <SelectAsyncPaginate 
            
            key={currentlevel}
            url={`/organization/setup/${currentlevel}/list/${org_name}/?me=1`}
            value={structureLevels}
            onChange={(value)=>{

            

                // getEmployees(value?.uuid) 
                setStructureLevels(value)
            return  setCurrentEmployueeUUid(value?.uuid)
            
            }}
            SelectLabel={(option:any)=>`${option.name}`}
            SelectValue={(option:any)=> {
              return `${option.uuid}`
            } }
            placeholder={""}
            />
 
 
 
                  {/* {currentlevel} */}
           
    </FormControl>
        </> :""
    }




                <br />


<HStack mb="5">
                <FormControl id="end_time">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    htmlFor="end_time"
                  >
                    Choose Owner 
                  </FormLabel>










<SelectAsyncPaginate 
            
            key={currentEmployueeUUid}
            //this is a wierd url cus we need some logic to achive the url
            url={(():string=>{
                // this is the defualt url
                let url:string="";

                if(TypeVerifierUserChecker(["team_lead"],"client_tokens")){
                
                //   const DoesTeamLeadApi =  axios.get(`/client/${org_name}/employee/?user__email=${teamLeadEmail}`)
                  let teamLeadEmail:any =getEmployeeByEmail(getLoggedin_userEmail())

                  // so if u logged in as a TeamLEad we get ur freaking dowlines 
                  url = `/client/${org_name}/employee/?${level_to_query[teamLeadEmail]}=${currentEmployueeUUid}`
                  
                  
                }
                else{
                    
                    url = `/client/${org_name}/employee/?${level_to_query[currentlevel]}=${currentEmployueeUUid}`
                }
                
                return url
            })()}
            // url={ `/client/${org_name}/employee/?${level_to_query[currentlevel]}=${currentEmployueeUUid}`}
            value={currentOwner}
            onChange={(value)=>{
            setValue("owner",value?.user.email)
            return  setCurrentOwner(value)
            
            }}
            SelectLabel={(option:any)=>`${option?.user.email}`}
            SelectValue={(option:any)=> {
              return `${option?.user.email}`
            } }
            placeholder={""}
            />

            <Text  fontSize="xs" color="crimson" >{errors.initiative_id?.message}</Text>

                </FormControl>
</HStack>
<br />

<HStack mb="5">
                <FormControl id="end_time">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    htmlFor="end_time"
                  >
                    Upline Initiatives
                  </FormLabel>
                  {/* <Select
                    // placeholder="Select Upline Objective"
                    variant="filled"
                    bg="secondary.200"
                    {...register('initiative_id')}
                    placeholder="Select Upline Initiative"
                    required
                  >


                        {
                            initiative.filter((initiative_data:any)=>{
                                // filter by active or pending bro
                                return ["active","pending"].includes(initiative_data.initiative_status)
                        }).map((data:any)=>(
                                <option value={data.initiative_id} key={data.initiative_id}>{data.name}, Current Running Initiative Routine ({data.routine_round})</option>
                            ))
                        }

                  </Select> */}

{/* `/client/${ORG_NAME}/initiative/?owner_email=${owner_email}` */}

<SelectAsyncPaginate 
            
            key={currentOwner?.user.email}
            url={`/client/${org_name}/initiative/?owner_email=${currentOwner?.user.email}&initiative_status=active&initiative_status=pending`}
            value={initiative}
            onChange={(value)=>{

                setValue("initiative_id",value.initiative_id)
                setInitiative(value)
          
            
            }}
            SelectLabel={(option:any)=>`${option.name} , Current Running Initiative Routine (${option.routine_round})`}
            SelectValue={(option:any)=> {
              return `${option?.initiative_id}`
            } }
            placeholder={""}
            />


            <Text  fontSize="xs" color="crimson" >{errors.initiative_id?.message}</Text>

                </FormControl>
</HStack>
<br />

            <InputWithLabel 
                    id="taskName"
                    label="Task Name"
                    size="lg"
                    variant="filled"
                    placeholder="Get the Mop Stick"
                    bg="secondary.200"
                    register={register("name")}
                //  formErrorMessage={errors.divisionName?.message}
                style={{marginBottom:"10px"}}
                formErrorMessage={errors.name?.message}
            />


        <br />
       
                <Grid gridTemplateColumns="20%  15% 15%  5 " style={{alignItems:'center'}} columnGap={4} rowGap={8}>
                    {/* <Box> */}
                    <Box
                // style={{'width':"30%"}}
                >
                    <Select
                        id="task_type"
                        // @ts-ignore
                        label="Task Type"
                        placeholder={"Task Type"}
                      {
                        ...taskTypeField
                      }
                         
                      required
                
                        onChange={(e)=>{
                            taskTypeField.onChange(e)
                            // console.log(e.target.value:taskTypeInput)
                            setCurrentTaskType(e.target.value)
                        }}

                    >
                        <option value={"qualitative"} >Qualitative</option>
                        <option value={"quantitative"}>Quantitative</option>
                        <option value={"quantitative_and_qualitative"}>Quantitative and Qualitative</option>
                    </Select>
                </Box>
              {(currentTaskType=="qualitative") || (currentTaskType=="quantitative_and_qualitative") ? 
              <>
                {/* <FormLabel fontSize="xs" htmlFor={"d"} fontWeight="semibold">Quality Target Point</FormLabel> */}
               
                        <InputWithLabel 
                        // {...register('quality_target_point')}
                        register={register('quality_target_point')}
                        id={'quality_target_point'} 
                        type="number"
                        label="Quality Target Point"
    formErrorMessage={errors.quality_target_point?.message}
                        
                        />
                        </>
                        :""}     

{
    (currentTaskType=="quantitative") || (currentTaskType=="quantitative_and_qualitative")?
    <>
        {/* <FormLabel fontSize="xs" htmlFor={"d"} fontWeight="semibold">Quantity Target Point</FormLabel> */}

    <InputWithLabel 
    id={'quantity_target_point'} 
    type="number"
    label="Quantity Target Point"
    // value={0}
    // {...register("quantity_target_point")}
    register={register("quantity_target_point")}
    formErrorMessage={errors.quantity_target_point?.message}
    // isRequired={true}
    // required
   />

    
<InputWithLabel 
id={'quantity_target_unit'} 
type="number"
label="Quantity Target Unit"
register={register("quantity_target_unit")}
formErrorMessage={errors.quantity_target_unit?.message}

/>
</>
:""
}
                           
{
    (currentTaskType=="qualitative") || (currentTaskType=="quantitative_and_qualitative") ?
    <>
    
        <InputWithLabel
            id="taskName"
            label="ReWork Limit"
            size="lg"
            type="number"
            variant="filled"
            placeholder=""
            bg="secondary.200"
            register={register("rework_limit")}
           //  formErrorMessage={errors.divisionName?.message}
           style={{marginBottom:"10px"}}
           formErrorMessage={errors.rework_limit?.message}
        />
    </>
 :""  
}



{/* turn_around_time_target_point                */}

<Box>
<InputWithLabel
// {...register('turn_around_time_target_point')}
id={'turn_around_time_target_point'} 
// type="number"
label="Turn around time target point"
register={register('turn_around_time_target_point')}
type="number"
/>
<Text  fontSize="xs" color="crimson" >{errors.turn_around_time_target_point?.message}</Text>

</Box>

                    {/* </Box> */}
                </Grid>
                <Text  fontSize="xs" color="crimson" >{errors.task_type?.message}</Text>



















               
    <br />
                <Grid gridTemplateColumns="10%  1fr 1fr 1fr" style={{alignItems:'center'}} columnGap={4} rowGap={8}>



                <FormLabel fontSize="xs" htmlFor={"d"} fontWeight="semibold">Start Date</FormLabel>
                    {/* this component only shows the dates that are in the list */}
                   <ExcludeDaysInCalendar 
                   //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                    days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                  disabled={false}
                    name='start_date'
                    control={control}
                    placeholder="Enter Start Date"
                    formErrorMessage={errors.start_date?.message?"Start Date Can Not Be empty":""}
                    dateFormat ="yyyy/MM/dd"
                  />

    <Tooltip label={`Work Starts at "${CurrentOrgnisationSettings.work_start_time}",\n\n\n
                    Work Ends at:"${CurrentOrgnisationSettings.work_stop_time}", \n\n\n
                    Break Start Time:" ${CurrentOrgnisationSettings.work_break_start_time},\n\n\n
                    Break ClosingTime :" ${CurrentOrgnisationSettings.work_break_stop_time},\n\n\n
                    \n\n\n
                    Note You Can't Put Any of this time As Start Time
                    `}>
                    <Box >
                        <Input type={'time'} 
                            {...register("start_time")}
                        />
                    {/* <Select
                   id={'d4_2'}
                   variant={"filled"}
                   placeholder="Start Time"
                   {...register("start_time")}
                    >
                       {
                          List_of_start_time.map(start_time_data=>(
                              <option value={start_time_data}>{start_time_data}</option>

                          ))
                       }
                   </Select> */}
                   <Text fontSize="xs" color="crimson">
                    {errors.start_time?.message} 
                    </Text>
                    </Box>
    </Tooltip>

                   {/* <Select
                   id={'d4_2'}
                   variant={"filled"}
                //    placeholder="Am or PM"
                defaultValue={"Am"}
                    >
                        <option value={'AM'}>AM</option>
                        <option value={'PM'}>PM</option>
                   </Select> */}

                </Grid>

<br/>


                <Grid gridTemplateColumns="9% 1fr 1fr 1fr 1fr " style={{alignItems:'center'}} columnGap={4} rowGap={8}>


                                <FormLabel fontSize="xs" htmlFor={"d"} fontWeight="semibold">Duration</FormLabel>

 
                                    <Box>

                                   
                                
                                  <Controller
                                    name="duration"
                                    control={control}
                                    // defaultValue={new Date()}
                                    render={
                                        ({field})=>(
                                           
                                            <DurationPicker
                                            
                                            // initialDuration={}
                                            onChange={(e)=>{
                                                // console.log(e,'hh')
                                                return field.onChange(`${e.hours}:${e.minutes}:${e.seconds}`)
                                            }}
                                            // initialDuration={{ hours: 1, minutes: 2, seconds: 3 }}
                                            // maxHours={5}
                                          />    
                                    )
                                } />

                                    <Text fontSize="xs" color="crimson">
                                    {errors.duration?.message} 
                                    </Text>
                                    </Box>

                </Grid>
                            <br />
                
                            <br/>
                <Box>
                <Checkbox onChange={()=>setIsuploadTaskBrief(!isuploadTaskBrief)}
                     >Upload Task Brief</Checkbox>
                     {
                        isuploadTaskBrief?
                        <Input type='file' {...register('target_brief')} />:''
                     }
                </Box>
                <br />
                <br />
                <br />
                        {/*  */}
                        <div style={{marginRight:"10px",width:"80%",margin:'0 auto',
                        // border:'1px solid red',
                        }}>

                    <Checkbox onChange={()=>setIsReoccuring(!isReoccuring)}
                     >Recurring Tasks</Checkbox>
                        {
                            isReoccuring?
                            <Box >

                        <Grid gridTemplateColumns="20% 1fr 1fr 1fr" style={{alignItems:'center'}} columnGap={4} rowGap={8}>
                                <FormLabel fontSize="xs" htmlFor={"d4"} fontWeight="semibold">Routine Options</FormLabel>

                            <Box>

<Controller name={"routine_option"}
control={control}
// defaultValue={"once"}
render={
    ({field})=>(
        <Select
        placeholder="pick routine"
        variant={"filled"}
        onChange={(e)=>{
            field.onChange(e)
            setSelectedRoutine(e.target.value)
        }}
        isDisabled={!isReoccuring}

        >
        <option value={'daily'} >Daily</option>
        <option value={'weekly'}>Weekly</option>
        <option value={'monthly'}>Monthly</option>
    </Select>  
    )
}/>
                            
                            <Text fontSize="xs" color="crimson">
                                {errors.routine_option?.message} 
                            </Text>
                            </Box>
                        </Grid>
<br />

                        <Grid gridTemplateColumns="20% 1fr 1fr 1fr" style={{alignItems:'center'}} columnGap={4} rowGap={8}>
                                <FormLabel fontSize="xs" htmlFor={"d41"} fontWeight="semibold">Repeat every</FormLabel>
                                {/* for repeat */}
                                <Box> 
                                    <Select
                                    id={'repeat_every_day'}
                                    variant={"filled"}
                                    placeholder="pick choice"
                                    {...register('repeat_every')}
                                   
                                    // required
                                    >
                                {
                                                [...new Array(15)].map((num,index)=>(
                                                    <option value={num} key={index*2}>{index+1}</option>
                                                ))
                                            }
                                    </Select>               
                                    <Text fontSize="xs" color="crimson">
                                    {errors.repeat_every?.message} 
                                    </Text>
                                </Box>


                                <Text>
                                    {selectedRoutine==="daily" && ("Day")}
                                    {selectedRoutine==="weekly" && ("week")}
                                    {selectedRoutine==="monthly" && ("of the month")}
                                </Text>
                        </Grid>


{
selectedRoutine === 'monthly'?
<>
<br />
<Grid gridTemplateColumns="10% 50% 1fr" style={{alignItems:'center'}} columnGap={2} rowGap={8}>
<FormLabel fontSize="xs" htmlFor={"d4"} fontWeight="semibold">Occurs</FormLabel>
                                            
    <Flex align="center" >
        <Radio isDisabled={occursByMonthDayNumber}
        onClick={(e)=>{
            if(occursByMonthDayNumber){
                
                setOccursByMonthDayNumber(false);
                setOccursByMonthPostion(true)
            }
        }}
        >
            Day 
             
        </Radio>
           
        <Select 
        id="occurs_month_day_position"
        {...register('occurs_month_day_number')}
        variant={'filled'}
        isDisabled={occursByMonthDayNumber}
        width={{'justifyContent':'space-between'}}
        >
                {
                [...new Array(31)].map((num,index)=>(
                <option value={num} key={index*2}>{index+1}</option>
                ))
                }
        </Select> 

        <Text 
        // isDisabled={occursByMonthDayNumber}
        >of the month</Text>      
        
        
    </Flex>


</Grid>

<br/>
<Flex align="center" style={{"justifyContent":'center',width:"75%"}} >
<Radio isDisabled={occursByMonthPostion}
    onClick={(e)=>{
        

        if(occursByMonthPostion){
            setOccursByMonthPostion(false)
            setOccursByMonthDayNumber(true)
        }
    }}
></Radio>
    
<Select 
id="occurs_month_day_position"
variant={'filled'}
isDisabled={occursByMonthPostion}
width={{'justifyContent':'space-between'}}
{...register('occurs_month_day_position')}
>
<option value={'first'} >First</option>
<option value={'second'} >Second</option>
<option value={'fourth'} >Fourth</option>
<option value={'last'} >Last</option>

</Select> 


<Select 
marginLeft={'10px'}
id="occurs_month_day"
variant={'filled'}
isDisabled={occursByMonthPostion}
width={{'justifyContent':'space-between'}}
    {...register('occurs_month_day')}
>

{
           CurrentOrgnisationSettings.work_days.includes(6)?
           <option value={6}>sunday</option>
        :""
       }
          {/* //    monday is 0 */}
       {
           CurrentOrgnisationSettings.work_days.includes(0)?
           <option value={0}>monday</option>:""
       }


{
           CurrentOrgnisationSettings.work_days.includes(1)?
           <option value={1}>tuesday</option>:""
       }
          
          {
           CurrentOrgnisationSettings.work_days.includes(2)?
<option value={2}>wednesday</option>:""
       }
                  {
           CurrentOrgnisationSettings.work_days.includes(3)?
<option value={3}>thursday</option>:""
       }  

{
           CurrentOrgnisationSettings.work_days.includes(4)?
           <option value={4}>friday</option>:""
       }  
          
{/* sat is 5 */}
          {
           CurrentOrgnisationSettings.work_days.includes(5)?
           <option value={5} >saturday</option>:""
       }  
          








</Select> 

<Text 
// isDisabled={occursByMonthPostion}
>of the month</Text>      


</Flex>
</>
:""

}


{
    selectedRoutine==="weekly"?

    <CheckboxGroup isDisabled={false} colorScheme='blue'defaultValue={['monday', 'tuesday','wednesday','thursday','friday']}>
    <Box style={{marginTop:'10px'}}>
      
    <Text fontSize="xs" color="crimson">
        {/* @ts-ignore */}
        {errors?.monday?.message}
    </Text>
    <Grid gridTemplateColumns="14% 1fr 1fr 1fr 1fr 1fr 1fr 1fr" columnGap={1} rowGap={8}>
    <FormLabel fontSize="xs"  fontWeight="semibold">
            Work Days
       </FormLabel>
      
       {
           CurrentOrgnisationSettings.work_days.includes(6)?
           <Checkbox  {...register("sunday")} >Sunday</Checkbox>
        :""
       }
          {/* //    monday is 0 */}
       {
           CurrentOrgnisationSettings.work_days.includes(0)?
           <Checkbox  {...register("monday")} >Mon</Checkbox>:""
       }


{
           CurrentOrgnisationSettings.work_days.includes(1)?
           <Checkbox  {...register("tuesday")} >Tue</Checkbox>:""
       }
          
          {
           CurrentOrgnisationSettings.work_days.includes(2)?
           <Checkbox  {...register("wednesday")} >Wed</Checkbox>:""
       }
                  {
           CurrentOrgnisationSettings.work_days.includes(3)?
           <Checkbox {...register("thursday")} >Thu</Checkbox>:""
       }  

{
           CurrentOrgnisationSettings.work_days.includes(4)?
           <Checkbox  {...register("friday")} >Fri</Checkbox>:""
       }  
          
{/* sat is 5 */}
          {
           CurrentOrgnisationSettings.work_days.includes(5)?
           <Checkbox  {...register("saturday")} >Sat</Checkbox>:""
       }  
          
        
    </Grid>
  </Box>
   </CheckboxGroup>:""
}
                      

<br />



 <Grid gridTemplateColumns="10% 1fr 1fr " style={{alignItems:'center'}} columnGap={4} rowGap={8}>
                                <FormLabel fontSize="xs" htmlFor={"d41"} fontWeight="semibold">End Date</FormLabel>

                                <Flex>
                                            <Radio isDisabled={endByCalendarIsDisable} defaultChecked={!endByCalendarIsDisable} onClick={(e)=>{
                                                    if(endByCalendarIsDisable){
                                                    setEndByCalendarIsDisable(false)
                                                    setEndByOccurenceIsDisable(true)
                                                    }}}>By</Radio>
                                            

                                                <ExcludeDaysInCalendar 
                                                //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                                                days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                                required={true}
                                                disabled={endByCalendarIsDisable}

                                                name='end_date'
                                                control={control}
                                                placeholder="Enter Start Date"
                                                formErrorMessage={errors.start_date?.message?"Start Date Can Not Be empty":""}
                                                dateFormat ="yyyy/MM/dd"
                                                />


                                </Flex>

                                <Flex align={'center'}>
                                            <Radio 
                                            isDisabled={endByOccurenceIsDisable}
                                            onClick={(e)=>{
                                            if(endByOccurenceIsDisable){
                                            setEndByOccurenceIsDisable(false)
                                            setEndByCalendarIsDisable(true)
                                            }
                                            }}
                                            >After</Radio>

                                <Select
                                isDisabled={endByOccurenceIsDisable}
                                id={'repeat_every_day'}
                                variant={"filled"}
                                {...register('after_occurrence')}
                                // placeholder="pick choice"?
                                >
                               {
                                            [...new Array(7)].map((num,index)=>(
                                                <option value={num} key={index*2} >{index+1}</option>
                                            ))
                                        }
                                </Select>   
                                <Text 
                                // @ts-ignore
                                isDisabled={endByOccurenceIsDisable}
                                >occurrences </Text>      
                                </Flex>

                        
                        </Grid>
<Text  fontSize="xs" color="crimson" style={{"textAlign":'center'}}>{errors.end_date?.message}</Text>

 
        
                
                            </Box>:""
                        }

                            
                        </div>


            
                                    <br />
                        <div style={{textAlign:'center'}}>
            <Button  
            type="submit"
            variant="primary"
            loadingText="Creating..."
            isLoading={status === "adding"}
            w="80"
        //   size="sm"
            >Submit</Button>
            {/* adding */}
                        </div>

            </Box>

        </>
    )
}


export default TaskCreateForm