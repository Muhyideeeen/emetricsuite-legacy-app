import { useEffect, useState } from "react";
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  FormControl,
  FormLabel,
  Text,
  Select,
  useToast,
} from "@chakra-ui/react";

import axios from "../services/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuid_v4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import InputWithLabel from "../components/InputWithLabel";
import { selectJobDescription } from "../redux/jobDescription/jobDescriptionSlice";
import { createJobDescription } from "../redux/jobDescription/jobDescriptionAPI";
import { Designation } from "../redux/designation/DesignationAPI";
import ListService from "../services/list.service";

export interface JobDescriptionInputs {
  description: string;
  team: {
    name: string;
  };
  designation: {
    name: string;
  };
  grade_level: string[];
  upline?: string | null;
  level: number;
  target_point: number;
}

const schema = yup.object().shape({
  description: yup.string().required("Job Description is required"),
  team: yup.object().shape({
    name: yup.string().required("Team Name is required"),
  }),
  designation: yup.object().shape({
    name: yup.string().required("Designation Name is required"),
  }),
  grade_level: yup.array().of(yup.string().required("Grade Level is required")),
  target_point: yup.number().required("Target point is required"),
});

const AddJD = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<JobDescriptionInputs>({ resolver: yupResolver(schema) });

  const dispatch = useAppDispatch();
  const toast = useToast();
  const { status, message, errorMessage } =
    useAppSelector(selectJobDescription);

  const [isLoading, setIsLoading] = useState(false);
  // const [units, setUnits] = useState<Unit[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);


  const onSubmit: SubmitHandler<JobDescriptionInputs> = (data) => {
    // if an upline wasn't chosen, remove it from the sent data
    if (!data.upline) {
      const { upline, ...newData } = data;
      dispatch(createJobDescription(newData))
    } else {
      dispatch(createJobDescription(data));
    }
  };

  useEffect(() => {
    const org_name = localStorage.getItem("current_organization");
    
  }, []);
  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: message,
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      reset();
    }
    if (status === "failed") {
      toast({
        title: errorMessage,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status]);
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>Add Job Description</DrawerHeader>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <DrawerBody>
            <form id="add-jd-form" onSubmit={handleSubmit(onSubmit)}>
              <InputWithLabel
                id="description"
                label="Job Description"
                variant="filled"
                bg="secondary.200"
                name="description"
                register={register("description")}
                formErrorMessage={errors.description?.message}
                mb="5"
              />
              <FormControl mb="5">
                <FormLabel htmlFor="designation" fontWeight="semibold">
                  Designation
                </FormLabel>
                <Select
                  placeholder="Select Designation"
                  variant="filled"
                  bg="secondary.200"
                  color="gray.400"
                  size="lg"
                  id="designation"
                  {...register("designation.name")}
                >
                  {designations.map((designation, index) => (
                    <option key={uuid_v4()} value={designation.name}>
                      {designation.name}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="crimson">
                  {errors.designation?.name?.message}
                </Text>
              </FormControl>

              <InputWithLabel
                id="upline"
                label="Upline"
                variant="filled"
                bg="secondary.200"
                name="upline"
                register={register("upline")}
                formErrorMessage={errors.upline?.message}
                mb="5"
              />

              <InputWithLabel
                id="target_point"
                label="Target Point"
                variant="filled"
                bg="secondary.200"
                name="target_point"
                type="number"
                register={register("target_point")}
                formErrorMessage={errors.target_point?.message}
              />
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              type="submit"
              form="add-jd-form"
              variant="primary"
              w="full"
              isLoading={status === "loading"}
              loadingText="Adding..."
            >
              Add Job Description
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
  );
};

export default AddJD;
