import { useState ,useEffect} from "react";
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  Text,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Box,
  Flex,
  Spacer,
  Grid,
  IconButton,RadioGroup ,
  useToast,Radio,
} from "@chakra-ui/react";
import { v4 as uuid_v4 } from 'uuid';

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputWithLabel from "../components/InputWithLabel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectObjective } from "../redux/objective/objectiveSlice";
import { addObjective } from "../redux/objective/objectiveAPI";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { selectPerspective } from "../redux/perspective/perspectiveSlice";
import { selectCorporate } from "../redux/corporate/corporateSlice";
import { CurrentOrgnisationSettingsType, getOrganisationWorkInfo } from "../services/list.service";
import {ExcludeDaysInCalendar} from "../components/DateInput";
import { getCorporates } from "../redux/corporate/corporateAPI";
import SelectAsyncPaginate from "../components/AsyncSelect"
export interface ObjectivePerspective {
  perspective_id: string;
  relative_point: number | null;
}
export type routineOptionType="once"|"monthly"|"quarterly"|"half-yearly"|"yearly"
export interface AddObjectiveInputs {
  name: string;
  corporate_level: {
    uuid: string;
  };
  routine_option: routineOptionType;
  start_date: string;
  end_date?: string;
  after_occurrence?:number;

  perspective: ObjectivePerspective[];
}

export const schema = yup.object().shape({
  name: yup.string().required(),
  corporate_level: yup.object().shape({
    uuid: yup.string().required(),
  }),
  routine_option: yup.string().required("pick routine option"),
  start_date: yup.string().required(),
      //after_occurrence and end_date u pick one of them depending on how you want to end the task 
    after_occurrence:yup.number(),
    end_date:yup.string(),
  perspective: yup.array().of(
    yup.object().shape({
      perspective_id: yup.string().required(),
      relative_point: yup.number().required(),
    })
  ),
}).test("testing_end_date_and_AfterOCcurence","",(obj)=>{


  if(obj.routine_option==="once"){

    if(obj.end_date===undefined){
    return new yup.ValidationError("Please End Date Cant be Empty",null,'end_date')
    }
    // if(obj.after_occurrence!==undefined){
    //   return new yup.ValidationError("after occurrence can not be choosen with Routine Option 'Once' ",null,'after_occurrence')
    // }
  }

if(obj.routine_option){


  if(["monthly","quarterly","half-yearly","yearly"].includes(obj.routine_option)){
      // ths means it not Once they choose so at leat after occurence or end date should be picked
      if((obj.after_occurrence===undefined) && (obj.end_date===undefined)){
        return new yup.ValidationError("Please choose one either after occurenece or end_date",null,'end_date')
      }
     
  }
}

  return true
}).test("duplicate_percetive","",(obj)=>{
  const arry=obj.perspective?.map(data=>data.perspective_id)

  const toFindDuplicates = (arry:any) => arry.filter((item:any, index:number) => arry.indexOf(item) !== index)
const duplicateElement:string[] = toFindDuplicates(arry);
  if(duplicateElement.length!==0){
      //if it not directly equal to zero that means there is duplcate
    return new yup.ValidationError("Avoid Duplicate perpective",null,'perspective[0].perspective_id')

  }
return true
})

const AddObjective = () => {
  const { status,errorMessage } = useAppSelector(selectObjective);
  const { corporates } = useAppSelector(selectCorporate);
  const dispatch = useAppDispatch();
  const [org_name,setOrg_name]=useState<string|null>(null)
  const [currentCoprate,setCurrentCoprate]= useState<any>(null);

  const {
    register,setValue, 
    handleSubmit,control,
    formState: { errors },
  } = useForm<AddObjectiveInputs>({ resolver: yupResolver(schema) });
  const [objectivePerspectiveList, setObjectivePerspectiveList] = useState<
    ObjectivePerspective[]
  >([{ relative_point: null, perspective_id: "" }]);
  const [selectedRoutineOption, setSelectedRoutineOption] = useState('');
  const toast = useToast();
  const { perspectives } = useAppSelector(selectPerspective);

  //this helps keep track of the user picking any of the end dates
  const [endByCalendarIsDisable,setEndByCalendarIsDisable] = useState<boolean>(false)
  const [endByOccurenceIsDisable,setEndByOccurenceIsDisable] = useState<boolean>(true)


  const routineOptionField = register('routine_option');

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

  const onSubmit: SubmitHandler<AddObjectiveInputs> = (data) => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {
      console.log(data,"some data")

      if(data.routine_option==="once"){
        delete data['after_occurrence']
      }
      if(data.routine_option !=="once"){

        if((endByCalendarIsDisable===true)&&(["monthly","quarterly","half-yearly","yearly"].includes(data.routine_option))){
          //if calendar is marked as disabled delete it
          delete data['end_date']
        }
  
        if(endByOccurenceIsDisable===true){
          //if occurence is marked as disabled delete it
          delete data['after_occurrence']
        }
      }

      console.log(data,"submmited",{
        "end by calendar":endByCalendarIsDisable,
        "end by occur":endByOccurenceIsDisable
      })
      
      dispatch(addObjective({ data, ORG_NAME }));
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


    if(status === 'added'){
      
      setTimeout(()=>{
        window.location.reload()
      },2000)
    toast({
      title:"Objective Created Successfully!" ,
      status: "success",
      position: "top",
      duration: 3000,
      isClosable: true,
    }) 
  } 

  
  }, [status])

useEffect(()=>{
  if(currentCoprate){
    console.log(
      {"from currentCoprate":currentCoprate}
    )
    setValue("corporate_level.uuid",currentCoprate?.uuid)
  }
},[currentCoprate])

console.log(errors)
  return (
    <>
    {/* @ts-ignore */}
      <DrawerCloseButton />
      <DrawerHeader  fontSize="md">Create New Objective</DrawerHeader>
      <DrawerBody>
        <form id="add-objective-form" onSubmit={handleSubmit(onSubmit)}>
          <InputWithLabel
            id="name"
            label=" Name of Objective"
            variant="filled"
            bg="secondary.200"
            name="name"
            mb="5"
            register={register("name")}
            formErrorMessage={errors.name?.message}
          />
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
              {/* <Select
                placeholder="Select Level Name"
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                id="corporate_level"
                {...register("corporate_level.uuid")}
              >
                {corporates.map((corporate, idx) => {
                  return (
                    <option key={idx} value={corporate.uuid}>
                      {corporate.name}
                    </option>
                  );
                })}
              </Select> */}
            {/* <Text fontSize="sm" color="crimson">
              {errors.level_id?.message}
            </Text> */}
          </FormControl>
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
                <option value="once">Weekly</option>
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
          <FormLabel fontSize="xs" fontWeight="semibold">Start Date</FormLabel>
          <ExcludeDaysInCalendar
          days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                  disabled={false}
                    name='start_date'
                    control={control}
                    placeholder="Enter Start Date"
                    formErrorMessage={errors.start_date?.message?"Start Date Can Not Be empty":""}
                    dateFormat ="yyyy/MM/dd"
                    
                    />
          {/* <InputWithLabel
            id="start_date"
            label="Start Date"
            variant="filled"
            mb="5"
            type="date"
            bg="secondary.200"
            name="start_date"
            register={register("start_date")}
            formErrorMessage={errors.start_date?.message}
          /> */}<br/>
         { selectedRoutineOption === 'once' &&

         (
<div style={{"textAlign":"center"}}>

                                            
                                        
                                        <FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>

                                                <ExcludeDaysInCalendar 
                                                //basically 0 in ExcludeDaysInCalendar Means Sunday while in app means monday i just have to increment by 1
                                                days_array={[...CurrentOrgnisationSettings.work_days].map(num=>num+1)}
                                                required={true}
                                                disabled={!(selectedRoutineOption === 'once')}

                                                name='end_date'
                                                control={control}
                                                placeholder="Enter Start Date"
                                                formErrorMessage={errors.end_date?.message?"Start Date Can Not Be empty":""}
                                                dateFormat ="yyyy/MM/dd"
                                                />
                                           


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

                                                name='end_date'
                                                control={control}
                                                placeholder="Enter Start Date"
                                                formErrorMessage={errors.end_date?.message}
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
                                <Text 
                                // @ts-ignore
                                isDisabled={endByOccurenceIsDisable?true:false}
                                > {errors.after_occurrence?.message}</Text>      
                                </Flex>




</RadioGroup>
}



          

<br /><br />



          {objectivePerspectiveList.map((perspectiveInputItem, index) => (
            <Grid
              key={uuid_v4()}
              gridTemplateColumns="repeat(6, 1fr)"
              alignItems="end"
              columnGap="2"
              mb="3"
            >
              <FormControl id="perspective_id" gridColumn="span 3">
                <FormLabel htmlFor="perspective_id" fontSize="xs" fontWeight="semibold">Perspective Name</FormLabel>
                <Select
                  placeholder="Select Perspective"
                  variant="filled"
                  bg="secondary.200"
                  color="gray.400"
                  {...register(`perspective.${index}.perspective_id`)}
                >
                  {perspectives.map((perspective) => (
                    <option
                      key={perspective.perspective_id}
                      value={perspective.perspective_id}
                    >
                      {perspective.name}
                    </option>
                  ))}
                </Select>
                {/* Display error message for both fields (perspective id and obj_perspective_point) */}
                {/* <Text fontSize="sm" color="crimson">
                  {errors.perspective?.map(p => p?.perspective_id?.message)}
                </Text> */}
                
              </FormControl>
              <InputWithLabel
                gridColumn="span 2"
                id="relative_point"
                label="Relative point"
                variant="filled"
                type="number"
                bg="secondary.200"
                name="relative_point"
                register={register(
                  `perspective.${index}.relative_point`
                )}
              />
              {index !== 0 && (
                <IconButton
                  aria-label="Delete Perspective Input Row"
                  icon={<RiDeleteBinLine />}
                  onClick={() => handleDelete(index)}
                />
              )}
            </Grid>
          ))}
          {/* <IconButton aria-label="Add to friends" icon={<RiAddLine />} /> */}
          <Text fontSize="sm" color="crimson">
                {errors.perspective!==undefined?
              errors.perspective[0]?.perspective_id?.message:""  
              }
              </Text>
          <Button
            leftIcon={<RiAddLine />}
            mb="2"
            bg="secondary.200"
            variant="solid"
            onClick={handleAddNewInputRow}
          >
            Add More
          </Button>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button
          type="submit"
          form="add-objective-form"
          variant="primary"
          w="full"
          isLoading={status === "adding"}
          loadingText="Creating..."
        >
          Create Objective
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddObjective;
