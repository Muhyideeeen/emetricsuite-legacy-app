
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,FormControl,Input,
  useToast,
    Grid,
    
    Checkbox, CheckboxGroup,FormLabel,HStack,Text
} from "@chakra-ui/react";
import { useErrorHandler } from "react-error-boundary";

import InputWithLabel from "../../../components/InputWithLabel"
import DateInputWithLabel from "../../../components/DateInputWithLabel"
import UpdateInput from "../../../components/UpdateInput";
import SelectWithLabel from "../../../components/selectWithLabels";
import { useHistory } from 'react-router-dom'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { createOrganization } from "../../../redux/organization/organizationAPI";
import { selectOrganization } from "../../../redux/organization/organizationSlice";
import { CreateOrganizationInputs,schema as  CreateOrganizationInputSchema} from "../../../pages/serviceAccount/createOrganization";
import axios,{baseURL} from "../../../services/api";
import CropImage from "../../../components/Crop/CropComponent";
import CustomModal from "../../../components/CustomModal";


interface DataType{
    "company_name": string;
    "company_logo"?: null|string;
    "owner_email": string;
    "owner_first_name": string;
    "owner_last_name": string;
    "company_short_name": string;
    "owner_phone_number": string;
    "work_start_time": string;
    "work_stop_time": string;
    "work_break_start_time": string;
    "work_break_stop_time": string;
    "work_days": number[];
    "timezone": string;
}

const UpdateOrganisation = ()=>{
    const {
        register,
        handleSubmit,control,setValue,getValues,watch,
        formState: { errors },
      } = useForm<CreateOrganizationInputs>({ resolver: yupResolver(CreateOrganizationInputSchema) });
    
      const dispatch = useAppDispatch();
      const { status, message, errorMessage } = useAppSelector(selectOrganization);
      const toast = useToast();
      const history = useHistory();
      const [isSubmitting,setIsSubmitting]=useState(false);
      const [isDeleteing,setIsDeleteing] =useState(false)
      const [uploadLogo,setUploadLogo] =useState(false)
  const handleError = useErrorHandler()
  const org_name =localStorage.getItem("current_organization_short_name")

      const [data,setData]= useState<null|DataType>()
    //   let monday =watch("monday",data?.work_days.includes(0)?true:false)
    //   let tuesday =watch("tuesday",data?.work_days.includes(1)?true:false)
    //   let wednesday =watch("wednesday",data?.work_days.includes(0)?true:false)
    //   let thursday =watch("thursday",data?.work_days.includes(0)?true:false)
    //   let friday =watch("friday",data?.work_days.includes(0)?true:false)
    //   let saturday =watch("saturday",data?.work_days.includes(0)?true:false)
    //   let sunday =watch("sunday",data?.work_days.includes(0)?true:false)
      let watchFields =watch(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],{
          monday:data?.work_days.includes(0)?true:false,
          tuesday:data?.work_days.includes(1)?true:false,
          wednesday:data?.work_days.includes(2)?true:false,
          thursday:data?.work_days.includes(3)?true:false,
          friday:data?.work_days.includes(4)?true:false,
          saturday:data?.work_days.includes(5)?true:false,
          sunday:data?.work_days.includes(6)?true:false,
      })
      const getCurrentOrgInfo =async () => {
    const org_name =localStorage.getItem("current_organization_short_name")
    const client_token= localStorage.getItem("client_tokens")
    if(!org_name) return 
    if(!client_token) return 

    try {

        const response = await fetch(`${baseURL}client/${org_name}/organisation/current/`,{
        method:"get",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + JSON.parse(client_token)?.access,
        },
    });
    const respData = await response.json()
    //this should throw error if there is no email
    console.log("All org res",respData)
    // let err =respData.owner_email.ne
    
        if(respData?.company_short_name){
          setData(respData)
        }else{
          handleError(respData)

        }
    } catch (err:any) {
        if(err.status===401||err.response.status===401){
            handleError(err)
          
        }else{
          toast({
            title: "Network Error",
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
        }
    }
     }

     useEffect(()=>{
        getCurrentOrgInfo()
     },[])

     useEffect(()=>{
        
        setValue("organisation_short_name",data?.company_short_name?data.company_short_name:"")
        setValue("organisation_name",data?.company_name?data.company_name:"")
        setValue("timezone",data?.timezone?data.timezone:"")
        setValue("work_start_time",data?.work_start_time?data.work_start_time:"")
        setValue("work_stop_time",data?.work_stop_time?data?.work_stop_time:"")
        // setValue("work_days",data?.)
        setValue("work_break_start_time",data?.work_break_start_time?data?.work_break_start_time:'')
        setValue("work_break_stop_time",data?.work_break_stop_time?data?.work_break_stop_time:"")
        // setValue("organisation_short_name",data?.organisation_short_name?data?.organisation_short_name:"")
        setValue("organisation_logo",data?.company_logo?data?.company_logo:"")
        setValue("monday",data?.work_days.includes(0)?true:false)
        setValue("tuesday",data?.work_days.includes(1)?true:false)
        setValue("wednesday",data?.work_days.includes(2)?true:false)
        setValue("thursday",data?.work_days.includes(3)?true:false)
        setValue("friday",data?.work_days.includes(4)?true:false)
        setValue("saturday",data?.work_days.includes(5)?true:false)
        setValue("sunday",data?.work_days.includes(6)?true:false)
        
        // watchFields =watch(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],{
        //     monday:data?.work_days.includes(0)?true:false,
        //     tuesday:data?.work_days.includes(1)?true:false,
        //     wednesday:data?.work_days.includes(2)?true:false,
        //     thursday:data?.work_days.includes(3)?true:false,
        //     friday:data?.work_days.includes(4)?true:false,
        //     saturday:data?.work_days.includes(5)?true:false,
        //     sunday:data?.work_days.includes(6)?true:false,
            
        // })

     },[data])


const onSubmit= async (data:any)=>{
    console.log(data,'submitet')
    const org_name =localStorage.getItem("current_organization_short_name")
    const client_token= localStorage.getItem("client_tokens")
    if(!org_name) return 
    if(!client_token) return 
    const form = new FormData();
    setIsSubmitting(true)
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
        data.work_days.push(6)
    }

    delete data['monday']
    delete data['tuesday']
    delete data['wednesday']
    delete data['thursday']
    delete data['friday']
    delete data['saturday']
    delete data['sunday']
    console.log({"subiuted data":data,uploadLogo})
    
    form.append("work_days",JSON.stringify(data.work_days))
    form.append('organisation_short_name',data.organisation_short_name)
    form.append('organisation_name',data.organisation_name)
    if(data?.organisation_logo){
      if(uploadLogo){
        if(data.organisation_logo[0]){
          form.append('organisation_logo',data.organisation_logo[0])
        }
      }

    }
    form.append('work_start_time',data.work_start_time)
    form.append('work_stop_time',data.work_stop_time)
    form.append('work_break_start_time',data.work_break_start_time)
    form.append('work_break_stop_time',data.work_break_stop_time)
    form.append('timezone',data.timezone)
    try{
      const resp = await axios.put(`/user/organisation/update/${org_name}/`,form)
      console.log(resp)
      // org_info
      const org_info = localStorage.setItem("org_info",JSON.stringify(resp.data.data))
      // console.log({
      //   resp
      // })
      
    //   const response = await fetch(`${baseURL}/user/organisation/update/${org_name}/`,{
    //     method:"get",
    //     headers:{
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         "Authorization": "Bearer " + JSON.parse(client_token)?.access,
    //     },
    // })
    // if(resp)
    toast({
      title: "Updated Successfully",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
    })
    }
    catch(err:any){
      console.log(err.response)
      if(err.response.status===401){
        handleError(err)
      }

      toast({
        title: "please check the fields",
              status: "error",
              position: "top",
              duration: 5000,
              isClosable: true,
      })

    }
    setIsSubmitting(false)
}
const handleDelete = async()=>{
  console.log("202")
  const org_name =localStorage.getItem("current_organization_short_name")
  if(!org_name) return 

  setIsDeleteing(true)
  try{
     const resp =await axios.delete(`/user/organisation/delete/${org_name}/`)
    console.log(
      {
        resp
      }
    )
    //  let confirmDelete = resp.data.status
      if(resp.status === 204){
        toast({
          title: "Your account Has Been Deleted",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
      })
        setTimeout(()=>{
          window.location.href='/'  
        },2000)
      }
    }catch(err:any){

    if(err.response.status===401){
      handleError(err)
    }
  }

  setIsDeleteing(false)
}

return <>
    {/* <p>{watchFields}</p> */}
    
    <Flex minH="100vh" w="100%" overflowY="hidden"
    
    >
      <Flex bg="white" flex={4} 
      align="center" justifyContent="center"
      >
          <Box 
        //   mx="auto"
        width="100%"
        
          >
            {/* <Heading as="h1" color="primary" size="xl" mb="10" fontWeight={900}>
              Create an Organization
            </Heading> */}
            <Box as="form"
            id='updateOrg'
             onSubmit={handleSubmit(onSubmit)}
             >
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
                  isDisabled={true}
                  formErrorMessage={errors.organisation_short_name?.message}
                />
                <InputWithLabel
                  isDisabled={true}
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
                //   value
                  placeholder={data?.timezone}
                  bg="secondary.200"
                  setvalue={setValue}
                  // name="timezone"
                  // register={register("timezone")}
                  formErrorMessage={errors.timezone?.message}
                 
                  />

<CheckboxGroup colorScheme='blue'>
                      <Box>
                        <FormLabel fontSize="xs"  fontWeight="semibold">
                              Work Days
                         </FormLabel>
                      <Text fontSize="xs" color="crimson">
        {/* @ts-ignore */}
                          {errors?.monday?.message}
                      </Text>
                      <Grid gridTemplateColumns="1fr 1fr" columnGap={4} rowGap={8}>

                            <Checkbox  
                            isChecked={
                                // watchFields                           
                                watchFields[0]?true:false
                                // getValues()?.monday.includes(0)?true:false
                            }
                            onChange={(e)=>{
                             
                                setValue("monday",!watchFields[0])
                            }}
                            >Monday</Checkbox>

                          
                            <Checkbox 
                            isChecked={
                                // watchFields                           
                                watchFields[1]?true:false
                                
                            }
                            onChange={(e)=>{
                               
                                setValue("tuesday",!watchFields[1])
                            }}


                             >Tuesday</Checkbox>
                            <Checkbox 
                                                        isChecked={
                                                            // watchFields                           
                                                            watchFields[2]?true:false
                                                            
                                                        }
                                                        onChange={(e)=>{
                                                        
                                                            setValue("wednesday",!watchFields[2])
                                                        }}
                            >Wednesday</Checkbox>
                            <Checkbox 
                                                        isChecked={
                                                            // watchFields                           
                                                            watchFields[3]?true:false
                                                            
                                                        }
                                                        onChange={(e)=>{
                                                            
                                                            setValue("thursday",!watchFields[3])
                                                        }}
                            >Thursday</Checkbox>
                            <Checkbox  
                                                        isChecked={
                                                            // watchFields                           
                                                            watchFields[4]?true:false
                                                            
                                                        }
                                                        onChange={(e)=>{
                                                    
                                                            setValue("friday",!watchFields[4])
                                                        }}
                            >Friday</Checkbox>
                            <Checkbox                             isChecked={
                                // watchFields                           
                                watchFields[5]?true:false
                                
                            }
                            onChange={(e)=>{
     
                                setValue("saturday",!watchFields[5])
                            }} >Saturday</Checkbox>
                            <Checkbox  
                                                        isChecked={
                                                            // watchFields                           
                                                            watchFields[6]?true:false
                                                            
                                                        }
                                                        onChange={(e)=>{
                                                          
                                                            setValue("sunday",!watchFields[6])
                                                        }}
                            >Sunday</Checkbox>
                          {/* </HStack> */}

                      </Grid>
                    </Box>
              </CheckboxGroup>









                                <DateInputWithLabel
                              type="time"
                  id="DailyResumption"
                  label="Resumption Time(Start)"
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
                                value={"16:00"}

                  id="DailyClose/End"
                  // label="Daily Resumption Close/End Time"
                  label="Resumption Time(end)"

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
                  value={"03:00"}
                  placeholder="e.g 12:00"
                  bg="secondary.200"
                  name="work_break_start_time"
                  register={register("work_break_start_time")}
                  formErrorMessage={errors.work_break_start_time?.message}
                  />

            {/* <UpdateInput 
                value={getValues().work_break_start_time===""?data?.work_break_start_time:getValues().work_break_start_time}
                id="DailyBreakTime"
                label="Daily Break Time"
                size="lg"
                variant="filled"
                type="time"
                name="work_break_start_time"
                placeholder="e.g 12:00"
                bg="secondary.200"
                setValue={setValue}
                formErrorMessage={errors.work_break_start_time?.message}                      
            /> */}

{/* <div>
<FormLabel fontSize="xs" htmlFor={"id"} fontWeight="semibold">
Daily Break Time
        </FormLabel>
<Input
type='time'
id="DailyBreakTime"
label="Daily Break Time"
size="lg"
variant="filled"
name="work_break_start_time"
value={getValues().work_break_start_time===""?data?.work_break_start_time:getValues().work_break_start_time}
placeholder="e.g 12:00"
bg="secondary.200"
    // name="work_break_start_time"
//   {...register("work_break_start_time")}
    onChange={(e=>{
        setValue("work_break_start_time",e.target.value)
    })}
  // formErrorMessage={errors.work_break_start_time?.message}
        />
</div> */}

                  
                  <DateInputWithLabel
                  type='time'
                  id="DailyBreakClose/End"
                  label="Break Time(end)"
                  // label="Daily Break Close/End Time"
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
<Button
onClick={(e)=>{
  setUploadLogo(!uploadLogo)
}}
>
  {
    uploadLogo?
    "Keep Current Logo" :"Updated Logo"
  }
  </Button>

{
  uploadLogo?
<>
<Text fontWeight="semibold" fontSize="sm" mb="4">
                Upload Organization Logo
                </Text>
                <HStack mb="5">
                  <FormControl id="end_time">
                    
                    <Input type="file" 
                 accept=".png, .jpg, .jpeg"
                 required
                 variant="filled" bg="transparent" 
                 {...register("organisation_logo")}
                    />
                {/* <CropImage setValue={setValue} fieldName={'organisation_logo'}/> */}

                  </FormControl>
</HStack>
</>:""
}

              </Box>

</Grid>


<Flex
justifyContent={"space-between"}
alignItems={"center"}
>
<Button
                // w="full"
                fontWeight="bold"
                variant="primary"
                size="lg"
                py={7}
                type="submit"
                form="updateOrg"
                isLoading={isSubmitting===true}
                loadingText="updating..."
                my="6"
                width={"40%"}
              >
                Update Organization
              </Button>

              {/* <Button
              // as="button"
                width={"40%"}
                size="lg"
                py={7}
                isLoading={isDeleteing===true}
                loadingText="deleteing..."
                my="6"
              onClick={(e)=>{
                // console.log("this is suffereing")
                if(window.confirm("Do You Want To Delete the Whole Organisation")){
                  handleDelete()
                }
              }}>
                Delete Organization
              </Button>   */}
</Flex>

            </Box>
          </Box>
      </Flex>
    </Flex>
    
    </>
}


export default UpdateOrganisation