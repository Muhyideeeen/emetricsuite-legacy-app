import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Select,
  Text,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../../InputWithLabel";
import axios from "../../../services/api";
import { selectGroup } from "../../../redux/group/groupSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import ReuseableSelectWithLabel from "../../ReuseableSelectWithLabel";

export interface DepartmentInputs {
  departmentName: string;
  organizationShortName: string;
  upline_name: string;
  upline_value: string;
}

const departmentSchema = yup.object().shape({
  departmentName: yup.string().required(),
  organizationShortName: yup.string().required(),
  upline_name: yup.string().required(),
  upline_value: yup.string(),
});

interface DepartmentSuccessPayload {
  status: number | null;
  message: string;
  data: {
    name: string;
    organization_short_name: string;
    uuid: string;
    slug: string;
    group?: {
      uuid: string;
      slug: string;
    } | null;
    corporate_level?: {
      uuid: string;
      slug: string;
    } | null;
  };
}

interface DepartmentErrorPayload {
  status: number | null;
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

const Department = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentInputs>({ resolver: yupResolver(departmentSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DepartmentSuccessPayload>({
    status: null,
    message: "",
    data: {
      name: "",
      organization_short_name: "",
      uuid: "",
      slug: "",
      group: null,
      corporate_level: null,
    },
  });

  const [error, setError] = useState<DepartmentErrorPayload>({
    status: null,
    message: "",
    errors: [
      {
        field: "",
        message: "",
      },
    ],
  });
  const toast = useToast();


  const {"status":groupStatus,groups}=useAppSelector(selectGroup);

  const onSubmit: SubmitHandler<DepartmentInputs> = async (data) => {
    setIsLoading(true);
    const postData = {
      name: data.departmentName,
      organisation_short_name: data.organizationShortName,
     'group': {
        name: data.upline_name,
        organisation_short_name: data.organizationShortName,
      },
    };
    console.log("Post data for department", postData);
    try {
      const response = await axios.post(
        "/organization/setup/departmental-level/create/",
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
    } catch (err:any) {
      console.error("Department error is", err.response.data);
  
      setIsLoading(false);
      setError(err.response.data);
    }
  };

  let current_organization_short_name = localStorage.getItem('current_organization_short_name');
  if(!current_organization_short_name){
    current_organization_short_name="Please You Need to Re-Login Somthing Went Wrong"
  }


  return (
    <Box as="form" mt={6} mx={20} onSubmit={handleSubmit(onSubmit)}>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>
        <InputWithLabel
          id="departmentName"
          label=" Department Name"
          size="lg"
          variant="filled"
          placeholder="Department Name"
          bg="secondary.200"
          register={register("departmentName", { required: true })}
          formErrorMessage={errors.departmentName?.message}
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
          register={register("organizationShortName", { required: true })}
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
            <option value="group">Group</option>
          </Select>
          <Text fontSize="sm" color="crimson">
            {errors.upline_value?.message}
          </Text>
        </FormControl> */}

      <ReuseableSelectWithLabel
          id="Group"
          label="Group"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          register={register("upline_name")}
          // corporates contains more than just corprate name so will map through and get jut the corprate names
          valueList={groups.map((data)=>data.name)}
          formErrorMessage={errors.upline_name?.message}
        />


        {/* <InputWithLabel
          id="upline_name"
          label="Upline Name"
          size="lg"
          variant="filled"
          placeholder="e.g John Doe"
          bg="secondary.200"
          register={register("upline_name", { required: true })}
          formErrorMessage={errors.upline_name?.message}
        />
      */}
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
          Setup Department
        </Button>
        <Button variant="secondary">Cancel</Button>
      </Grid>
    </Box>
  );
};

export default Department;
