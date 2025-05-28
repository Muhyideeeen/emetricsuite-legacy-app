import { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,FormControl,Input,
  useToast,
    Grid,
    
    Checkbox, CheckboxGroup,FormLabel,HStack,Text
} from "@chakra-ui/react";
import InputWithLabel from "../../components/InputWithLabel";
import DateInputWithLabel from "../../components/DateInputWithLabel";

import SelectWithLabel from "../../components/selectWithLabels";
import { useHistory } from 'react-router-dom'

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { createOrganization } from "../../redux/organization/organizationAPI";
import { selectOrganization } from "../../redux/organization/organizationSlice";

export interface CreateOrganizationInputs {
  organisation_short_name: string;
  organisation_name: string;
  timezone:string;
  monday:any;
  tuesday:any;
  wednesday:any;
  thursday:any;
  friday:any;
  saturday:any;
  sunday:any;
  work_days:number[];
  work_start_time:string;
  work_stop_time:string;
  organisation_logo:any;


    work_break_start_time:string;
  work_break_stop_time:string;
}

export const schema = yup.object().shape({
  organisation_short_name: yup.string().required("Organisation Short Name is required"),
  organisation_name: yup.string().required("Organisation Name is required"),
  timezone:yup.string().required("Time Zone is required"),
  work_start_time:yup.string().required('Daily Resumption Time is required'),
  work_stop_time:yup.string().required('Daily Close/End Time is required'),


    work_break_start_time:yup.string().required('Daily Break Time is required'),
  work_break_stop_time:yup.string().required('Daily Breack Close/End Time is required'),
  organisation_logo:yup.mixed(),
  // check:any
    monday:yup.boolean(),
  tuesday:yup.boolean(),
  wednesday:yup.boolean(),
  thursday:yup.boolean(),
  friday:yup.boolean(),
  saturday:yup.boolean(),
  sunday:yup.boolean(),
}).test(
    'myCustomTest',
    "",
    (obj) => {
      // here is the validation we testing at least one check (Days of the week)Box Should Be Choosen
      let counter=0;
      if ( obj.monday ) {
        // if it true increment Countey by One
          counter+=1
      }
      
      if ( obj.tuesday ) {
        // if it true increment Countey by One
          counter+=1
      }
      if ( obj.wednesday ) {
        // if it true increment Countey by One
          counter+=1
      }
      if ( obj.thursday ) {
        // if it true increment Countey by One
          counter+=1
      }
      if ( obj.friday ) {
        // if it true increment Countey by One
          counter+=1
      }

            if ( obj.saturday ) {
        // if it true increment Countey by One
          counter+=1
      }

          if ( obj.sunday ) {
        // if it true increment Countey by One
          counter+=1
      }


    if(counter>=1){return true}

      return new yup.ValidationError(
        'Please check one checkbox',
        null,
        'monday'
      );
    }
  );
const CreateOrganization = () => {
  const {
    register,
    handleSubmit,control,setValue,
    formState: { errors },
  } = useForm<CreateOrganizationInputs>({ resolver: yupResolver(schema) });

  const dispatch = useAppDispatch();
  const { status, message, errorMessage } = useAppSelector(selectOrganization);
  const toast = useToast();
  const history = useHistory();

  const onSubmit: SubmitHandler<CreateOrganizationInputs> = (data) => {
    // what i did below is i rote logic that will convert the selected days of the week to number

    data.work_days=[]
    if(data.monday){
        data.work_days.push(0)
    }

    if(data.tuesday){
        data.work_days.push(1)
    }

        if(data.wednesday){
        data.work_days.push(2)
    }

    if(data.thursday){
        data.work_days.push(3)
    }
        if(data.friday){
        data.work_days.push(4)
    }


    if(data.saturday){
        data.work_days.push(5)
    }

   if(data.sunday){
        data.work_days.push(5)
    }

    delete data['monday']
    delete data['tuesday']
    delete data['wednesday']
    delete data['thursday']
    delete data['friday']
    delete data['saturday']
    delete data['sunday']
    console.log(data)
    
  

    dispatch(createOrganization(data));
  };
  const isSubmitting = () => {
    return status === "loading";
  };

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
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

  if (status === 'succeeded') {

    toast({
      title: "Your Organization has been created Please Login to Procceed",
      status: "success",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
    // history.push('/admin/organization-structure');
    history.push('/admin/login');

  }
  return (
    <Flex minH="100vh" w="100vw" overflowY="hidden">
      <Flex bg="white" flex={4} align="center" justifyContent="center">
          <Box mx="auto">
            <Heading as="h1" color="primary" size="xl" mb="10" fontWeight={900}>
              Create an Organization
            </Heading>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid
              gridTemplateColumns="1fr 1fr"
                columnGap={4}
                rowGap={8}
                mb="10"
              >
                {/* organizationShortName */}
                <InputWithLabel
                  id="organizationShortName"
                  label="Organization Short Name"
                  size="lg"
                  variant="filled"
                  placeholder="e.g UAC"
                  bg="secondary.200"
                  name="organisation_short_name"
                  register={register("organisation_short_name")}
                  formErrorMessage={errors.organisation_short_name?.message}
                />
                <InputWithLabel
                  id="organizationName"
                  label="Organization Name"
                  size="lg"
                  variant="filled"
                  placeholder="e.g Godwin"
                  bg="secondary.200"
                  name="organisation_name"
                  register={register("organisation_name")}
                  formErrorMessage={errors.organisation_name?.message}
                />

                  <SelectWithLabel
                  Name='timezone'
                  id="timeZone"
                  label="Time Zone"
                  size="lg"
                  variant="filled"
                  placeholder="e.g Africa/Lagos"
                  bg="secondary.200"
                  setvalue={setValue}
                  // name="timezone"
                  // register={register("timezone")}
                  formErrorMessage={errors.timezone?.message}
                 
                  />

<CheckboxGroup colorScheme='blue'defaultValue={['monday', 'tuesday','wednesday','thursday','friday']}>
                      <Box>
                        <FormLabel fontSize="xs"  fontWeight="semibold">
                              Work Days
                         </FormLabel>
                      <Text fontSize="xs" color="crimson">
                      {/* @ts-ignore */}

                          {errors?.monday?.message}
                      </Text>
                      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>

                            <Checkbox  {...register("monday")} >Monday</Checkbox>

                          
                            <Checkbox  {...register("tuesday")} >Tuesday</Checkbox>
                            <Checkbox  {...register("wednesday")} >Wednesday</Checkbox>
                            <Checkbox {...register("thursday")} >Thursday</Checkbox>
                            <Checkbox  {...register("friday")} >Friday</Checkbox>
                            <Checkbox  {...register("saturday")} >Saturday</Checkbox>
                            <Checkbox  {...register("sunday")} >Sunday</Checkbox>
                          {/* </HStack> */}

                      </Grid>
                    </Box>
              </CheckboxGroup>









                                <DateInputWithLabel
                              type="time"
                  id="DailyResumption"
                  label="Resumption Time (Start)"
                  size="lg"
                  variant="filled"
                  value={"08:00"}
                  placeholder="e.g 08:00"
                  bg="secondary.200"
                  name="work_start_time"
                  register={register("work_start_time")}
                  formErrorMessage={errors.work_start_time?.message}
                  />

                                <DateInputWithLabel
                                type='time'
                                value="16:00"

                  id="DailyClose/End"
                  label="Resumption Time (End)"
                  size="lg"
                  variant="filled"
                  placeholder="e.g 16:00"
                  bg="secondary.200"
                  name="work_stop_time"
                  register={register("work_stop_time")}
                  formErrorMessage={errors.work_stop_time?.message}
                  />


                  <DateInputWithLabel
                  type='time'
                  id="DailyBreakTime"
                  label="Break Time(start)"
                  size="lg"
                  variant="filled"
                  value={'12:00'}
                  placeholder="e.g 12:00"
                  bg="secondary.200"
                  name="work_break_start_time"
                  register={register("work_break_start_time")}
                  formErrorMessage={errors.work_break_start_time?.message}
                  />

                  
                  <DateInputWithLabel
                  type='time'
                  id="DailyBreakClose/End"
                  label="Break Time(end)"
                  size="lg"
                  variant="filled"
                  value={'13:00'}
                  placeholder="e.g 13:00"
                  bg="secondary.200"
                  name="work_break_stop_time"
                  register={register("work_break_stop_time")}
                  formErrorMessage={errors.work_break_stop_time?.message}
                  />





{/* register={register("organisation_logo")} */}

              
<Box>
                <Text fontWeight="semibold" fontSize="sm" mb="4">
                Upload Organization Logo
                </Text>
                <HStack mb="5">
                  <FormControl id="end_time">
                    
                    <Input type="file" 
                 accept=".png, .jpg, .jpeg"
                    {...register("organisation_logo")}
                    variant="filled" bg="transparent" />
                  </FormControl>
                </HStack>
              </Box>

</Grid>



              <Button
                w="full"
                fontWeight="bold"
                variant="primary"
                size="lg"
                py={7}
                type="submit"
                isLoading={isSubmitting()}
                loadingText="Creating..."
                my="6"
              >
                Create Organization
              </Button>
            </Box>
          </Box>
      </Flex>
    </Flex>
  );
};

export default CreateOrganization;
