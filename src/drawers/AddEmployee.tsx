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
  Input,
} from "@chakra-ui/react";
import { v4 as uuid_v4 } from 'uuid';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useErrorHandler } from "react-error-boundary";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import InputWithLabel from "../components/InputWithLabel";
import { addNewEmployee } from "../redux/employees/employeesAPI";
import { selectEmployees } from "../redux/employees/employeesSlice";
import { selectCorporate } from "../redux/corporate/corporateSlice";
import { selectDivision } from "../redux/division/divisionSlice";
import { selectGroup } from "../redux/group/groupSlice";
import { selectDepartment } from "../redux/department/departmentSlice";
import { selectUnit } from "../redux/unit/unitSlice";
import axios from "../services/api";
import { CareerPath } from "../redux/careerPath/careerPathAPI";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import SelectAsyncPaginate from "../components/AsyncSelect"
import CropImage from "../components/Crop/CropComponent";

// contact_information[guarantor_one_id_card]
// contact_information[guarantor_one_passport]


// contact_information[guarantor_two_id_card]
// contact_information[guarantor_two_passport]

export type DesignationName = string;
export interface EducationDetails{
    institution: string;
    year: number;
    qualification: string;
    
  }
  export interface AddEmployeeInputs {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: "employee" | "team_lead"|'Exco_or_Management'|'Committee_Member'|'Committee_Chair';
    date_of_birth: string;
    brief_description: string;
    personal_email: string;
    address: string;
    guarantor_one_first_name: string;
    guarantor_one_last_name: string;
    guarantor_one_address:string;
    guarantor_one_occupation:string;
    guarantor_one_age:number;
    "guarantor_one_id_card":any;
    "guarantor_one_passport":any;

    profile_picture?:any;
    guarantor_two_first_name: string;
    guarantor_two_last_name: string;
    guarantor_two_address:string;
    guarantor_two_occupation:string;
    guarantor_two_age:number;
    "guarantor_two_id_card":any;
    "guarantor_two_passport":any;
    date_employed: string;
  level: string;
  level_id: string;
  designation_name: string;
  career_path_level: string;
  
  education_details:EducationDetails[];
  
  employee_uuid?:string;
  status?:string;
}
export const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  phone_number: yup.string().required("Phone Number is required"),
  role: yup.string().required("Role is required"),
  date_of_birth: yup.string().required(),
  brief_description: yup.string().required(),
  personal_email: yup.string().required(),
  address: yup.string().required(),
  guarantor_one_first_name: yup.string().required(),
  guarantor_one_last_name: yup.string().required(),
  "guarantor_one_id_card":yup.mixed(),
  "guarantor_one_passport":yup.mixed(),

  guarantor_one_address:yup.string().required(),
  guarantor_one_occupation:yup.string().required(),
  guarantor_one_age:yup.number().required(),



  guarantor_two_first_name: yup.string().required(),
  guarantor_two_last_name: yup.string().required(),
  "guarantor_two_id_card":yup.mixed(),
  "guarantor_two_passport":yup.mixed(),
  guarantor_two_address:yup.string().required(),
  guarantor_two_occupation:yup.string().required(),
  guarantor_two_age:yup.number().required(),

  date_employed: yup.string().required(),
  level: yup.string().required(),
  level_id: yup.string().required(),
  designation_name: yup.string().required("Designation is required"),
  education_details:yup.array().of(
    yup.object().shape({
      institution: yup.string().required(),
       year:  yup.number().required(),
        qualification: yup.string().required()
      })),
      employee_uuid:yup.string()


});

interface Unit {}

const AddEmployee = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,setValue
  } = useForm<AddEmployeeInputs>({ resolver: yupResolver(schema) });

  const [education_details,setEducation_details] = useState<EducationDetails[]>(
   [ {
      institution: "",
      year: 2020,
      qualification: "",
    }]
  ) 
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

  const handleDeleteNewEducationList=(index:number)=>{
    const newList = [...education_details]
    newList.splice(index,1)
    setEducation_details(newList)
  }
 
 
 
 
  const [designationIsLoading, setDesignationIsLoading] = useState(false);
  const [careerPathsIsLoading, setcareerPathsIsLoading] = useState(true);
  const [designations, setDesignations] = useState<DesignationName[]>([]);
  const [careerPaths, setCareerPaths] = useState<null|CareerPath>(null);
  const [selectedLevelNames, setSelectedLevelNames] = useState<
    { name: string; uuid: string }[]
  >([]);
  const handleError = useErrorHandler()

  const toast = useToast();

  const dispatch = useAppDispatch();
  const { status, message, errorMessage, employees } =
    useAppSelector(selectEmployees);
  const { corporates } = useAppSelector(selectCorporate);
  const { divisions } = useAppSelector(selectDivision);
  const { groups } = useAppSelector(selectGroup);
  const { departments } = useAppSelector(selectDepartment);
  const { units } = useAppSelector(selectUnit);
  const [currentlySelectedStructure,setCurrentlySelectedStructure]=useState<any>(null);
  const org_name = localStorage.getItem("current_organization_short_name");  
  const [currentLevel,setCurrentLevel]=useState<any>()
  const [currentDesignation,setCurrentDesignation]=useState<any>()
 
  const orgLevels = {
    corporate_level: corporates,
    division: divisions,
    group: groups,
    department: departments,
    unit: units,
  };

  const levelField = register("level");
  const levelNameField = register("level_id");

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevelValue = e.target.value;
    setCurrentlySelectedStructure(selectedLevelValue)
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

  const onSubmit: SubmitHandler<AddEmployeeInputs> = (data) => {
    const org_name = localStorage.getItem("current_organization_short_name");

    if (org_name) {
      
      dispatch(addNewEmployee({data, org_name ,handleError}));
      console.log({'new employee':data})
    }
  };

  useEffect(() => {
    fetchCareerPaths();
    setValue("employee_uuid","setting this because it trouble in AddEmployee and we dont need it but we need it in Update Employee so leave it")
  }, []);

  useEffect(() => {
    if (status === "succeeded") {
      if(message){

        toast({
          title: message,
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
      reset();
    }
    if (status === "failed") {
      // let failedMessage ;
      // // console.log(errorme)
      // try{
      // failedMessage =errorMessage.errors[0].message

      // }catch{
      //   failedMessage = errorMessage.message
      // }
if(errorMessage){
  toast({
    title: errorMessage, 
    status: "error",
    position: "top",
    duration: 5000,
    isClosable: true,
  });
}
    }
    // console.log("Checking errorMessage from Employe",errorMessage)
   
  }, [status]);


  console.log(errors)
  return (
    <>
      {/* @ts-ignore */}
      <DrawerCloseButton />
      <DrawerHeader>Add New Employee</DrawerHeader>
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
            <InputWithLabel
              id="date_of_birth"
              label="Date of Birth"
              type="date"
              variant="filled"
              bg="secondary.200"
              name="date_of_birth"
              register={register("date_of_birth")}
              formErrorMessage={errors.date_of_birth?.message}
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
                <CropImage setValue={setValue} fieldName={'guarantor_one_id_card'}/>
                {/* @ts-ignore */}
                <p style={{'color':'crimson'}}>{errors?.guarantor_one_id_card?.message}</p>
                {/* <Input type="file" 
                    {...register('guarantor_one_id_card')}
                    variant="filled" bg="transparent"
              formErrorMessage={errors.guarantor_one_id_card?.message}
                    /> */}
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
                    <CropImage setValue={setValue} fieldName={'guarantor_one_passport'}/>
                {/* @ts-ignore */}
                <p style={{'color':'crimson'}}>{errors.guarantor_one_passport?.message}</p>
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
                {/* @ts-ignore */}
                     <CropImage setValue={setValue} fieldName={'guarantor_two_id_card'}/>
                {/* @ts-ignore */}
                <p style={{'color':'crimson'}}>{errors.guarantor_two_id_card?.message}</p>
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
                {/* @ts-ignore */}
                        <CropImage setValue={setValue} fieldName={'guarantor_two_passport'}/>
                {/* @ts-ignore */}
                <p style={{'color':'crimson'}}>{errors.guarantor_two_passport?.message}</p>
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
                placeholder="Select Structural Level"
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                size="lg"
                id="structure_level"
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
              <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              key={currentlySelectedStructure}
              url={`/organization/setup/${currentlySelectedStructure=="corporate_level"
              ?"corporate-level":(currentlySelectedStructure=="division")?"divisional-level":
              (currentlySelectedStructure=="group")?"group-level":
              (currentlySelectedStructure=="department")?"departmental-level":"unit-level"
            }/list/${org_name}/?me=1`}
              value={currentLevel}
              onChange={(value)=>{
                // setValue("level",value?.name)
                setValue("level_id",value?.uuid)
                 setCurrentLevel(value)
                 return value
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
                size="lg"
                id="level_id"
                {...levelNameField}
                onChange={(e) => {
                  levelNameField.onChange(e);
                  handleLevelNameChange(e);
                }}
              >
                {selectedLevelNames.map((selectedLevelName, idx) => {
                  return (
                    <option key={idx} value={selectedLevelName.uuid}>
                      {selectedLevelName.name}
                    </option>
                  );
                })}
              </Select> */}
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
                {...register("role")}
              >
                <option value="employee">Employee</option>
                <option value="team_lead">Team Lead</option>

                <option value="Exco_or_Management">Exco/Management</option>
                <option value="Committee_Member">Committee Member</option>
                <option value="Committee_Chair">Committee Chair</option>
              </Select>
              <Text fontSize="sm" color="crimson">
                {errors.role?.message}
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="designation" fontWeight="semibold">
                Designation
              </FormLabel>
              {/* `/client/${org_name}/designation/?search=${id}` */}


              <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              key={currentLevel?.uuid+2}
              url={`/client/${org_name}/designation/?search=${currentLevel?.uuid}`}
              value={currentDesignation}
              onChange={(value)=>{
                console.log("designationValue",value)
                setValue("designation_name",value?.name)
              return   setCurrentDesignation(value)
              // return value
              
              }}
              SelectLabel={(option:any)=>`${option.name}`}
              SelectValue={(option:any)=> {
                return `${option.uuid}`
              } }
              placeholder={""}
              
              />
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
              {/* /client/${org_name}/career-path */}
              <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              // key={currentlySelectedStructure}
              url={`/client/${org_name}/career-path?me=1`}
              value={careerPaths}
              onChange={(value)=>{
                console.log("setCareerPaths",value)
                setValue("career_path_level",value?.level)
                setCareerPaths(value)
                 return value
              }}
              SelectLabel={(option:any)=>`${option.name}`}
              SelectValue={(option:any)=> {
                return `${option.level}`
              } }
              placeholder={""}
              
              />
              
              {/* <Skeleton isLoaded={!careerPathsIsLoading}>
                <Select
                  placeholder="Select Career Path Level"
                  variant="filled"
                  bg="secondary.200"
                  color="gray.400"
                  size="lg"
                  id="level_id"
                  {...register("career_path_level")}
                >
                  {careerPaths.map((careerPath, idx) => {
                    return (
                      <option key={idx} value={careerPath.level}>
                        {careerPath.name}
                      </option>
                    );
                  })}
                </Select>
              </Skeleton> */}
              <Text fontSize="sm" color="crimson">
                {errors.level_id?.message}
              </Text>
            </FormControl>
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
          w="full"
          isLoading={status === "loading"}
          loadingText="Adding..."
        >
          Add Employee
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddEmployee;
