import { useEffect, useState } from "react";
import { Box, Grid, Button, useToast } from "@chakra-ui/react";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import InputWithLabel from "../../InputWithLabel";
import { setupDivision } from "../../../redux/division/divisionAPI";
import { selectDivision } from "../../../redux/division/divisionSlice";
import { selectCorporate } from "../../../redux/corporate/corporateSlice";
import ReuseableSelectWithLabel from "../../ReuseableSelectWithLabel";
import { useErrorHandler } from "react-error-boundary";
export interface DivisionInputs {
  divisionName: string;
  organizationShortName: string;
  corporate: string;
}

const divisionSchema = yup.object().shape({
  divisionName: yup.string().required(),
  organizationShortName: yup.string().required(),
  corporate: yup.string().required(),
});
const Divisions = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DivisionInputs>({ resolver: yupResolver(divisionSchema) });
  const toast = useToast();
  const dispatch = useAppDispatch();
  const {"status":corporateStatus,corporates} =  useAppSelector(selectCorporate)
  const handleError = useErrorHandler()
  // console.log("From Marko Seeing Corporate",corporateStatus,corporates)

  const { status, message, errorMessage } =
    useAppSelector(selectDivision);

  

  const onSubmit: SubmitHandler<DivisionInputs> = (data) => {
    console.log("Division data", data);
   
    const newData  = {...data,handleError}
    dispatch(setupDivision(newData));
  };
  useEffect(() => {

    if (status === "succeeded" && message) {
      toast({
        title: message,
        status: "success",
        position: "top",
        duration: 5000,
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
  const isSubmitting = () => status === "loading";

  let current_organization_short_name = localStorage.getItem('current_organization_short_name');
  if(!current_organization_short_name){
    current_organization_short_name="Please You Need to Re-Login Somthing Went Wrong"
  }


  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={6} mx={20}>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>
        <InputWithLabel
          id="divisionName"
          label="Division Name"
          size="lg"
          variant="filled"
          placeholder="Division 1"
          bg="secondary.200"
          register={register("divisionName")}
          formErrorMessage={errors.divisionName?.message}
        />
        <InputWithLabel
          id="organizationShortName"
          label="Organization Short Name"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          // isDisabled={true}
          isReadOnly={true}
          value={current_organization_short_name}
          register={register("organizationShortName")}
          formErrorMessage={errors.organizationShortName?.message}
        />
        <ReuseableSelectWithLabel
          id="corporate"
          label="Corporate Level"
          size="lg"
          variant="filled"
          placeholder=""
          bg="secondary.200"
          register={register("corporate")}
          // corporates contains more than just corprate name so will map through and get jut the corprate names
          valueList={corporates.map((data)=>data.name)}
          formErrorMessage={errors.corporate?.message}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8} mt={12}>
        <Button
          variant="primary"
          fontWeight="bold"
          w="full"
          type="submit"
          size="lg"
          isLoading={isSubmitting()}
          loadingText="Setting Up..."
        >
          Setup Division
        </Button>
        <Button variant="secondary" type="button">
          Cancel
        </Button>
      </Grid>
    </Box>
  );
};

export default Divisions;
