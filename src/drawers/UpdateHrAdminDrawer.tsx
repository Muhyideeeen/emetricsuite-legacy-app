
import { Box,Button,Grid, useToast } from "@chakra-ui/react"
import InputWithLabel from "../components/InputWithLabel"
import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Text,
    FormControl,
    FormLabel,
    Select,
  } from "@chakra-ui/react";

import { yupResolver } from "@hookform/resolvers/yup";
import axios,{baseURL} from "../services/api";
import { useErrorHandler } from "react-error-boundary";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import errorMessageGetter from "../utils/errorMessages";
import { useEffect, useState } from "react";

import Preloader from "../components/Preloader";


type CreateHrAdminForm = {
	"first_name": string,
	"last_name": string,
	"phone_number": string,
	"email": string,
	"password"?:string,
}


const schema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    phone_number: yup.string().required("Phone Number is required"),
    email: yup.string().email('must be email format').required("Emailis required"),
    password:yup.string(),
})


const UpdateHrAdminDrawer = (props:CreateHrAdminForm):React.ReactElement=>{

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },setValue
      } = useForm<CreateHrAdminForm>({ resolver: yupResolver(schema) });
      const [isLoading,setIsLoading] = useState(false)
      const handleError = useErrorHandler()

      const toast = useToast()

      const onSubmit: SubmitHandler<CreateHrAdminForm>= async (data)=>{
        console.log({'submmited data ':data})
        // delete data['confirm_password']\
        const org_name =localStorage.getItem("current_organization_short_name");
        if(!org_name) return 
        setIsLoading(true)
        try {
            const resp =await axios.put(`/auth/register/admin/?organisation_short_name=${org_name}`,data)
            console.log({'creadted':resp})
            toast({
                title: 'Updated Successfully',
                status: 'success',
                position: "top",
                duration: 3000,
                isClosable: true,
              });
              setTimeout(()=>{
                window.location.reload()
              },1000    )
        } catch (err:any) {
            console.log(err.response)
            if(err.response.status === 403){
                console.log({'you dont have permission to this function':err})
                toast({
                    title: 'You dont have permission to this function',
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                  });
            }
            if(err.response.status===400){
                console.log({'err':errorMessageGetter(err.response.data)})
                toast({
                    title: errorMessageGetter(err.response.data),
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                  });
            }  
            if(err.response.status === 401){
                console.log({'toke expirerd':err})
                handleError(err)
            }
            
        }
        setIsLoading(false)

    }

    useEffect(()=>{
        setValue('email',props.email)
        setValue('first_name',props.first_name)
        setValue('last_name',props.last_name)
        setValue('phone_number',props.phone_number)
    },[])
    return (
        <>
           <DrawerCloseButton />
            <DrawerHeader fontSize="md">Update Hr Admin</DrawerHeader>
            <DrawerBody>

        {isLoading &&<Preloader />}
            <Box as="form"
            id='create-hr-admin'
            style={{'width':'100%','padding':'1rem'}}
            onSubmit={handleSubmit(onSubmit)}
            >
            <Grid
              gridTemplateColumns="1f"
                columnGap={4}
                rowGap={8}
                mb="10"
              >

                <InputWithLabel
                    id="first_name"
                    label="first Name"
                    size="lg"
                    variant="filled"
                    placeholder="Nwokolo"
                    bg="secondary.200"
                    name="first_name"
                    register={register("first_name")}
                    formErrorMessage={errors.first_name?.message}
                />
                
                <InputWithLabel
                    id="last_name"
                    label="Last Name"
                    size="lg"
                    variant="filled"
                    placeholder="Mathhew"
                    bg="secondary.200"
                    name="last_name"
                    register={register("last_name")}
                    formErrorMessage={errors.last_name?.message}
                />
                
                <InputWithLabel
                    id="phone_number"
                    label="Phone Number"
                    size="lg"
                    variant="filled"
                    placeholder="Please Input correct Phone Number"
                    bg="secondary.200"
                    name="phone_number"
                    register={register("phone_number")}
                    formErrorMessage={errors.phone_number?.message}
                />

                <InputWithLabel
                id="email"
                label="Email"
                size="lg"
                variant="filled"
                disabled={true}
                placeholder="Please Input correct Phone Number"
                bg="secondary.200"
                name="email"
                register={register("email")}
                formErrorMessage={errors.email?.message}
                />


                <InputWithLabel
                id="password"
                label="Password"
                size="lg"
                variant="filled"
                placeholder="Please Input correct Password"
                bg="secondary.200"
                name="password"
                register={register("password")}
                formErrorMessage={errors.password?.message}
                />


                

              </Grid>

              <Button 
               fontWeight="bold"
               variant="primary"
               type="submit"
               form="create-hr-admin"
               isLoading={isLoading}
               loadingText="updating..."
              >
                    Update Hr Admin
              </Button>
            </Box>

            
            </DrawerBody>

            <DrawerFooter>

            </DrawerFooter>
        </>
    )
}

export default UpdateHrAdminDrawer