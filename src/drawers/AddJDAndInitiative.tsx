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
import React, { useEffect, useState } from "react";
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
import {addJDandInitiative} from "../redux/jdsAndIntiatives/jdsAndIntiativesApi";
import { selectJdIntiatives } from "../redux/jdsAndIntiatives/jdsAndIntiativesSlice";


import { Corporate, getCorporates } from "../redux/corporate/corporateAPI";
import { selectCorporate } from "../redux/corporate/corporateSlice";

import { selectDivision } from "../redux/division/divisionSlice";
import { getDivisions } from "../redux/division/divisionAPI";


import { selectUnit } from "../redux/unit/unitSlice";
import { getUnits } from "../redux/unit/unitAPI";

import { selectGroup } from "../redux/group/groupSlice";
import { getGroups } from "../redux/group/groupAPI";

import { getDepartments } from "../redux/department/departmentAPI";
import { selectDepartment } from "../redux/department/departmentSlice";
import {ExcludeDaysInCalendar} from "../components/DateInput";
import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../services/list.service";
import SelectAsyncPaginate from "../components/AsyncSelect"
import Preloader from "../components/Preloader";
import { getLoggedin_userEmail } from "../services/auth.service";

export interface AddJDAndInitiativeInputs {
  name: string;
  // assignor_email: string;
  owner_email: string;
  routine_option: string;
  upline_objective_id: string;
  upline_initiative_id: string;
  start_time: string;

  end_time?: string;
  after_occurrence?:number;

  // target_point: string;
  initiiative_brief:any;
  initiative_id:string;
}

export const schema = yup.object().shape({
  name: yup.string().required(),
  // assignor_email: yup.string(),
  initiative_id:yup.string(),
  owner_email: yup.string().required(),
  routine_option: yup.string().required("Pick a routine option"),
  upline_objective_id: yup.string(),
  upline_initiative_id: yup.string(),
  start_time: yup.string().required(),
        //after_occurrence and end_date u pick one of them depending on how you want to end the task 
        after_occurrence:yup.number(),
        end_time:yup.string(),
    
  // target_point: yup.string().required(),
  initiiative_brief:yup.mixed().required()
  // initiative_brief:yup.
})
.test(
  "customTest","",(obj)=>{
    // upline_initiative_id:object




if(obj.after_occurrence ==undefined && obj.end_time==undefined){

    return new yup.ValidationError('Please Reselect a end date or after occurence',null,"end_time")
}


    const isInitiative_0 = obj.upline_initiative_id?.length !==0 && obj.upline_initiative_id!==undefined;
    const isObjective_0=obj.upline_objective_id?.length!==0&&obj.upline_objective_id!==undefined
    console.log(
      {
        "isInitiative_0":obj.upline_initiative_id,"isObjective_0":obj.upline_objective_id
      }
    )
    if(isInitiative_0&& isObjective_0){
      // if the two are fill up tell use You can subit the two
    return new yup.ValidationError("You can not submit Upline Objective and Upline Intiative the same time",null,'upline_initiative_id')
    }


    // const isInitiative_0 = obj.upline_initiative_id?.length !=0;
    // const isObjective_0=obj.upline_objective_id?.length!=0
    if(obj.upline_objective_id?.length==0 && obj.upline_initiative_id?.length==0){

        return new yup.ValidationError("At least Upline Objective or Upline Initiative Should be not be empty",null,'upline_initiative_id')
    }

    

    return true

  }
)



.test("testing_end_date_and_AfterOCcurence","",(obj)=>{


  if(obj.routine_option==="once"){

    if(obj.end_time===undefined){
    return new yup.ValidationError("Please End Date Cant be Empty",null,'end_time')
    }
    // if(obj.after_occurrence!==undefined){
    //   return new yup.ValidationError("after occurrence can not be choosen with Routine Option 'Once' ",null,'after_occurrence')
    // }
  }

if(obj.routine_option){


  if(["monthly","quarterly","half-yearly","yearly"].includes(obj.routine_option)){
      // ths means it not Once they choose so at leat after occurence or end date should be picked
      if((obj.after_occurrence===undefined) && (obj.end_time===undefined)){
        return new yup.ValidationError("Please choose one either after occurenece or end_date",null,'end_time')
      }
     
  }
}

  return true
})


type AddJDPropType ={
  from_team_leadpage?:boolean;
  team_info?:{level_name:string,level_id:string}
}
const AddJD = ({from_team_leadpage=false,team_info}:AddJDPropType):React.ReactElement => {
  const org_name = localStorage.getItem("current_organization_short_name");

  const {
    register,
    handleSubmit,control,setValue,
    formState: { errors },reset,getValues
  } = useForm<AddJDAndInitiativeInputs>({ resolver: yupResolver(schema) });

  const [isLoading, setIsLoading] = useState(false);
  const [levelIsLoading, setLevelIsLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [objectives, setobjectives] = useState<Objective[]>([]);
  const [objective, setobjective] = useState<null|Objective>(null);
  const [structureLevels, setStructureLevels] = useState<
    Corporate[] | Division[] | Group[] | Department[] | Unit[]
  >([]);
  const [currentLevel,setCurrentLevel] =useState<string>('corporate-level');
  const [initiatives,setInitiative]=useState<[]>([])
  const [currentInitiative,setCurrentInitiative]=useState<any>(null)
  const [selectedRoutineOption, setSelectedRoutineOption] = useState("");
  const [isEmployeeLoading,setIsEmployeeLoading]=useState(true)
  const [listOfEmployees,setListOfEmployees]=useState<[]>([])
  const [employee,setEmployee]=useState<any>()
  const [isCreateTeamLead,setisCreateTeamLead]=useState(false);
  const [currentTeamLead,setCurrentTeamLead]=useState<string>('')
  const dispatch = useAppDispatch();
  const toast = useToast();
  const {status,message,errorMessage}=useAppSelector(selectJdIntiatives)
  // setAssignorEmail
  
  const [currentlevelID,setCurrentlevelID]=useState<any>();
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
        setTimeout(()=>{


          window.location.reload()
         },2000)
        toast({
          title:"Initiaive Added",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
        


      }
    

   },[status])


  const routineOptionField = register("routine_option");
  const handleShowEndTimeField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutineOption(e.target.value);
  };



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
    console.log(data,"SUbmmited");
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (!ORG_NAME) return;
    // setORG_NAME_state(ORG_NAME)




    if(data.routine_option==="once"){
      delete data['after_occurrence']
    }
    if(data.routine_option !=="once"){

      if((endByCalendarIsDisable===true)&&(["daily","weekly","fortnightly","monthly","quarterly","half_yearly",'yearly'].includes(data.routine_option))){
        //if calendar is marked as disabled delete it
        delete data['end_time']
      }

      if(endByOccurenceIsDisable===true){
        //if occurence is marked as disabled delete it
        delete data['after_occurrence']
      }
    }











    const formData = new FormData();
    

    
    formData.append('name',data.name)
    if(currentAssignor && !isCreateTeamLead){
      // if(isCreateTeamLead){}
      formData.append('assignor[email]',currentAssignor)

    }
    // if(data.assignor_email){
    // }
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
    
    formData.append('start_date',moment(data.start_time).format("YYYY-MM-DD"))
    formData.append('owner[email]',data.owner_email)
    // formData.append('target_point',data.target_point)
    formData.append('routine_option',data.routine_option)
    if(data.initiiative_brief.length){
      formData.append('initiative_brief',data.initiiative_brief[0])
    }
    // console.log(form_date(formData.get('end_date')))
    // console.log(data.initiiative_brief[0])YYYY-MM-DD

  
// console.log(data,'dd')
// console.log(data.initiiative_brief.length,'initiative bref')
    dispatch(addJDandInitiative({ORG_NAME,"data":formData}))
        
       

  };
  const level_to_query:any = {
    'corporate-level':'corporate_level__uuid',
    'divisional-level':'division__uuid',
    'group-level':'group__uuid',
    'departmental-level':'department__uuid',
    "unit-level":'unit__uuid'
  }



  const from_team_leadpageFunc = async( )=>{
    /*
    the idea of this function
    this function runs onlyu when from_team_leadpage is true

    it uses the logged in user email to get  employee info
    there we can see the user level and level id which we would set
    */


   const loggedInUser  = getLoggedin_userEmail()
   console.log({loggedInUser,team_info})
   if(team_info?.level_name){
     setCurrentLevel(team_info?.level_name)
   }
   if(team_info?.level_id){
    setCurrentlevelID({'uuid':team_info.level_id})
   }
  } 

  useEffect(() => {
    setValue("initiative_id","we dont need it here in creation")
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (!ORG_NAME) return;
    // setIsLoading(true);
    setOrgName(ORG_NAME);
    // getObjectives(ORG_NAME);
   

        //on Load Of theform get the organisation like start_time and other stuff
        let org_settings = localStorage.getItem('org_info')
        if(org_settings){
            setCurrentOrgnisationSettings(JSON.parse(org_settings))
        }

        if(from_team_leadpage){
          // we have to get the currentlevelID and  currentlevel
          from_team_leadpageFunc()
        }
    
  }, []);

  // console.log(errors.upline_initiative_id,"wjjei")
  useEffect(()=>{
    reset(
      {  ...getValues(),
        upline_objective_id:"",
        upline_initiative_id:"",
        //  initiiative_brief:""
        },
        {keepDefaultValues:true}
        )
  },[isCreateTeamLead])






console.log({'from drawer':from_team_leadpage})
  return (
    <>
      {isLoading ? (
       <Preloader />
      ) : (
        <>
          <DrawerCloseButton />
          <DrawerHeader fontSize="md">Create New Kpi</DrawerHeader>
          <DrawerBody>
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
                    ? "Kpi Name is required"
                    : undefined
                }
              />

 
<>
      {
        !from_team_leadpage //from_team_leadpage this removes pick structure level from the form becasue if it a team lead that is using the form we already should have his info
        &&(
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
            {/* {currentLevel} */}
            <SelectAsyncPaginate 
        //?me=1 added this dummy params so i can tag on &page=1 dynamically
        key={currentLevel}
        url={`/organization/setup/${currentLevel}/list/${org_name}/?me=1`}
        value={currentlevelID}
        onChange={(value)=>{
          // setValue("level",value?.name)
          // setValue("level_id",value?.uuid)
          console.log(value)
          setCurrentlevelID(value)
          //i need the id to get the aEmployee Details
          // getEmployees(e.target.value,)
           return value
        }}
        SelectLabel={(option:any)=>`${option.name}`}
        SelectValue={(option:any)=> {
          return `${option.uuid}`
        } }
        placeholder={""}
        
        />
          </FormControl>


        </HStack>
        )
      }
             
              <HStack mb="5">
               
                  <FormControl>
                      <FormLabel
                       htmlFor="level_id"
                       fontSize="xs"
                       fontWeight="semibold"
                      >Kpi Owner Email






                      <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              key={currentlevelID?.uuid}
              url={`/client/${org_name}/employee/?${level_to_query[currentLevel]}=${currentlevelID?.uuid}`}
              value={employee}
              onChange={(value)=>{
                console.log("employeeChossen",value)
                setEmployee(value)
                setValue("owner_email",value.user.email)
                const current_employee_uplineEmail = value
                if(current_employee_uplineEmail){
                  try{
              SetCurrentAssignor(current_employee_uplineEmail.employee_employment_information.upline.email)
                    // getInitiatives(current_employee_uplineEmail.employee_employment_information.upline.email)
                    setisCreateTeamLead(false)
                  }
                  catch{
                    //if the current ".employee_employment_information.upline.email" doesnt have that that means he is Corprate aTeam Lead //this means we can connect his initative to objective
                    setisCreateTeamLead(true)
                    console.log("currentTeam Lead",value.user.email)
                    setCurrentTeamLead(value.user.email)
                  }
                  
                }
                
                return value
              }}
              SelectLabel={(option:any)=>`${option.user.email}`}
              SelectValue={(option:any)=> {
                return `${option.uuid}`
              } }
              placeholder={""}
              
              />

                      </FormLabel>

                    
                  </FormControl>

              </HStack>
</>

              

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
                  
                  <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              key={JSON.stringify(isCreateTeamLead)}
              url={`/client/${org_name}/objective/?objective_status=active&objective_status=pending`}
              value={objective}
              onChange={(value)=>{

                console.log(value)
                setValue("upline_objective_id",value?.objective_id)
                setobjective(value)
                // setValue("upline_objective_id")
                //i need the id to get the aEmployee Details
                // getEmployees(e.target.value,)
                 return value
              }}
              SelectLabel={(option:any)=>`${option.name} , Current Running Initiative Routine (${option.routine_round})`}
              SelectValue={(option:any)=> {
                return `${option.uuid}`
              } }
              placeholder={""}
              
              />
                </FormControl>
              </HStack>:""

 }             
              

              
{
  isCreateTeamLead?"":
  <HStack mb="5">
                <FormControl id="end_time">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    htmlFor="end_time"
                  >
                    Upline Initiative
                  </FormLabel>
                 



                  <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              //the key enables re-render
              key={JSON.stringify(currentAssignor)}
              url={`/client/${org_name}/initiative/?owner_email=${currentAssignor}`}
              value={currentInitiative}
              onChange={(value)=>{

                console.log(value)
                setValue("upline_initiative_id",value?.initiative_id)
                setCurrentInitiative(value)
              
               
                 return value
              }}
              SelectLabel={(option:any)=>`${option.name} , Current Running Initiative Routine (${option.routine_round})`}
              SelectValue={(option:any)=> {
                return `${option.uuid}`
              } }
              placeholder={""}
              
              />
                  <Text fontSize="xs" color="crimson">{errors.upline_initiative_id?.message}</Text>
                </FormControl>
              </HStack>
}
              



              <HStack mb="5">
                <FormControl id="">
                  <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="">
                    Routine Option
                  </FormLabel>
                  <Select
                    placeholder="Select Routine"
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
             
  <FormLabel fontSize="xs"  fontWeight="semibold">
          Start Date
        </FormLabel>
              <ExcludeDaysInCalendar 
                    name='start_time'
                    control={control}
                    days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                    placeholder={"Enter Start Date"}
                    formErrorMessage={errors?.start_time?.message?"Start Date Can Not Be empty":""}
                    dateFormat ="yyyy/MM/dd"
              />
              
              
<br />

{ selectedRoutineOption === 'once' &&

(
<div style={{"textAlign":"center"}}>

                                   
                               
                               <FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>

                                       <ExcludeDaysInCalendar 
                                       //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                                       days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                       required={true}
                                       disabled={!(selectedRoutineOption === 'once')}

                                       name='end_time'
                                       control={control}
                                       placeholder="Enter Start Date"
                                       formErrorMessage={errors.start_time?.message?"Start Date Can Not Be empty":""}
                                       dateFormat ="yyyy/MM/dd"
                                       />
                                  
                  <Text>{errors.end_time?.message}</Text>
                    

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
                                   

                                       <ExcludeDaysInCalendar 
                                       //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                                       days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                       required={true}
                                       disabled={((endByCalendarIsDisable ) || (selectedRoutineOption === 'once'))}

                                       name='end_time'
                                       control={control}
                                       placeholder="Enter Start Date"
                                       formErrorMessage={errors.start_time?.message?"Start Date Can Not Be empty":""}
                                       dateFormat ="yyyy/MM/dd"
                                       />


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
                       <Text>{errors.end_time?.message}</Text>    
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
  );
};

export default AddJD;
