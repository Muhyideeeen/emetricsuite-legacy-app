import { useState } from "react";
import axios from "../../../services/api";
import {
  Box,
  Grid,
  Button,
  Text,
  Select,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../../InputWithLabel";
import ReuseableSelectWithLabel from "../../ReuseableSelectWithLabel";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectDivision } from "../../../redux/division/divisionSlice";

export interface GroupInputs {
  groupName: string;
  organizationShortName: string;
  upline_name: string;
  upline_value: string;
}

const groupSchema = yup.object().shape({
  groupName: yup.string().required(),
  organizationShortName: yup.string().required(),
  upline_name: yup.string().required(),
  upline_value: yup.string(),
});

interface GroupSuccessPayload {
  status: number | null;
  message: string;
  data: {
    name: string;
    organization_short_name: string;
    uuid: string;
    slug: string;
    division?: {
      uuid: string;
      slug: string;
    } | null;
    corporate_level?: {
      uuid: string;
      slug: string;
    } | null;
  };
}
interface GroupErrorPayload {
  status: number | null;
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

const Group = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupInputs>({ resolver: yupResolver(groupSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GroupSuccessPayload>({
    status: null,
    message: "",
    data: {
      name: "",
      organization_short_name: "",
      uuid: "",
      slug: "",
      division: null,
      corporate_level: null,
    },
  });
  const [error, setError] = useState<GroupErrorPayload>({
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

  const {"status":DivisionStatus,divisions} =  useAppSelector(selectDivision)
  // console.log(divisions)

  const onSubmit: SubmitHandler<GroupInputs> = async (data) => {
    // setIsLoading(true);
    // the commmented one is the dynamic one that is working but the backemnd is not ready for it
    // const postData = {
    //   name: data.groupName,
    //   organisation_short_name: data.organizationShortName,
    //   [data.upline_value]: {
    //     name: data.upline_name,
    //     organisation_short_name: data.organizationShortName,
    //   },
    // };
    const postData = {
      name: data.groupName,
      organisation_short_name: data.organizationShortName,
      'division': {
        name: data.upline_name,
        organisation_short_name: data.organizationShortName,
      },
    };
// console.log(data)

    try {
      const response = await axios.post(
        "/organization/setup/group-level/create/",
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
      console.error("Group error is ", err.response.data);
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
  
   
  }
    

  let current_organization_short_name = localStorage.getItem('current_organization_short_name');
  if(!current_organization_short_name){
    current_organization_short_name="Please You Need to Re-Login Somthing Went Wrong"
  }

  return (
    <Box as="form" mt={6} mx={20} onSubmit={handleSubmit(onSubmit)}>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>
        <InputWithLabel
          id="groupName"
          label="Group Name"
          size="lg"
          variant="filled"
          placeholder="Group name"
          bg="secondary.200"
          register={register("groupName", { required: true })}
          formErrorMessage={errors.groupName?.message}
        />
        <InputWithLabel
          id="organizationShortName"
          label="Organization Short Name"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          value={current_organization_short_name}
          isReadOnly={true}
          register={register("organizationShortName")}
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
            <option value="division">Division</option>
          </Select>
          <Text fontSize="sm" color="crimson">
            {errors.upline_value?.message}
          </Text>
        </FormControl> */}

        <ReuseableSelectWithLabel
          id="division"
          label="Divisions"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          register={register("upline_name")}
          // corporates contains more than just corprate name so will map through and get jut the corprate names
          valueList={divisions.map((data)=>data.name)}
          formErrorMessage={errors.upline_name?.message}
        />


        {/* <InputWithLabel
          id="upline"
          label="Upline Name"
          size="lg"
          variant="filled"
          placeholder="e.g John Doe"
          bg="secondary.200"
          register={register("upline_name", { required: true })}
          formErrorMessage={errors.upline_name?.message}
        /> */}
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
          Setup Group
        </Button>
      </Grid>
    </Box>
  );
};

export default Group;
