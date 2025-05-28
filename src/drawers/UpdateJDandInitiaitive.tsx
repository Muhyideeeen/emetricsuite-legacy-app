import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Skeleton,
  Text,Radio,RadioGroup,
  Box,Flex,
  useToast,Checkbox,
} from "@chakra-ui/react";
import React, { useReducer,useEffect, useState } from "react";
import InputWithLabel from "../components/InputWithLabel";
import moment from "moment";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid_v4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getObjectives } from "../redux/objective/objectiveAPI";
import { Objective, selectObjective } from "../redux/objective/objectiveSlice";
// import { Corporate } from "../redux/corporate/corporateAPI";
import { Division } from "../redux/division/divisionAPI";
import { Group } from "../redux/group/groupAPI";
import { Department } from "../redux/department/departmentAPI";
import { Unit } from "../redux/unit/unitAPI";
import axios from "../services/api";
import {addJDandInitiative,updateJDandInitiative} from "../redux/jdsAndIntiatives/jdsAndIntiativesApi";
import { selectJdIntiatives } from "../redux/jdsAndIntiatives/jdsAndIntiativesSlice";
import { useErrorHandler } from "react-error-boundary";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Corporate, getCorporates } from "../redux/corporate/corporateAPI";
import {BsPencil } from 'react-icons/bs'
import {AddJDAndInitiativeInputs ,schema as AddJDAndInitiativeYupSchema} from "./AddJDAndInitiative"
import {ExcludeDaysInCalendar} from "../components/DateInput";
import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../services/list.service";
import { GrEdit } from "react-icons/gr";
import {EditableExcludeDaysInCalendar} from  "../components/EditableDateInputWithLabel"
import GoodAlert from "../components/GoodAlert";


interface ShowEditAbleInputType{
    "start_date":boolean,
    "end_date":boolean,
    "after_occurrence":boolean,
    "name":boolean,
    "owner_email":boolean,
    "routine_option":boolean,
    // "target_point":boolean,
    "upline_initiative_id":boolean,
    "upline_objective_id":boolean,
}
const ShowEditAbleInput={
    "start_date":false,
    "end_date":false,
    "after_occurrence":false,
    "name":false,
    "owner_email":false,
    "routine_option":false,
    // "target_point":false,
    "upline_initiative_id":false,
    "upline_objective_id":false,
}

type EditableDispatchType="makeEditable"

const ShowEditAbleInputReducer=(state:ShowEditAbleInputType,{type,payload}:{type:EditableDispatchType,payload:any})=>{


    switch(type){
        case "makeEditable":
            return {...state,...payload}
        default:return state
    }
}



const schema = yup.object().shape({
  name: yup.string().required(),
  // assignor_email: yup.string(),
  initiative_id:yup.string(),
  owner_email: yup.string().required(),
  routine_option: yup.string().required("Pick a routine option"),
  upline_objective_id: yup.string(),
  upline_initiative_id: yup.string(),
  start_time: yup.string(),
  //after_occurrence and end_date u pick one of them depending on how you want to end the task 
  after_occurrence:yup.number(),
  end_time:yup.string(),
    
  // target_point: yup.string().required(),
  initiiative_brief:yup.mixed()
  // initiative_brief:yup.
})
const UpdateJDandInitiaitive:React.FC<any>=(props)=>{
    const [state,markoDispatch]=useReducer(ShowEditAbleInputReducer,ShowEditAbleInput);



    const {
        register,
        handleSubmit,control,setValue,getValues,
        formState: { errors },reset,watch
      } = useForm<AddJDAndInitiativeInputs>({ resolver: yupResolver(schema) });
      //fields to watch
  const [InitiativeToOnce,setInitiativeToOnce] = useState(false);

  



  const [editStartDate,setEditStartDate] = useState<{previous_set_date:string;isedit:boolean}>({
    previous_set_date:props.start_date,
    isedit:false
  })
  const [editEndDate,setEditEndDate] = useState<{previous_set_date:string;isedit:boolean}>({
    previous_set_date:props.end_date?props.end_date:'',
    isedit:false
  })
  const [editAfter_occurrence,setEditAfter_occurrence] = useState({
    previous_set_date:props.after_occurrence?props.after_occurrence:null,
    isedit:false
  })


  
  const handleError=  useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [levelIsLoading, setLevelIsLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [objectives, setobjectives] = useState<Objective[]>([]);
  const [structureLevels, setStructureLevels] = useState<
    Corporate[] | Division[] | Group[] | Department[] | Unit[]
  >([]);
  const [currentLevel,setCurrentLevel] =useState<string>('corporate-level');
  const [initiatives,setInitiative]=useState<[]>([])
  const [selectedRoutineOption, setSelectedRoutineOption] = useState("");
  const [isEmployeeLoading,setIsEmployeeLoading]=useState(true)
  const [listOfEmployees,setListOfEmployees]=useState<[]>([])
  const [isCreateTeamLead,setisCreateTeamLead]=useState(false);
  const [currentTeamLead,setCurrentTeamLead]=useState<string>('')
  const dispatch = useAppDispatch();
  const toast = useToast();
  const {status,message,errorMessage}=useAppSelector(selectJdIntiatives)
  // setAssignorEmail
  
  const [currentlevelID,setCurrentlevelID]=useState<string>();
  const [currentAssignor,SetCurrentAssignor] = useState<string>()

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


  //this helps keep track of the user picking any of the end dates
  const [endByCalendarIsDisable,setEndByCalendarIsDisable] = useState<boolean>(false)
  const [endByOccurenceIsDisable,setEndByOccurenceIsDisable] = useState<boolean>(true)

  const routineOptionField = register("routine_option");
  const handleShowEndTimeField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutineOption(e.target.value);
  };

  const getObjectives = async (ORG_NAME: string) => {
    try {
      const response = await axios.get(`/client/${ORG_NAME}/objective/`);
      setobjectives(response.data.data);
      setIsLoading(false);
      return response.data.data;
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      return err.response;
    }
  };

  const getInitiatives = async (assignor_email:string)=>{
    const ORG_NAME=localStorage.getItem('current_organization_short_name')
    SetCurrentAssignor(assignor_email)
    try {
      const response = await axios.get(`/client/${ORG_NAME}/initiative/?owner_email=${assignor_email}`);
      setInitiative(response.data.data);
      setIsLoading(false);
      return response.data.data;
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      return err.response;
    }   
  }

  const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelIsLoading(true);
    let selectedLevel = e.target.value;
    setCurrentLevel(selectedLevel)
    try {
      const response = await axios.get(
        `/organization/setup/${selectedLevel}/list/${orgName}/`
      );
      console.log(response.data.data);
      setStructureLevels(response.data.data);
      setLevelIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setLevelIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<AddJDAndInitiativeInputs> =  (data) => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (!ORG_NAME) return;
    // const 
    let start_date:string = data.start_time;// this is what the user entered inthe form
    if(!editStartDate.isedit){
      // since the user dones not want the editted data we would give him the original data
      start_date = editStartDate.previous_set_date
    }

    if(data.routine_option==="once"){
      delete data['after_occurrence']
      if(!editEndDate.isedit){
        data['end_time']=editEndDate.previous_set_date
      }
    }
    if(data.routine_option !=="once"){
      if((endByCalendarIsDisable===true)&&(["monthly","quarterly","half-yearly","yearly"].includes(data.routine_option))){
        //if calendar is marked as disabled delete it
        delete data['end_time']
        if(!editAfter_occurrence.isedit){
          if(editAfter_occurrence.previous_set_date){
            // we just making sure the user is putting the original not the edited dat cus he canled the ediing process
            data['after_occurrence']=editAfter_occurrence.previous_set_date
          }else{
              console.log({'for some reason':editAfter_occurrence.previous_set_date})
              
              toast({
                title: "After Occurrence",
                status: "error",
                description:'You Have Selected After Occurence You have to select a number or you pick end date option!',
                position: "top",
                duration: 3000,
                isClosable: true,
              })
            return null 
          }
        }
      }
      if(endByOccurenceIsDisable===true){
        //if occurence is marked as disabled delete it
        delete data['after_occurrence']
        if(!editEndDate.isedit){
          data['end_time']=editEndDate.previous_set_date
        }
      }
    }

    console.log({'subbmited':data})

    const formData = new FormData();
    formData.append('name',data.name)
    formData.append('owner[email]',data.owner_email)
    formData.append('routine_option',data.routine_option)
    formData.append('start_date',start_date)
    if(props.assignor!==null){
      formData.append('assignor[email]',props.assignor.email)
      
    }
    if(data.end_time){
      formData.append('end_date',moment(data.end_time).format("YYYY-MM-DD"))
    }
    if(data.after_occurrence){
      formData.append("after_occurrence",JSON.stringify(data.after_occurrence))
    }
    if(data.upline_objective_id){
      formData.append('upline_objective[objective_id]',data.upline_objective_id)
    }
    if(data.upline_initiative_id){
      formData.append('upline_initiative[initiative_id]',data.upline_initiative_id)
    }
    if(data.initiiative_brief.length){
      formData.append('initiative_brief',data.initiiative_brief[0])
    }
    dispatch(updateJDandInitiative({ORG_NAME,"data":formData,"uuid":data.initiative_id,"handleError":handleError}))

  };

  const getEmployees= async (currentlevelID:string)=>{
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (!ORG_NAME) return;
    // currentLevel
    const level_to_query:any = {
      'corporate-level':'corporate_level__uuid',
      'divisional-level':'division__uuid',
      'group-level':'group__uuid',
      'departmental-level':'department__uuid',
      "unit-level":'unit__uuid'
    }
    try{
      
  const response = await axios.get(`/client/${ORG_NAME}/employee/?${level_to_query[currentLevel]}=${currentlevelID}`)
      // if isCreateTeamLead get only team lead data
      // isCreateTeamLead?response.data.data.filter((data:any)=>{
      //   return(data.user.user_role=='team_lead')
         
      // }): 
    setListOfEmployees(response.data.data)
      setIsEmployeeLoading(false)
      console.log(response)
      return response.data.data
    }

    catch(err:any){
      console.log(err.response.data||err)

      setIsEmployeeLoading(false)
    }


  }

  useEffect(()=>{
      //this effect helps to fill the form so we can do the update in the form
      
        if(props.after_occurrence){
            setValue("after_occurrence",props.after_occurrence)
        }
      if(props?.owner.email){
          setValue("owner_email",props?.owner.email)

      }
      // setValue("a")
      if(props.upline_objective){
          setValue("upline_objective_id",props.upline_objective.objective_id)
      }
      if(props.upline_initiative){

          setValue("upline_initiative_id",props.upline_initiative.initiative_id)

      }
      // setValue("target_point",props.target_point)
      setValue("initiiative_brief",props.initiiative_brief)
      setValue("name",props.name)
      setValue("routine_option",props.routine_option)
      setValue("initiative_id",props.initiative_id)
    if(props.after_occurrence){
        setEndByOccurenceIsDisable(false)
        setEndByCalendarIsDisable(true)
    }
    if(props.end_time){
        setEndByCalendarIsDisable(false)
        setEndByOccurenceIsDisable(true)
    }
    },[])

  useEffect(()=>{

    // console.log(
    //   "Wow from marko state",
    //   status,message,errorMessage
    // )

      if(status ==='failed'){
        // let errorMessage;
        console.log(
          errorMessage,"SOme Error MEssage"

          // errorMessage.data.errors
          // errorMessage.data.error
        )
        toast({
          title:errorMessage,
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
      }
      if(status==='added'){
        toast({
          title:"Initiaive Added",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
      }
    

   },[status])

   useEffect(() => {
     const ORG_NAME = localStorage.getItem("current_organization_short_name");
     if (!ORG_NAME) return;
     setIsLoading(true);
     setOrgName(ORG_NAME);
     getObjectives(ORG_NAME);
    
 
         //on Load Of theform get the organisation like start_time and other stuff
         let org_settings = localStorage.getItem('org_info')
         if(org_settings){
             setCurrentOrgnisationSettings(JSON.parse(org_settings))
         }
     
   }, []);
 
   // console.log(errors.upline_initiative_id,"wjjei")
   useEffect(()=>{
      if(state.owner_email!==false){
          console.log("wow some functipo")
        //this means it still in it view state
           reset(
            {  ...getValues(),
              upline_objective_id:"",
              upline_initiative_id:"",
              //  initiiative_brief:""
              },
              {keepDefaultValues:true}
              )
      }

   },[isCreateTeamLead])
    
   console.log({errors})
   return (
        <>
      {isLoading ? (
        <h1>Loading....</h1>
      ) : (
        <>
          <DrawerCloseButton />
          <DrawerHeader fontSize="md">Update Kpi</DrawerHeader>
          <DrawerBody>
          {
          props.routine_option!=='once' 
          &&
          <GoodAlert
        title="Remove recurring event"
        details="This is a re-occuring objective. if  you want your changes to affect THIS ITEM only press No. Else press yes to affect THIS AND FOLLOWING EVENT"
        closeText="No"
        submitText="Yes"
        onSubmitFunc={()=>{

          setValue('routine_option',props.routine_option)
          if(props.end_date){

          }
          if(props.after_occurrence){
            setValue('after_occurrence',props.after_occurrence)
          }
          setInitiativeToOnce(false)
        }}
        onCloseFunc={()=>{
            // this means the person want to edit only one so we forcfully change this item to once
            setSelectedRoutineOption('once')
            setValue('routine_option','once')
            setInitiativeToOnce(true)
        }}
        />
        }
            <form id="add-jd-and-initiave" onSubmit={handleSubmit(onSubmit)}>

              <InputWithLabel
                id="name"
                label="Kpi Name"
                variant="filled"
                bg="secondary.200"
                mb="5"
                name="name"
                register={register("name")}
                formErrorMessage={
                  errors.name?.type === "required"
                    ? "Kpi/Initiative Name is required"
                    : undefined
                }
              />

 {
     props.owner&&state.owner_email==false?
     <Flex justify={"space-between"}>
        <FormControl>
        <FormLabel fontSize="xs" htmlFor={"213"} fontWeight="semibold">
          Owner Email
        </FormLabel>

        <Input
          id={'2'}
          type={"text"}
          variant={"filled"}
        //   placeholder={}
          bg={"secondary.200"}
          disabled={true}
          value={props.owner.email}
          style={{'width':"90%"}}
        />
        </FormControl>
   
     
     <GrEdit style={{'width':"10%"}} onClick={(e)=>{markoDispatch({type:"makeEditable",payload:{'owner_email':true}})}}></GrEdit>
     </Flex>:""
 }
 <br />
{
    state.owner_email===true?
    <>

              <HStack mb="5">
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
                </FormControl>







                <FormControl>
                  <FormLabel
                    htmlFor="Structure name"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Structure Name
                  </FormLabel>
                  <Skeleton isLoaded={!levelIsLoading}>
                      <Select
                        placeholder="Select Name"
                        variant="filled"
                        bg="secondary.200"
                        color="gray.400"
                        id="structure_level"
                        onChange={(e)=>{
                          //assignorEmail in this case should be
                          setCurrentlevelID(e.target.value)
                          getEmployees(e.target.value,)
                        }}
                      >
                        {structureLevels.map((structureLevel, idx) =>
                        
                        ( 
                          <option key={idx} value={structureLevel?.uuid}>
      
                                {structureLevel.name}
                        </option>)

                        )

                          
                          }
                        
                      </Select>
                  </Skeleton>
                </FormControl>


              </HStack>
              <HStack mb="5">
                {/* <FormControl>
                  <FormLabel
                    htmlFor="level_id"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Kpi/Initiative Assignor Email
                  </FormLabel>
                  <Skeleton isLoaded={!levelIsLoading}>
                    <Select
                      placeholder="Select Level Name"
                      // name="assignor_email"
                      variant="filled"
                      bg="secondary.200"
                      color="gray.400"
                      id="assignor_email"
                      {...register('assignor_email')}
                      onChange={(e)=>getEmployees(e.target.value)}
                    >
         
                <option value={assignorEmail}>{assignorEmail}</option>


                    </Select>
                  </Skeleton>
                
                </FormControl> */}

                {/* <InputWithLabel
                      id='assignor_email'
                  register={register("assignor_email")}
                  label="Kpi/Initiative Assignor Email"
                  variant="filled"
                  bg="secondary.200"
                mb="5"
                name="assignor_email"
                value={assignorEmail}

                  /> */}

                  <FormControl>
                      <FormLabel
                       htmlFor="level_id"
                       fontSize="xs"
                       fontWeight="semibold"
                      >Kpi Owner Email
                              <Skeleton isLoaded={!isEmployeeLoading}>
                         <Controller
                         name='owner_email'
                        control={control}
                         render={({field})=>(
<Select
                    placeholder="Select Level Name"
                    // name="assignor_email"
                    variant="filled"
                    bg="secondary.200"
                    color="gray.400"
                    id="owner_email"
                    {...register('owner_email')}
                      onChange={(e)=>{
                        let current_employee_uplineEmail:any = listOfEmployees.filter(((data:any)=>{
                          return data.user.email === e.target.value
                        }))[0]
                        if(current_employee_uplineEmail){
                          try{
                            getInitiatives(current_employee_uplineEmail.employee_employment_information.upline.email)
                            setisCreateTeamLead(false)
                          }
                          catch{
                            //if the current ".employee_employment_information.upline.email" doesnt have that that means he is Corprate aTeam Lead
                            setisCreateTeamLead(true)
                            console.log("currentTeam Lead",e.target.value)
                            setCurrentTeamLead(e.target.value)
                          }
                          
                        }

                        return field.onChange(e)

                      }}
          
          
          >
                  {
                    listOfEmployees.map((employee:any,index)=>{

                      // if(employee.corporate_level == null && employee.user.user_role != 'team_lead'){
                        return <option key={index*3} value={employee.user.email}>{employee.user.email}</option>

                      // }


                    })
                  }
                  </Select>
                    )} 
                         />
                         
                            
                      </Skeleton>
                      </FormLabel>
                  </FormControl>

              </HStack>
</>:""
}

              

              {/* if the user is a team Lead Remove Initiaitve */}
 {
   isCreateTeamLead?
   <HStack mb="5">
                <FormControl id="end_time">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    htmlFor="end_time"
                  >
                    Upline Objective
                  </FormLabel>
                  <Select

                    placeholder={props.upline_objective?`${props.upline_objective.name}`:"select upline objective"}
                   
                    variant="filled"
                    bg="secondary.200"
                    {...register('upline_objective_id',{value:''})}
                  >

                    {objectives.filter((objective_data:any)=>{
                      // filter by active or pending bro
                      return ["active","pending"].includes(objective_data.objective_status)
              }).map((objective) => (
                      <option key={uuid_v4()} value={objective.objective_id}>
                        {objective.name} , Current Running Initiative Routine ({objective.routine_round})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>:""

 }             
              

              
{

  isCreateTeamLead?"":
  <HStack mb="5">
      {state.owner_email!==false?
                <FormControl id="end_time">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    htmlFor="end_time"
                  >
                    Upline Initiative
                  </FormLabel>
                  <Select
                    placeholder={props.upline_initiative?`${props.upline_initiative.name}`:"select upline initiative"}
                   
                   variant="filled"
                    bg="secondary.200"
                    {...register('upline_initiative_id',{value:''})}
                    // value={getValues().upline_initiative_id}
                  >
                      {/* <option value="">{props.upline_initiative?`${props.upline_initiative.name}`:"select upline initiative"}</option> */}
                      {
                        initiatives.filter((initiative_data:any)=>{
                          // filter by active or pending bro
                          return ["active","pending"].includes(initiative_data.initiative_status)
                  }).map((data:any)=>{

                          return <option value={data.initiative_id}>{data.name} , Current Running Initiative Routine ({data.routine_round})</option>
                        })
                      }
                  </Select>
                  <Text fontSize="xs" color="crimson">{errors.upline_initiative_id?.message}</Text>
                </FormControl>:""}
              </HStack>
}
              


{
  InitiativeToOnce?
  '':
  
  <HStack mb="5">
  <FormControl id="">
    <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="">
      Routine Option
    </FormLabel>
    <Select
      placeholder={"Pick Rountine"}
      variant="filled"
      bg="secondary.200"
      {...routineOptionField}
      onChange={(e) => {
        routineOptionField.onChange(e);
        handleShowEndTimeField(e);
      }}
    >
      <option value="once">Once</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="fortnightly">Fortnightly</option>
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="half_yearly">Half Yearly</option>
      <option value="yearly">Yearly</option>
    </Select>

    <Text fontSize="xs" color="crimson">
      {errors.routine_option?.message}
    </Text>
  </FormControl>

</HStack>
}
             



{/* START DATE */}
<Flex justifyContent={'space-between'}>
            <Box>
            {
              editStartDate.isedit?

              <>
              <FormLabel htmlFor="routine_option" fontSize="xs" fontWeight="semibold">Start Date</FormLabel>
              
              <ExcludeDaysInCalendar
              days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                      disabled={false}
                        name='start_time'
                        control={control}
                        placeholder="Enter Start Date"
                        formErrorMessage={errors.start_time?.message?"Start Date Can Not Be empty":""}
                        dateFormat ="yyyy/MM/dd"
                        />
                        
              </>
                        :
                        <>
                          <FormLabel htmlFor="routine_option" fontSize="xs" fontWeight="semibold">Start Date</FormLabel>
                                    
                          <InputWithLabel 
                          id='Start Date'
                          disabled={true}
                          label=' '
                          variant={'filled'}
                          bg='secondary.200'
                          name='start_time'
                          mb='5'
                          value={props.start_date}/>
                        </>
            }
            </Box>
            <Button size='sm'width={'10%'} onClick={(e)=>setEditStartDate({isedit:!editStartDate.isedit,previous_set_date:editStartDate.previous_set_date})}>
              {editStartDate.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
            </Button>
          </Flex>
              
              
<br />

{ selectedRoutineOption === 'once' &&

(
<div style={{"textAlign":"center"}}>

                                   
                               
<FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>
                                        {/* //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1 */}

                                        <Flex justifyContent={'space-between'}>
                                                          <Box>
                                                          {
                                                            editEndDate.isedit?
                                                            <ExcludeDaysInCalendar
                                                            days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                                                    disabled={false}
                                                                      name='end_time'
                                                                      control={control}
                                                                      placeholder="Enter End Date"
                                                                      formErrorMessage={errors.end_time?.message?"Start Date Can Not Be empty":""}
                                                                      dateFormat ="yyyy/MM/dd"
                                                                      />:
                                                                      <InputWithLabel 
                                                                      id='End Date'
                                                                      disabled={true}
                                                                      label=' '
                                                                      variant={'filled'}
                                                                      bg='secondary.200'
                                                                      name='end_time'
                                                                      mb='5'
                                                                      value={props.end_date}/>
                                                          }
                                                          </Box>
                                                          <Button size='sm'width={'10%'} onClick={(e)=>setEditEndDate({isedit:!editEndDate.isedit,previous_set_date:editEndDate.previous_set_date})}>
                                                            {editEndDate.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
                                                          </Button>
                                        </Flex>  
            
                  {/* <Text>{errors.end_time?.message}</Text> */}
                    

</div>
)
 }

{ selectedRoutineOption !== 'once' &&

<RadioGroup 
defaultValue='1'
>

<FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>
<Flex>
                                            <Radio value={'1'} isDisabled={endByCalendarIsDisable} onClick={(e)=>{
                                                    if(endByCalendarIsDisable){
                                                    setEndByCalendarIsDisable(false)
                                                    setEndByOccurenceIsDisable(true)
                                                    }}}></Radio>
                                            
                                            <Flex justifyContent={'space-between'}>
                                                        {
                                                          editEndDate.isedit?
                                                          <ExcludeDaysInCalendar 
                                                            //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                                                            days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                                            required={true}
                                                            disabled={((endByCalendarIsDisable ) || (selectedRoutineOption === 'once'))}

                                                            name='end_time'
                                                            control={control}
                                                            placeholder="Enter End Date"
                                                            formErrorMessage={errors.end_time?.message}
                                                            dateFormat ="yyyy/MM/dd"
                                                            />
                                                            :
                                                            <Box>
                                                          <InputWithLabel 
                                                          id='End Date'
                                                          disabled={true}
                                                          label=' '
                                                          variant={'filled'}
                                                          bg='secondary.200'
                                                          name='end_time'
                                                          mb='5'
                                                          value={props.end_date}/>
                                                            </Box>
                                                        }

                                                      <Button size='sm'width={'10%'} onClick={(e)=>setEditEndDate({isedit:!editEndDate.isedit,previous_set_date:editEndDate.previous_set_date})}>
                                                      {editEndDate.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
                                                      </Button>
                                          </Flex>
                                                


</Flex>

<br />

{/* after occurence jsx */}
<FormLabel fontSize="xs" fontWeight="semibold">End By After occurrences</FormLabel>

          <Flex align={'center'}>
                    <Radio 
                    isDisabled={endByOccurenceIsDisable}
                    onClick={(e)=>{
                    if(endByOccurenceIsDisable){
                    setEndByOccurenceIsDisable(false)
                    setEndByCalendarIsDisable(true)
                    }
                    }}
                    ></Radio>


          {
            editAfter_occurrence.isedit?
            <Select
            isDisabled={(endByOccurenceIsDisable|| selectedRoutineOption === 'once')}
            id={'repeat_every_day'}
            variant={"filled"}
            {...register('after_occurrence')}
            placeholder="pick occurrence"
            >
            {
                        [...new Array(7)].map((num,index)=>(
                            <option value={num} key={index*2} >{index+1}</option>
                        ))
                    }
            </Select>   
            :
            <>
              <InputWithLabel 
                id='edit_after_occurrence'
                disabled={true}
                label=' '
                variant={'filled'}
                bg='secondary.200'
                name='after_occurrence'
                mb='5'
                value={props.after_occurrence?props.after_occurrence:'None'}/>
            </>
          }

          <Button size='sm'width={'10%'} onClick={(e)=>setEditAfter_occurrence({isedit:!editAfter_occurrence.isedit,previous_set_date:editAfter_occurrence.previous_set_date})}>
          {editAfter_occurrence.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
          </Button>

          <Text 
          // @ts-ignore
          isDisabled={endByOccurenceIsDisable}
          > {errors.after_occurrence?.message}</Text>      
          </Flex>




</RadioGroup>
}



              <Box>
                {/* <Text fontWeight="semibold" fontSize="sm" mb="4">
                  Quality Targets
                </Text> */}
                <HStack mb="5">
                  <FormControl id="end_time">
                    <FormLabel fontSize="xs" htmlFor="end_time">
                      Upload Kpi/Initiiative Brief
                    </FormLabel>
                    <Input type="file" 
                    {...register('initiiative_brief')}
                    variant="filled" bg="transparent" />
                  </FormControl>
                </HStack>
              </Box>
              {/* <InputWithLabel
                id="target_point"
                label="Target Point"
                variant="filled"
                bg="secondary.200"
                type="number"
                name="target_point"
                register={register("target_point")}
              /> */}
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              type="submit"
              form="add-jd-and-initiave"
              variant="primary"
              w="full"
              isLoading={status=='loading'}
              loadingText="Creating KPI"
            >
              Create Kpi &amp; Initiative
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
    )
}

export default UpdateJDandInitiaitive

