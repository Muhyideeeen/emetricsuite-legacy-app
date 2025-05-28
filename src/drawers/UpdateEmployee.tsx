import { useState, useEffect } from "react";
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Skeleton,
  Text,
  useToast,
  Textarea,
  Box,
  Grid,
  IconButton,
  Input,Flex, Checkbox
} from "@chakra-ui/react";
import { v4 as uuid_v4 } from 'uuid';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useErrorHandler } from "react-error-boundary";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import InputWithLabel from "../components/InputWithLabel";
import { addNewEmployee ,EditEmployee} from "../redux/employees/employeesAPI";
import { selectEmployees, setEmployeeStateToIdle } from "../redux/employees/employeesSlice";
import { selectCorporate } from "../redux/corporate/corporateSlice";
import { selectDivision } from "../redux/division/divisionSlice";
import { selectGroup } from "../redux/group/groupSlice";
import { selectDepartment } from "../redux/department/departmentSlice";
import { selectUnit } from "../redux/unit/unitSlice";
import axios from "../services/api";
import { CareerPath } from "../redux/careerPath/careerPathAPI";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";

import {DesignationName,EducationDetails,AddEmployeeInputs,schema as EmployeYupSchema} from "./AddEmployee";
import moment from "moment";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import  {convertStringToDate,convertStringToValidDateString} from "../services/extraFunctions";
import EditableDateInputWithLabel from "../components/EditableDateInputWithLabel";
import CropImage from "../components/Crop/CropComponent";
const UpdateEmployee:React.FC<AddEmployeeInputs>=(props)=>{

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,getValues,watch,control
      } = useForm<AddEmployeeInputs>({ resolver: yupResolver(EmployeYupSchema) });
    
  const [education_details,setEducation_details] = useState<EducationDetails[]>(
    [ {
       institution: "",
       year: 2020,
       qualification: "",
     }]
   ) 
   const handleDeleteNewEducationList=(index:number)=>{
    const newList = [...education_details]
    newList.splice(index,1)
    setEducation_details(newList)
  }
  //this helps you updated a person profile without file stuff
  const [isUpdateGuarantorOneIdCard,setIsUpdateGuarantorOneIdCard] = useState(false)
  const [isUpdateGuarantorOnePassportCard,setIsUpdateGuarantorOnePassportCard] = useState(false)
  const [isUpdateGuarantorTwoIdCard,setIsUpdateGuarantorTwoIdCard] = useState(false)
  const [isUpdateGuarantorTwoPassportCard,setIsUpdateGuarantorTwoPassportCard] = useState(false)
 


  const [designationIsLoading, setDesignationIsLoading] = useState(false);
  const [careerPathsIsLoading, setcareerPathsIsLoading] = useState(true);
  const [designations, setDesignations] = useState<DesignationName[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedLevelNames, setSelectedLevelNames] = useState<
    { name: string; uuid: string }[]
  >([]);
  const handleError = useErrorHandler()
  const toast = useToast();

  const dispatch = useAppDispatch();
  const { status, message, errorMessage, employees } =useAppSelector(selectEmployees);
  const { corporates } = useAppSelector(selectCorporate);
  const { divisions } = useAppSelector(selectDivision);
  const { groups } = useAppSelector(selectGroup);
  const { departments } = useAppSelector(selectDepartment);
  const { units } = useAppSelector(selectUnit);
  let watchFields= watch(["role","date_of_birth",
"date_employed","level","level_id",'career_path_level',"designation_name"

  ],{
    //this string are just defualt string once the component mount we would be able to see the the orginal one
    "date_employed":'2020-11-21',
    "date_of_birth":'2020-11-21',
    // "career_path_level":
  })

  const fetchDesignationById = async (id: string) => {
    console.log("fetching now Designation");
    
    setDesignationIsLoading(true);
    try {
      const org_name = localStorage.getItem("current_organization_short_name");
      const response = await axios.get(
        `/client/${org_name}/designation/?search=${id}`
      );
      console.log(response);
      
      const data: { name: string }[] = response.data.data;
      const designationNames = data.map((designation) => designation.name);
      setDesignations(designationNames);
      setDesignationIsLoading(false);
    } catch (err: any) {
      console.error(err);
    }
  };


  const fetchCareerPaths = async () => {
    try {
      const org_name = localStorage.getItem("current_organization_short_name");
      const response = await axios.get(`/client/${org_name}/career-path`);
      setCareerPaths(response.data.data);
      console.log(response.data.data)
      setcareerPathsIsLoading(false);
    } catch (err: any) {
      setcareerPathsIsLoading(false);
      console.error(err);
    }
  };

  const handleLevelNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevelNameId = e.target.value;
    fetchDesignationById(selectedLevelNameId);
  };

  const orgLevels = {
    corporate_level: corporates,
    division: divisions,
    group: groups,
    department: departments,
    unit: units,
  };
  const levelField = register("level");
  const levelNameField = register("level_id");

  const onSubmit:SubmitHandler<AddEmployeeInputs> =(data)=>{
    data["employee_uuid"]=props?.employee_uuid
    console.log(
        {
          "from submit":data  
        }
    )
    const org_name = localStorage.getItem("current_organization_short_name");
    if (!org_name) return 
    dispatch(EditEmployee({data,org_name,handleError}))
  }
  const handleAddNewEducationList = ()=>{
    setEducation_details([
      ...education_details,
      {
        institution: "",
        year: 2020,
        qualification: "",
      }
    ])
  }
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevelValue = e.target.value;
      // @ts-ignore
    function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
      // @ts-ignore
      return key in obj;

    }

    if (!selectedLevelValue) {
      setSelectedLevelNames([]);
    } else if (hasKey(orgLevels, selectedLevelValue)) {
      const mappedSelectedLevelNames = orgLevels[selectedLevelValue].map(
        (selectedLevel) => ({
          name: selectedLevel.name,
          uuid: selectedLevel.uuid,
        })
      );
      setSelectedLevelNames(mappedSelectedLevelNames);
    }
  };
console.log({errorMessage})
  useEffect(()=>{
            console.log({
                "props":props
            })
            fetchCareerPaths();
            setValue("first_name",props.first_name)
            setValue("last_name",props.last_name)
            setValue("email",props.email)
            setValue("phone_number",props.phone_number)
            setValue("role",props.role)
            setValue("date_of_birth",props.date_of_birth)
            setValue("brief_description",props.brief_description)
            setValue("personal_email",props.personal_email)
            setValue("first_name",props.first_name)
            setValue("address",props.address)
            setValue("guarantor_one_first_name",props.guarantor_one_first_name)
            setValue("guarantor_one_last_name",props.guarantor_one_last_name)
            setValue("guarantor_one_address",props.guarantor_one_address)
            setValue("guarantor_one_occupation",props.guarantor_one_occupation)
            setValue("guarantor_one_age",props.guarantor_one_age)
            setValue("guarantor_two_age",props.guarantor_two_age)
            setValue("guarantor_one_id_card",null)
            setValue("guarantor_one_passport",null)
            setValue("guarantor_two_first_name",props.guarantor_two_first_name)
            setValue("guarantor_two_last_name",props.guarantor_two_last_name)
            setValue("guarantor_two_address",props.guarantor_two_address)
            setValue("guarantor_two_occupation",props.guarantor_two_occupation)
            setValue("guarantor_two_id_card",null)
            setValue("guarantor_two_passport",null)
            setValue("date_employed",props.date_employed)
            setValue("level",props.level)
            setValue("level_id",props.level_id)
            setValue("designation_name",props.designation_name)
            setValue("career_path_level",props.career_path_level)
            setValue("education_details",props.education_details)
          //  console.log(
          //   props.career_path_level
          //  )
  },[])

  useEffect(()=>{
    if(status==="updated"){
        toast({
            title:"Updated Successfully",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
        dispatch(setEmployeeStateToIdle({}))
    }
    if(status==='failed'){
      if(errorMessage){
        toast({
          title:errorMessage,
          status: 'error',
          position: "top",
          duration: 5000,
          isClosable: true,
      })
      dispatch(setEmployeeStateToIdle({}))

      }
     
    }
  },[status])

console.log({errors})
// console
return (

    <>
    {/* @ts-ignore */}
    <DrawerCloseButton />
    <DrawerHeader></DrawerHeader>
    <DrawerBody>
      <form id="add-employee-form" onSubmit={handleSubmit(onSubmit)}>
        <HStack mb="5" align="baseline">
          <InputWithLabel
            id="first_name"
            label="First Name"
            variant="filled"
            bg="secondary.200"
            name="first_name"
            register={register("first_name")}
            formErrorMessage={errors.first_name?.message}
          />

          <InputWithLabel
            id="last_name"
            label="Last Name"
            variant="filled"
            bg="secondary.200"
            name="last_name"
            register={register("last_name")}
            formErrorMessage={errors.last_name?.message}
          />
        </HStack>
        <HStack mb="5" align="baseline">
          <InputWithLabel
            id="email"
            label="Email"
            type="email"
            variant="filled"
            bg="secondary.200"
            name="email"
            register={register("email")}
            formErrorMessage={errors.email?.message}
          />
          <InputWithLabel
            id="personal_email"
            label="Personal Email"
            type="email"
            variant="filled"
            bg="secondary.200"
            name="personal_email"
            register={register("personal_email")}
            formErrorMessage={errors.personal_email?.message}
          />
        </HStack>
        <HStack>
          <InputWithLabel
            id="phone_number"
            label="Phone Number"
            variant="filled"
            placeholder="+23481056724"
            bg="secondary.200"
            name="phone_number"
            register={register("phone_number")}
            formErrorMessage={errors.phone_number?.message}
          />
          {/* <InputWithLabel
            id="date_of_birth"
            label="Date of Birth"
            type="date"
            variant="filled"
            bg="secondary.200"
            name="date_of_birth"
            // defualt
            register={register("date_of_birth")}
            formErrorMessage={errors.date_of_birth?.message}
          /> */}

          {/* <EditableDateInputWithLabel 
          name="date_of_birth"
          label="Date of Birth"
          id="date_of_birth"
          control={control}
          fieldName={"date_of_birth"}
          fieldValue={""}
          DefualtValue={watchFields[2]}

          /> */}

          <EditableDateInputWithLabel 
               name="date_of_birth"
               label="Date of Birth"
               setValue={setValue}
               fieldName={"date_of_birth"}
              id="date_of_birth"
              DefualtValue={watchFields[1]}
          />

        </HStack>
        <Box>
          <Text>Guarantor 1</Text>
          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="guarantor_one_first_name"
              label="First Name"
              name="guarantor_one_first_name"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_one_first_name")}
            formErrorMessage={errors.guarantor_one_first_name?.message}

            />
            <InputWithLabel
              id="guarantor_one_last_name"
              label="Last Name"
              name="guarantor_one_last_name"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_one_last_name")}
            formErrorMessage={errors.guarantor_one_last_name?.message}

            />              
          </HStack>



          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="guarantor_one_address"
              label="Guarantor One Address"
              name="guarantor_one_address"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_one_address")}
            formErrorMessage={errors.guarantor_one_address?.message}

            />
            <InputWithLabel
              id="guarantor_one_occupation"
              label="Guarantor One Occupation"
              name="Guarantor One Occupation"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_one_occupation")}
            formErrorMessage={errors.guarantor_one_occupation?.message}

            /> 

          </HStack>

          <Grid
    key={uuid_v4()}
    gridTemplateColumns="repeat(6, 1fr)"
    alignItems="end"
    columnGap="2"
    mb="3"
    >

          <InputWithLabel
            gridColumn={'span 2'}
              id="guarantor_one_age"
              label="Guarantor One Age"
              name="Guarantor One Age"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_one_age")}
            formErrorMessage={errors.guarantor_one_age?.message}

            />              
    </Grid>








          <HStack mb="5"  align="baseline">
           <FormControl id="somethingColl">
              <FormLabel fontSize="xs" htmlFor="somethingColl">
                    Upload guarantor One Id Card
              </FormLabel>
              {
                isUpdateGuarantorOneIdCard?
                <>
                  <CropImage 
                    setValue={setValue}
                    fieldName={'guarantor_one_id_card'}
                  />
                {/* @ts-ignore */}
                  <p style={{'color':'crimson'}}>{errors.guarantor_one_id_card?.message}</p>
                </>
                  :''
              }
              
            <Box>
              <Checkbox
              // isChecked=
              // checked={isUpdateGuarantorOneIdCard}
              onChange={(e)=>setIsUpdateGuarantorOneIdCard(!isUpdateGuarantorOneIdCard)} style={{'marginRight':'10px'}}/>
              update id card?
            </Box>
            </FormControl>
            

            <FormControl id="somethingColl2">
              <FormLabel fontSize="xs" htmlFor="somethingColl2">
                    Upload guarantor One Passport
              </FormLabel>
              {/* <Input type="file" 
                  {...register('guarantor_one_passport')}
                  variant="filled" bg="transparent" 
            formErrorMessage={errors.guarantor_one_passport?.message}
                  
                  /> */}

{
                isUpdateGuarantorOnePassportCard?
                <>
                  <CropImage 
                    setValue={setValue}
                    fieldName={'guarantor_one_passport'}
                  />
                {/* @ts-ignore */}
                  <p style={{'color':'crimson'}}>{errors.guarantor_one_passport?.message}</p>
                </>
                  :''
              }
               <Box>
              <Checkbox
              // isChecked=
              // checked={isUpdateGuarantorOneIdCard}
              onChange={(e)=>setIsUpdateGuarantorOnePassportCard(!isUpdateGuarantorOnePassportCard)} style={{'marginRight':'10px'}}/>
              update passport?
            </Box>
            </FormControl>
          </HStack>






        </Box>
        <Box>
          <Text>Guarantor 2</Text>
          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="guarantor_two_first_name"
              label="First Name"
              name="guarantor_two_first_name"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_two_first_name")}
            formErrorMessage={errors.guarantor_two_first_name?.message}

            />
            <InputWithLabel
              id="guarantor_two_last_name"
              label="Last Name"
              name="guarantor_two_last_name"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_two_last_name")}
            formErrorMessage={errors.guarantor_two_last_name?.message}

            />
          </HStack>

          
          <HStack mb="5"  align="baseline">
           <FormControl id="somethingColl4">
              <FormLabel fontSize="xs" htmlFor="somethingColl4">
                    Upload guarantor Two Id Card
              </FormLabel>
              {/* <Input type="file" 
                  {...register('guarantor_two_id_card')}
                  variant="filled" bg="transparent"
            formErrorMessage={errors.guarantor_two_id_card?.message}
                  
                  /> */}

{
                isUpdateGuarantorTwoIdCard?
                <>
                  <CropImage 
                    setValue={setValue}
                    fieldName={'guarantor_two_id_card'}
                  />
                {/* @ts-ignore */}
                  <p style={{'color':'crimson'}}>{errors.guarantor_two_id_card?.message}</p>
                </>
                  :''
              }
               <Box>
              <Checkbox
              // isChecked=
              // checked={isUpdateGuarantorOneIdCard}
              onChange={(e)=>setIsUpdateGuarantorTwoIdCard(!isUpdateGuarantorTwoIdCard)} style={{'marginRight':'10px'}}/>
              update id card?
            </Box>
            </FormControl>
            

            <FormControl id="somethingColl42">
              <FormLabel fontSize="xs" htmlFor="somethingColl42">
                    Upload guarantor Two Passport
              </FormLabel>
              {/* <Input type="file" 
                  {...register('guarantor_two_passport')}
                  variant="filled" bg="transparent" 
            formErrorMessage={errors.guarantor_two_passport?.message}
                  /> */}

{
                isUpdateGuarantorTwoPassportCard?
                <>
                  <CropImage 
                    setValue={setValue}
                    fieldName={'guarantor_two_passport'}
                  />
                {/* @ts-ignore */}
                  <p style={{'color':'crimson'}}>{errors.guarantor_two_passport?.message}</p>
                </>
                  :''
              }
               <Box>
              <Checkbox
              // isChecked=
              // checked={isUpdateGuarantorOneIdCard}
              onChange={(e)=>setIsUpdateGuarantorTwoPassportCard(!isUpdateGuarantorTwoPassportCard)} style={{'marginRight':'10px'}}/>
              update passport?
            </Box>
            </FormControl>
          </HStack>



          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="guarantor_two_address"
              label="Guarantor Two Address"
              name="guarantor_two_address"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_two_address")}
            formErrorMessage={errors.guarantor_two_address?.message}

            />
            <InputWithLabel
              id="guarantor_two_occupation"
              label="Guarantor Two Occupation"
              name="Guarantor Two Occupation"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_two_occupation")}
            formErrorMessage={errors.guarantor_two_occupation?.message}

            /> 

          </HStack>

          <Grid
    key={uuid_v4()}
    gridTemplateColumns="repeat(6, 1fr)"
    alignItems="end"
    columnGap="2"
    mb="3"
    >

          <InputWithLabel
            gridColumn={'span 2'}
              id="guarantor_two_age"
              label="Guarantor Two Age"
              name="Guarantor Two Age"
              variant="filled"
              bg="secondary.200"
              register={register("guarantor_two_age")}
            formErrorMessage={errors.guarantor_two_age?.message}

            />              
    </Grid>
        </Box>

  
  {
    education_details.map((education_details,index)=>(
    <>
          <Text>Education Detail</Text>

    <Grid
    key={uuid_v4()}
    gridTemplateColumns="repeat(6, 1fr)"
    alignItems="end"
    columnGap="2"
    mb="3"
    >

      <InputWithLabel 
      gridColumn={'span 4'}
      id={"education_details_qualification"}
      label={"Qualification"}
      variant={"filled"}
      // type="string"
      placeholder="Bsc."
      bg="secondary.200"
      register={
        register(`education_details.${index}.qualification`)
      }
      // formErrorMessage={errors?.education_details[index].qualification?.message}

      />

<InputWithLabel 
      gridColumn={'span 2'}
      id={"education_details_year"}
      label={"Year"}
      variant={"filled"}
      // type="string"
      placeholder="2020"
      bg="secondary.200"
      register={
        register(`education_details.${index}.year`)
      }
      />





      

    </Grid>
    
    <Grid
    key={uuid_v4()}
    gridTemplateColumns="repeat(6, 1fr)"
    alignItems="end"
    columnGap="2"
    mb="3"
    >


<InputWithLabel 
      gridColumn={'span 5'}
      id={"education_details_institution"}
      label={"Institution"}
      variant={"filled"}
      // type="string"
      placeholder="University Of Lagos"
      bg="secondary.200"
      register={
        register(`education_details.${index}.institution`)
      }
      />
      {
        index!==0 && (
          <IconButton 
          icon={<RiDeleteBinLine/>}
          aria-label="delete-eduction-details"
          onClick={()=>handleDeleteNewEducationList(index)}
          />
        )
      }
    </Grid >
    
  </>
    ))

  }
  <Button
    leftIcon={<RiAddLine />}
    mb="2"
    bg="secondary.200"
    variant="solid"
    onClick={handleAddNewEducationList}
>
      {/* add More Education Info */}
    Add More
    </Button>

        <InputWithLabel
          id="address"
          label="Address"
          name="address"
          variant="filled"
          bg="secondary.200"
          register={register("address")}
        />
        <HStack>
          <FormControl mb="5">
            <FormLabel htmlFor="structure_level" fontWeight="semibold">
              Structural Level
            </FormLabel>
            <Select
              placeholder={"Select Structural Level"}
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              size="lg"
              id="structure_level"
              value={watchFields[3]}
              {...levelField}
              onChange={(e) => {
                levelField.onChange(e);
                handleLevelChange(e);
              }}
            >
              <option value="corporate_level">Corporate</option>
              <option value="division">Division</option>
              <option value="group">Group</option>
              <option value="department">Department</option>
              <option value="unit">Unit</option>
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.level?.message}
              
            </Text>
          </FormControl>

          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontWeight="semibold">
              Structural Level Name
            </FormLabel>

            <Select
              placeholder={"Select Level Name"}
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              size="lg"
              id="level_id"
              {...levelNameField}
            //   value={getValues().level_id}
            // value={watchFields[3]}
              onChange={(e) => {
                // setValue("level",e.target.value)
                levelNameField.onChange(e);
                handleLevelNameChange(e);
              }}
            >
                {/* {props.level===watchFields[6]?
                <option>{props.level}</option>  :""  
            } */}
              {selectedLevelNames.map((selectedLevelName, idx) => {
                // console.log(watchFields[3]==selectedLevelName.name,'dd')
                return (
                  <option key={idx} 
                  // selected={watchFields[3]==selectedLevelName.name}
                  value={selectedLevelName.uuid}>
                    {selectedLevelName.name}
                  </option>
                );
              })}
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.level_id?.message}
            </Text>
          </FormControl>
        </HStack>
        <HStack align="baseline" mb="5">
          <FormControl>
            <FormLabel htmlFor="designation" fontWeight="semibold">
              Role
            </FormLabel>
            <Select
              placeholder="Select Role"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              size="lg"
              id="role"
              value={watchFields[0]}
              onChange={(e)=>{
                console.log(e.target.value,'dd')
                setValue("role",e.target.value==="team_lead"?"team_lead":"employee")
              }}
              // {...register("role")}
            >
              
              {/* <option selected value={props.role}>{props.role}</option> */}
              <option value="employee">Employee</option>
              <option value="team_lead">Team Lead</option>
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.role?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="designation" fontWeight="semibold">
              Designation
            </FormLabel>
            <Skeleton isLoaded={!designationIsLoading}>
              <Select
                placeholder={watchFields[6]}
                onChange={(e)=>{
                  setValue("designation_name",e.target.value)
                }}
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                size="lg"
                id="designation"
                // {...register("designation_name")}
              >
                  
                {designations.map((designation, index) => (
                  <>
                    <option key={index} value={designation}>
                      {designation}
                    </option>
                  </>
                ))}
              </Select>
            </Skeleton>
            <Text fontSize="sm" color="crimson">
              {errors.designation_name?.message}
            </Text>
          </FormControl>
        </HStack>

        <HStack mb="5" align="baseline">
          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontWeight="semibold">
              Career Path Level
            </FormLabel>

            <Skeleton isLoaded={!careerPathsIsLoading}>
              <Select
                placeholder={"Select Career Path Level"}
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                size="lg"
                id="level_id"
                // onChange={(e)=>{
                //   setValue("career_path_level",e.target.value)
                // }}
                {...register("career_path_level")}
              >
                  {/* {props.career_path_level===getValues().career_path_level} */}
                {careerPaths.map((careerPath, idx) => {
                  return (
                    <option selected={watchFields[5]==careerPath.level} key={idx} value={careerPath.level}>
                      {careerPath.name}
                    </option>
                  );
                })}
              </Select>
            </Skeleton>
            <Text fontSize="sm" color="crimson">
              {errors.level_id?.message}
            </Text>
          </FormControl>
          

           {/* <EditableDateInputWithLabel 
               name="date_of_employment"
               label="Date of Employment"
               setValue={setValue}
               fieldName={"date_employed"}
              id="date_employed"
              DefualtValue={watchFields[2]}
          /> */}
          <InputWithLabel
              id="date_of_employment"
              label="Date of Employment"
              type="date"
              variant="filled"
              bg="secondary.200"
              name="date_of_employment"
              register={register("date_employed")}
              formErrorMessage={errors.date_employed?.message}
            />

        <Text>
                {errors.date_employed?.message}
          </Text>         
        </HStack>
        <FormControl>
          <FormLabel htmlFor="brief_description" fontWeight="semibold">
            Short Bio
          </FormLabel>
          <Textarea
            bg="secondary.200"
            {...register("brief_description")}
          ></Textarea>
        </FormControl>
      </form>
    </DrawerBody>
    <DrawerFooter>
    <Button
        type="submit"
        form="add-employee-form"
        variant="primary"
        // w="full"
        isLoading={status==="updating"}
        loadingText="Updating..."
        width={'100%'}
        >
        Update Employee
      </Button>

     
    </DrawerFooter>
  </>
)
}





export default UpdateEmployee