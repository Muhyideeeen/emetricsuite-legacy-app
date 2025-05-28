import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Button,
 
    FormControl,IconButton,
    FormLabel,
    HStack,
    Select,
    Text,Radio,RadioGroup,
    Box,
    Flex,Grid,Drawer,
    useToast,
  } from "@chakra-ui/react";
import React, { useReducer,useEffect, useState } from "react";
import InputWithLabel from "../components/InputWithLabel";
import moment from "moment";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid_v4 } from "uuid";
import { Division } from "../redux/division/divisionAPI";
import { Group } from "../redux/group/groupAPI";
import { Department } from "../redux/department/departmentAPI";
import { Unit } from "../redux/unit/unitAPI";
import axios from "../services/api";
import { useErrorHandler } from "react-error-boundary";  
import { Corporate, getCorporates } from "../redux/corporate/corporateAPI";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectObjective } from "../redux/objective/objectiveSlice";
import { addObjective, updateObjective } from "../redux/objective/objectiveAPI";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { selectPerspective } from "../redux/perspective/perspectiveSlice";
import { selectCorporate } from "../redux/corporate/corporateSlice";
import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../services/list.service";
import {ExcludeDaysInCalendar} from "../components/DateInput";
import SelectAsyncPaginate from "../components/AsyncSelect"
import { ObjectivePerspective,AddObjectiveInputs,schema as AddObjectiveSchema, routineOptionType } from "./AddObjective";
import GoodAlert from "../components/GoodAlert";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {BsPencil } from 'react-icons/bs'
import errorMessageGetter from "../utils/errorMessages";

export interface UpdateObjectiveInputs {
  name: string;
  corporate_level: {
    uuid: string;
  };
  routine_option: routineOptionType;
  start_date: string;
  end_date?: string;
  after_occurrence?:number;

  perspective:{perspective_id:string,relative_point:number|string}[];
}


type UpdateObjectiveProp ={
  name:string;
  corporate_level:{
    uuid:string;
    name?:string;
  },
  routine_option:"once"|"monthly"|"quarterly"|"half-yearly"|"yearly";
  start_date:string;
  end_date?:string;
  after_occurrence?:number;
  perspective?:any[];
  objective_id?:string;

}

export const schema = yup.object().shape({
  name: yup.string().required(),
  corporate_level: yup.object().shape({
    uuid: yup.string().required(),
  }),
  routine_option: yup.string().required("pick routine option"),
  start_date: yup.date(),
  after_occurrence:yup.number(),
  end_date:yup.date(),

})





const UpdateObjective=(props:UpdateObjectiveProp):React.ReactElement=>{

    const { status,errorMessage } = useAppSelector(selectObjective);
    const { corporates } = useAppSelector(selectCorporate);
    const dispatch = useAppDispatch();
    const [org_name,setOrg_name]=useState<string|null>(null)
    const [currentCoprate,setCurrentCoprate]= useState<any>(null);

  const {
    register,setValue, 
    handleSubmit,control,
    formState: { errors },watch
  } = useForm<UpdateObjectiveInputs>({ resolver: yupResolver(schema) });
  const [objectivePerspectiveList, setObjectivePerspectiveList] = useState<
  ObjectivePerspective[]
  >([{ relative_point: null, perspective_id: "" }]);
const [selectedRoutineOption, setSelectedRoutineOption] = useState('');
const toast = useToast();
const { perspectives } = useAppSelector(selectPerspective);
  //this helps keep track of the user picking any of the end dates
  const [endByCalendarIsDisable,setEndByCalendarIsDisable] = useState<boolean>(false)
  const [endByOccurenceIsDisable,setEndByOccurenceIsDisable] = useState<boolean>(true)
  const [objectiveToOnce,setObjectiveToOnce] = useState(false);
  const [editCorporate_level,setEditCorporate_level] =useState(false);
  const routineOptionField = register('routine_option');
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
  const [isUpdating,setIsUpdating] = useState(false)

  const handleShowEndTimeField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
   setSelectedRoutineOption(e.target.value);
  }

  const handleAddNewInputRow = () => {
    setObjectivePerspectiveList([
      ...objectivePerspectiveList,
      { relative_point: null, perspective_id: "" },
    ]);
  };
  
  const handleDelete = (index: number) => {
    const newList = [...objectivePerspectiveList];
    newList.splice(index, 1);
    setObjectivePerspectiveList(newList);
  };


  








  const updateObjectiveAPi = async ({data, ORG_NAME , id,is_recurring}: { ORG_NAME: string; data: UpdateObjectiveInputs,id:string, is_recurring:boolean }) => {
    // i need to reformat the date with moment.js
    let newLyupdatedData = {...data}
    setIsUpdating(true)
    if(data.start_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,start_date:moment(newLyupdatedData.start_date).format("YYYY-MM-DD")}
    }
  
    if(data.end_date){
      //here we reformatting only start_date
      newLyupdatedData={...newLyupdatedData,end_date:moment(newLyupdatedData.end_date).format("YYYY-MM-DD")}
    }
    try {
      const response = await axios.put(
        `/client/${ORG_NAME}/objective/${id}/${is_recurring?'?recurring=True':''}`,
        newLyupdatedData
      );
      console.log("One Objective", response.data);
      let resp_data:any
      resp_data = response.data.data
      toast({
        title:  'updated successfully',
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
      return resp_data ;
    } catch (err: any) {
      
    
      toast({
        title:   errorMessageGetter(err.response.data ),
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    }

    setIsUpdating(false)
  }







  const onSubmit: SubmitHandler<UpdateObjectiveProp> = (data) => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {

      if(!editStartDate.isedit){
        // since the user dones not want the editted data we would give him the original data
        data['start_date'] = editStartDate.previous_set_date
      }
      
      if(data.routine_option==="once"){
        delete data['after_occurrence']
        if(!editEndDate.isedit){
          data['end_date']=editEndDate.previous_set_date
        }
      }
      if(data.routine_option !=="once"){
        if((endByCalendarIsDisable===true)&&(["monthly","quarterly","half-yearly","yearly"].includes(data.routine_option))){
          //if calendar is marked as disabled delete it
          delete data['end_date']
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
            data['end_date']=editEndDate.previous_set_date
          }
        }
      }

      const clean_data:UpdateObjectiveInputs ={
        name:data.name,
        corporate_level:{uuid:data.corporate_level.uuid},
        routine_option:data.routine_option,
        after_occurrence:data.after_occurrence,
        perspective:props.perspective?props.perspective.map((perspective)=>({
          perspective_id:perspective.perspective.perspective_id,
          relative_point:perspective.relative_point
        })):[],
        start_date:data.start_date,
        end_date:data.end_date

      }
    console.log({clean_data})
      if(props.objective_id){
        updateObjectiveAPi({ data:clean_data, ORG_NAME,id:props.objective_id ,is_recurring:props.routine_option==='once'?false:true})
        // dispatch(addObjective({ORG_NAME, data}))
        // dispatch(updateObjective({ data:clean_data, ORG_NAME,id:props.objective_id ,is_recurring:props.routine_option==='once'?false:true}));
      }
    }
  };

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

useEffect(()=>{
    //on Load Of theform get the organisation like start_time and other stuff
    let org_settings = localStorage.getItem('org_info')
    
    if(org_settings){
        setCurrentOrgnisationSettings(JSON.parse(org_settings))
    }

    const ORG_NAME= localStorage.getItem('current_organization_short_name')
        if(ORG_NAME){
          setOrg_name(ORG_NAME)
        }

    // dispatch(getCorporates())
  if(props.name){
    setValue('name',props.name)
  }
  if(props.corporate_level){
    setValue('corporate_level',{'uuid':props.corporate_level.uuid})
  }

  

  },[])



  useEffect(() => {
    
    if(status === 'failed'){
      
        toast({
          title: errorMessage,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
    } 




  
  }, [status])

    return (


<>
      <DrawerCloseButton />
      <DrawerHeader  fontSize="md">Update Objective</DrawerHeader>
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
          setObjectiveToOnce(false)
        }}
        onCloseFunc={()=>{
            // this means the person want to edit only one so we forcfully change this item to once
            setSelectedRoutineOption('once')
            setValue('routine_option','once')
            setObjectiveToOnce(true)
        }}
        />
        }
        
        <form id="update-objective-form" onSubmit={handleSubmit(onSubmit)}>
          <InputWithLabel
            id="name"
            // disabled={true}
            label=" Name of Objective"
            variant="filled"
            bg="secondary.200"
            name="name"
            mb="5"
            register={register("name")}
            formErrorMessage={errors.name?.message}
          />


        <Flex justifyContent={'space-between'}>
            <Box width={'84%'}>
            {
            editCorporate_level?
            
            <FormControl mb="5">
            <FormLabel htmlFor="corporate_level" fontSize="xs" fontWeight="semibold">
            Corporate Level
            </FormLabel>
            <SelectAsyncPaginate 
            //?me=1 added this dummy params so i can tag on &page=1 dynamically
                                url={`/organization/setup/corporate-level/list/${org_name}/?me=1`}
                                value={currentCoprate}
                                onChange={(value)=>{
                                  // console.log(value.user.email,">>>>>")
                                return   setCurrentCoprate(value)
                                
                                }}
                                SelectLabel={(option:any)=>`${option.name}`}
                                SelectValue={(option:any)=> {
                                  return `${option.uuid}`
                                } }
                                placeholder={""}

            />
          </FormControl>
            :
            <>
            <InputWithLabel 
            id='edit_coporate_level'
            disabled={true}
            label='Corporate Level'
            variant={'filled'}
            bg='secondary.200'
            name='corporate_level'
            mb='5'
            value={props.corporate_level.name}/>
            

            </>
            }

            </Box>
          <Button size='sm'width={'10%'} onClick={(e)=>setEditCorporate_level(!editCorporate_level)}>
            {editCorporate_level?<AiOutlineCloseCircle/>:<BsPencil/>} 
          </Button>
        </Flex>
         
          
          {
            objectiveToOnce?
            ''
            :
            <HStack align="baseline">
            <FormControl id="routine_option" mb="5">
              <FormLabel htmlFor="routine_option" fontSize="xs" fontWeight="semibold">Routine Option</FormLabel>
              <Select
                placeholder="Select type"
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                {...routineOptionField}
                onChange={(e) => {
                  routineOptionField.onChange(e);
                  handleShowEndTimeField(e);
                }}
              >
                <option value="once">Once</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Bi-Annually</option>
                <option value="yearly">Annually</option>
              </Select>
              <Text fontSize="sm" color="crimson">
                {errors.routine_option?.message}
              </Text>
            </FormControl>
            </HStack>
            }
          <FormLabel fontSize="xs" fontWeight="semibold">Start Date</FormLabel>
          
          
          <Flex justifyContent={'space-between'}>
            <Box>
            {
              editStartDate.isedit?
              <ExcludeDaysInCalendar
              days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                      disabled={false}
                        name='start_date'
                        control={control}
                        placeholder="Enter Start Date"
                        formErrorMessage={errors.start_date?.message?"Start Date Can Not Be empty":""}
                        dateFormat ="yyyy/MM/dd"
                        />:
                        <InputWithLabel 
                        id='Start Date'
                        disabled={true}
                        label=' '
                        variant={'filled'}
                        bg='secondary.200'
                        name='start_date'
                        mb='5'
                        value={props.start_date}/>
            }
            </Box>
            <Button size='sm'width={'10%'} onClick={(e)=>setEditStartDate({isedit:!editStartDate.isedit,previous_set_date:editStartDate.previous_set_date})}>
              {editStartDate.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
            </Button>
          </Flex>


          <br/>
         { selectedRoutineOption === 'once' &&

         (
<div style={{"textAlign":"left"}}>

                                            
                                        
                                        <FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>
                                        {/* //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1 */}

                                        <Flex justifyContent={'space-between'}>
                                                          <Box>
                                                          {
                                                            editEndDate.isedit?
                                                            <ExcludeDaysInCalendar
                                                            days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                                                    disabled={false}
                                                                      name='end_date'
                                                                      control={control}
                                                                      placeholder="Enter End Date"
                                                                      formErrorMessage={errors.end_date?.message?"Start Date Can Not Be empty":""}
                                                                      dateFormat ="yyyy/MM/dd"
                                                                      />:
                                                                      <InputWithLabel 
                                                                      id='End Date'
                                                                      disabled={true}
                                                                      label=' '
                                                                      variant={'filled'}
                                                                      bg='secondary.200'
                                                                      name='end_date'
                                                                      mb='5'
                                                                      value={props.end_date}/>
                                                          }
                                                          </Box>
                                                          <Button size='sm'width={'10%'} onClick={(e)=>setEditEndDate({isedit:!editEndDate.isedit,previous_set_date:editEndDate.previous_set_date})}>
                                                            {editEndDate.isedit?<AiOutlineCloseCircle/>:<BsPencil/>} 
                                                          </Button>
                                        </Flex>                                           


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

                                                            name='end_date'
                                                            control={control}
                                                            placeholder="Enter End Date"
                                                            formErrorMessage={errors.end_date?.message}
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
                                                          name='end_date'
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



          

<br /><br />


        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button
          type="submit"
          form="update-objective-form"
          variant="primary"
          w="full"
          isLoading={isUpdating === true}
          loadingText="loading..."
        >
          Update Objective
        </Button>
      </DrawerFooter>
    </>

    )
}


export default UpdateObjective;