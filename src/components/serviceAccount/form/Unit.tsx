import { useState } from "react";
import axios from "../../../services/api";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Button,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../../InputWithLabel";
import ReuseableSelectWithLabel from "../../ReuseableSelectWithLabel";
import { selectDepartment } from "../../../redux/department/departmentSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { getDepartments } from "../../../redux/department/departmentAPI";
import { useErrorHandler } from "react-error-boundary";
export interface UnitInputs {
  unitName: string;
  organizationShortName: string;
  upline_name: string;
  upline_value: string;
}

const unitSchema = yup.object().shape({
  unitName: yup.string().required(),
  organizationShortName: yup.string().required(),
  upline_name: yup.string().required(),
  upline_value: yup.string(),
});

interface UnitSuccessPayload {
  status: number | null;
  message: string;
  data: {
    name: string;
    organization_short_name: string;
    uuid: string;
    slug: string;
    department?: {
      uuid: string;
      slug: string;
    } | null;
    corporate_level?: {
      uuid: string;
      slug: string;
    } | null;
  };
}
interface UnitErrorPayload {
  status: number | null;
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

const Unit = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitInputs>({ resolver: yupResolver(unitSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UnitSuccessPayload>({
    status: null,
    message: "",
    data: {
      name: "",
      organization_short_name: "",
      uuid: "",
      slug: "",
      department: null,
      corporate_level: null,
    },
  });
  const [error, setError] = useState<UnitErrorPayload>({
    status: null,
    message: "",
    errors: [
      {
        field: "",
        message: "",
      },
    ],
  });
  const handleError = useErrorHandler();
  const {"status":DepartmentStatus,departments}= useAppSelector(selectDepartment);
  const dispatch = useAppDispatch()
  const toast = useToast();
  const onSubmit: SubmitHandler<UnitInputs> = async (data) => {
    setIsLoading(true);
    const postData = {
      name: data.unitName,
      organisation_short_name: data.organizationShortName,
     'department': {
        name: data.upline_name,
        organisation_short_name: data.organizationShortName,
      },
    };
    console.log("Unit Post Data", postData);

    try {
      const response = await axios.post(
        "/organization/setup/unit-level/create/",
        postData
      );
      setIsLoading(false);
      setData(response.data.data);
      toast({
        title: response.data.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
      reset();
    } catch (err: any) {
      console.error("Unit error is ", err.response.data);
      toast({
        title: err.response.data.errors[0].message,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      setError(err.response.data);
    }
  };


  let current_organization_short_name = localStorage.getItem('current_organization_short_name');
  if(!current_organization_short_name){
    current_organization_short_name="Please You Need to Re-Login Somthing Went Wrong"
  }

  useEffect(()=>{ 
    console.log({current_organization_short_name})
    if(!current_organization_short_name) return
    dispatch(getDepartments({"ORG_NAME":current_organization_short_name,"handleError":handleError}))
  },[])
  console.log(
    departments
  )
  return (
    <Box as="form" mt={6} mx={20} onSubmit={handleSubmit(onSubmit)}>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>
        <InputWithLabel
          id="unitName"
          label=" Unit Name"
          size="lg"
          variant="filled"
          placeholder="Unit Name"
          bg="secondary.200"
          register={register("unitName")}
          formErrorMessage={errors.unitName?.message}
        />
        <InputWithLabel
          id="organizationShortName"
          label="Organization Short Name"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          isReadOnly={true}
          value={current_organization_short_name}
          register={register("organizationShortName",)}
          formErrorMessage={errors.organizationShortName?.message}
        />
        {/* <FormControl>
          <FormLabel htmlFor="upline_value" fontWeight="semibold">
            Upline Value
          </FormLabel>
          <Select
            placeholder="Select Upline"
            variant="filled"
            bg="secondary.200"
            color="gray.400"
            size="lg"
            id="upline_value"
            {...register("upline_value")}
          >
            <option value="corporate_level">Corporate Level</option>
            <option value="department">Department</option>
          </Select>
          <Text fontSize="sm" color="crimson">
            {errors.upline_value?.message}
          </Text>
        </FormControl> */}
        {/* <InputWithLabel
          id="upline_name"
          label="Upline Name"
          size="lg"
          variant="filled"
          placeholder="e.g John Doe"
          bg="secondary.200"
          register={register("upline_name")}
          formErrorMessage={errors.upline_name?.message}
        /> */}
        <ReuseableSelectWithLabel
        id="Departments"
        label="Department"
        size="lg"
        variant="filled"
        placeholder=""
        bg="secondary.200"
        register={register("upline_name")}
        // corporates contains more than just corprate name so will map through and get jut the corprate names
        valueList={departments.map((data)=>data.name)}
        formErrorMessage={errors.upline_name?.message}
      />


      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8} mt={12}>
        <Button
          variant="primary"
          fontWeight="bold"
          w="full"
          type="submit"
          size="lg"
          isLoading={isLoading}
          loadingText="Setting Up..."
        >
          Setup Unit
        </Button>
        <Button variant="secondary">Cancel</Button>
      </Grid>
    </Box>
  );
};

export default Unit;
