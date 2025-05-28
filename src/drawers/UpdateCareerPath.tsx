import {  useEffect,useRef } from "react";
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import InputWithLabel from "../components/InputWithLabel";
import { useErrorHandler } from "react-error-boundary";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCareerPath,updateCareerPath } from "../redux/careerPath/careerPathAPI";
import { selectCareerPath } from "../redux/careerPath/careerPathSlice";

export interface CareerPathInputs {
  level: number;
  name: string;
  educational_qualification: string;
  years_of_experience_required: string;
  min_age: number;
  max_age: number;
  position_lifespan: number;
  slots_available: number;
  annual_package: number;
}

const schema = yup.object().shape({
  level: yup.number().required("Grade Level is required"),
  name: yup.string().required("Grade Level name is required"),
  educational_qualification: yup.string().required("Qualification is required"),
  years_of_experience_required: yup
    .number()
    .required("This field is required")
    .typeError("You must specify a number"),
  min_age: yup.number().required(),
  max_age: yup.number().required(),
  position_lifespan: yup.number().required(),
  slots_available: yup.number().required(),
  annual_package: yup.number().required(),
});

const UpdateCareerPath = (props:any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },setValue,
    reset,
  } = useForm<CareerPathInputs>({ resolver: yupResolver(schema) });
  const handleError = useErrorHandler()

  const { status, message, errorMessage } = useAppSelector(selectCareerPath);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const toastIdRef = useRef<any>();
  const id = 'test-toast'

  const onSubmit: SubmitHandler<CareerPathInputs> = (data) => {

    const dataToSubmit ={...data,handleError,uuid:props.career_path_id}
    console.log({
        dataToSubmit
    })
    // dispatch(addCareerPath(dataToSubmit));
    dispatch(updateCareerPath(dataToSubmit))
  };

  useEffect(() => {
    let cancel = false;
    if(cancel)return;
    if (status === "updated") {
      if(message){

        toast({id,
          title: "Update Successful",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }
      reset();
    }

    return () => { 
      cancel = true;
    }
  }, [status]);

  useEffect(()=>{
    setValue("name",props?.name)
    setValue("level",props?.level)
    setValue("educational_qualification",props?.educational_qualification)
    setValue("years_of_experience_required",props?.years_of_experience_required)
    setValue("min_age",props?.min_age)
    setValue("max_age",props?.max_age)
    setValue("position_lifespan",props?.position_lifespan)
    setValue("slots_available",props?.slots_available)
    setValue("annual_package",props?.annual_package)

  },[])
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>Add Career Path Level</DrawerHeader>
      <DrawerBody>
        <form id="add-careerpath-form" onSubmit={handleSubmit(onSubmit)}>
          <HStack mb="5">
            <InputWithLabel
              id="name"
              label="Name of Grade Level"
              variant="filled"
              bg="secondary.200"
              name="name"
              register={register("name")}
              formErrorMessage={errors.name?.message}
            />
          </HStack>
          <HStack mb="5">
            <InputWithLabel
              id="level"
              label="Grade Level Number"
              variant="filled"
              bg="secondary.200"
              name="level"
              register={register("level")}
              formErrorMessage={errors.level?.message}
            />
          </HStack>
          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="educational_qualification"
              label="Educational Qualification"
              variant="filled"
              bg="secondary.200"
              name="last_name"
              register={register("educational_qualification")}
              formErrorMessage={errors.educational_qualification?.message}
            />
          </HStack>
          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="min_age"
              label="Min Age"
              variant="filled"
              type="number"
              placeholder="e.g 23"
              bg="secondary.200"
              name="min_age"
              register={register("min_age")}
              formErrorMessage={errors.min_age?.message}
            />
            <InputWithLabel
              id="max_age"
              label="Max Age"
              variant="filled"
              type="number"
              placeholder="e.g 23"
              bg="secondary.200"
              name="max_age"
              register={register("max_age")}
              formErrorMessage={errors.max_age?.message}
            />
          </HStack>

          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="position_lifespan"
              label="Position Lifespan"
              variant="filled"
              type="number"
              bg="secondary.200"
              name="position_lifespan"
              register={register("position_lifespan")}
              formErrorMessage={errors.position_lifespan?.message}
            />
            <InputWithLabel
              id="slots_available"
              label="Slots Available"
              variant="filled"
              type="number"
              bg="secondary.200"
              name="slots_available"
              register={register("slots_available")}
              formErrorMessage={errors.slots_available?.message}
            />
          </HStack>
          <HStack mb="5" align="baseline">
            <InputWithLabel
              id="years_of_experience_required"
              label="Years of Experience Required"
              type="number"
              variant="filled"
              bg="secondary.200"
              name="email"
              register={register("years_of_experience_required")}
              formErrorMessage={errors.years_of_experience_required?.message}
            />
            <InputWithLabel
              id="annual_package"
              label="Annual Package"
              type="number"
              variant="filled"
              bg="secondary.200"
              name="email"
              register={register("annual_package")}
              formErrorMessage={errors.annual_package?.message}
            />
          </HStack>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button
          type="submit"
          form="add-careerpath-form"
          variant="primary"
          w="full"
          isLoading={status === "loading"}
          loadingText="Adding..."
        >
          Update Career Path
        </Button>
      </DrawerFooter>
    </>
  );
};

export default UpdateCareerPath;
