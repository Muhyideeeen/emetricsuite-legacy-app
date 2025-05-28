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
    useToast,
    IconButton,
    Box,
  } from "@chakra-ui/react";
  import { useForm, SubmitHandler } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import InputWithLabel from "../components/InputWithLabel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDesignation, setStatusIdle } from "../redux/designation/DesignationSlice";
import { updateDesignation } from "../redux/designation/DesignationAPI";
import { GetLevelName } from "../tabs/home/Designation";
import {BsPencil } from 'react-icons/bs'
import { AiOutlineCloseCircle } from "react-icons/ai";
import SelectAsyncPaginate from "../components/AsyncSelect";

const schema = yup.object().shape({
    name: yup.string().required(),
  level:  yup.mixed().required(),

  });
type UpdateDesignationType ={
  name: string;
  level:{
    name:string;
    organisation_short_name:string;
    uuid:string;
    slug:string;
  }
}
const UpdateDesignation = (props:any)=>{


const [designationName,setDesignationName]=useState<string>(props.name);
const org_name = localStorage.getItem("current_organization_short_name");
const [selectedLevel, setSelectedLevel] = useState<string>('');
const [currentCoprate,setCurrentCoprate]= useState<{ name: string; uuid: string }>();

const  {status,message,errorMessage}  = useSelector(selectDesignation);
const dispatch = useAppDispatch();
const [editLevel,setEditLevel] = useState(false)
const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDesignationType>({ resolver: yupResolver(schema) });
  const toast = useToast();
  
  const onSubmit =(data:UpdateDesignationType)=>{
    console.log({'submited':data})
    //here to before we sent it to the api we had to clean the data from null values
    const clean_data:any= {
      name:data.name,
      designation_id:props.designation_id,
      // [data.level]:{
      //   uuid:data.level_id
      // }
    }
    const levelName = ['corporate-level','divisional-level','group-level','departmental-level','unit-level']
    levelName.map(level=>{
      if(selectedLevel === 'corporate-level'){
        clean_data['corporate_level'] =data.level
      }

      if(selectedLevel === 'divisional-level'){
        clean_data['division'] =data.level
      }

      if(selectedLevel === 'group-level'){
        clean_data['group'] =data.level
      }

      if(selectedLevel === 'departmental-level'){
        clean_data['department'] =data.level
      }

      if(selectedLevel === 'unit-level'){
        clean_data['unit'] =data.level
      }
      return level
    })
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
      if(ORG_NAME){
        // console.log({clean_data})
          dispatch(updateDesignation(clean_data))
      }


  }
  const handleRestLevelData =()=>{
    if(props.corporate_level){
      setValue("level",{
        name:props.corporate_level.name,
        organisation_short_name:props.corporate_level.organisation_short_name,
        uuid:props.corporate_level.uuid,
        slug:props.corporate_level.slug
      })
    }
    if(props.department){
      // setValue("level",'department')

      setValue("level",{
        name:props.department.name,
        organisation_short_name:props.department.organisation_short_name,
        uuid:props.department.uuid,
        slug:props.department.slug
      })

    }
    
    if(props.division){

      setValue("level",{
        name:props.division.name,
        organisation_short_name:props.division.organisation_short_name,
        uuid:props.division.uuid,
        slug:props.division.slug
      })
    }
    if(props.group){
      setValue("level",{
        name:props.group.name,
        organisation_short_name:props.group.organisation_short_name,
        uuid:props.group.uuid,
        slug:props.group.slug
      })
    }

    if(props.unit){
      setValue("level",{
        name:props.unit.name,
        organisation_short_name:props.unit.organisation_short_name,
        uuid:props.unit.uuid,
        slug:props.unit.slug
      })
    }
  }
  
  const handleEditLevel=()=>{
    if(editLevel){
      //if it true it would be converted to false after this if statement
      // so i want to set the level straight back
      handleRestLevelData()



    }
    setEditLevel(!editLevel)
  }



  useEffect(()=>{
    setValue("name",props.name)
    handleRestLevelData()
    
},[])

useEffect(()=>{
    if(status=="updated"){
      if(message){
       
        toast({
          title: message,
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        })

        }
        dispatch(setStatusIdle({}))
      }
    if(status==='failed'){
      if(errorMessage){
        toast({
          title: errorMessage,
          status: 'error',
          position: "top",
          duration: 3000,
          isClosable: true,
        })

        }
        dispatch(setStatusIdle({}))
    }
},[status])







  return (
    <>
    <DrawerCloseButton />
    <DrawerHeader fontSize="md">Update  Designation </DrawerHeader>
    <DrawerBody>
      <form id="add-perspective-form" onSubmit={handleSubmit(onSubmit)}>
        <InputWithLabel
          id="name"
          label=" Name of Designation"
          variant="filled"
          bg="secondary.200"
          name="name"
          mb="5"
          register={register("name")}
          formErrorMessage={errors.name?.message}
        />
  {
    editLevel?
    <Box>

<FormControl mb="5">
            <FormLabel htmlFor="structure_level" fontSize="xs" fontWeight="semibold">
              Pick a Structure Level
            </FormLabel>
            <Select
              placeholder="Select Structure Level"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              id="structure_level"
              // value={}
              // {...register('level')}
              onChange={(e) => {
              setSelectedLevel(e.target.value)
             
              }}
            >
              <option value="corporate-level">Corporate</option>
              <option value="divisional-level">Division</option>
              <option value="group-level">Group</option>
              <option value="departmental-level">Department</option>
              <option value="unit-level">Unit</option>
            </Select>
          </FormControl>

          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontSize="xs" fontWeight="semibold">
              Level Name
            </FormLabel>
            <SelectAsyncPaginate
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
          key={selectedLevel}
          url={`/organization/setup/${selectedLevel}/list/${org_name}/?me=1`}
          value={currentCoprate}
          onChange={(value:any)=>{
            console.log(value)
            // setValue("level",value?.name)
            
            setValue("level",{
              name:value.name,
              organisation_short_name:value.organisation_short_name,
              uuid:value.uuid,
              slug:value.slug,
            })
          return   setCurrentCoprate(value)
          
          }}
          SelectLabel={(option:any)=>`${option.name}`}
          SelectValue={(option:any)=> {
            return `${option.uuid}`
          } }
          placeholder={""}
              
              />
            
            <Text fontSize="sm" color="crimson">
              {/* {errors.level.message} */}
            </Text>
          </FormControl>

    </Box>
    :
    <Text>
    {GetLevelName({
                 corporate_level:props?.corporate_level,
                 department:props?.department,
                 division:props?.division,
                 group:props?.group,
                 unit:props?.unit
               })}
    </Text>
  }
       
               <Button size='sm' onClick={handleEditLevel}>
                    {editLevel?<AiOutlineCloseCircle/>:<BsPencil/>} 
               </Button>

      </form>
    </DrawerBody>
    <DrawerFooter>
      <Button
        type="submit"
        form="add-perspective-form"
        variant="primary"
        w="full"
        size="sm"
        // fontSize="sm"
        isLoading={status === "loading"}
        loadingText="Updating Please Wait..."
      >
        Update Designation 
      </Button>
    </DrawerFooter>
  </>
  )



}



export default UpdateDesignation