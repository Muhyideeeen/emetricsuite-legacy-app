import useQuery from "../components/useQuery";
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link
} from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from '../assets/images/logo.png';
import ForgotPasswordIllustration from '../assets/images/forgotpassword.svg';
import InputWithLabel from '../components/InputWithLabel';
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from "axios";
import { useErrorHandler } from "react-error-boundary";
import errorMessageGetter from "../utils/errorMessages"
import Preloader from "../components/Preloader";
import {useHistory} from "react-router-dom";
import {baseURL} from '../services/api';

interface PasswordRestType{
    "password1": string,
    "password2": string,

}
const schema =yup.object().shape({
    password1:yup.string().required('Password is required').min(7),
    password2:yup.string().min(7)
    .oneOf([yup.ref('password1'), null], 'Confirm Password Must Match Password'),
})
interface RestPasswordCrendtialsTypeInterface{
    "uid_base64":string;
            "token":string;
            isCorrect:boolean;
}
const RestPassword = ()=>{

    let query = useQuery()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordRestType>({
        resolver:yupResolver(schema)})
        const handleError = useErrorHandler();
        const dispatch = useAppDispatch();
        const toast = useToast();
        const [isLoading,setIsLoading] = useState<boolean>(false);
        const history = useHistory();
        const forServiceAcct= query.get("org")
        const [credentials,setCredentials]=useState<RestPasswordCrendtialsTypeInterface>({
            "uid_base64":"","token":"",isCorrect:false})
    // uid_base64:{query.get("uid_base64")} <br />
    // token:{query.get("token")}
    const Validate_uidBase64AndToken =async()=>{
        setIsLoading(true)

        // /client/{{ORGANISATION_NAME}}/auth/password-reset-confirm/:uid_base64/:token/
        const org_name = localStorage.getItem("current_organization_short_name");
        if(!org_name){
          
            toast({
                title: 'Validation Error',
                description: "Please go back to the forgot password to enter resend your email",
                status: "error",
                position: 'top',
                duration: 4000,
                isClosable: true,
              });

              setTimeout(()=>{
                history.push("/");

            },2000)

        setIsLoading(false)

            return
        }
        // {
        //     "status": 200,
        //     "message": "Token Valid",
        //     "data": {
        //         "uid_base64": "OWIwZmE2ZTYtYWQ2OS00YjI2LTk5NmQtMDQ5NWNhZjJmNmI4",
        //         "token": "b33jz4-7455f647aa27f353f5e4336aef0b3f7b"
        //     }
        // }
        // {
        //     "status": 401,
        //     "message": "Token is not valid, please request a new one",
        //     "error": []
        // }


    try{
      let validateResp:any="if it forServiceAcct === public then this is for an admin"
      if(forServiceAcct==="public"){
        validateResp = await  axios.get(baseURL+`/auth/password-reset-confirm/${query.get("uid_base64")}/${query.get("token")}/`)

      }else{

         validateResp = await  axios.get(baseURL+`/client/${org_name}/auth/password-reset-confirm/${query.get("uid_base64")}/${query.get("token")}/`)
      }
        console.log({
          validateResp
        })
        const confirmSuccess =validateResp.data.data
        setCredentials({
            "uid_base64":confirmSuccess.uid_base64,"token":confirmSuccess.token,isCorrect:true
        })
        toast({
            title: 'Valid Token',
            description: "You can procced to change your password",
            status: "success",
            position: 'top',
            duration: 4000,
            isClosable: true,
          });
        setIsLoading(false)

    }catch(err:any){
      console.log({err})
        if(err?.response?.status === 401){
            toast({
                title: 'Token is not valid, please request a new one',
                // description: errorMessage,
                status: "error",
                position: 'top',
                duration: 4000,
                isClosable: true,
              });
              
        }
        // setIsLoading(false)

        // setCredentials({
        //     "uid_base64":"","token":"",isCorrect:false
        // })
        setTimeout(()=>{
          history.push("/forgot-password");

      },2000)
   
    }
    
    }

    const onSubmit:SubmitHandler<PasswordRestType>= async (data)=>{
      const org_name = localStorage.getItem("current_organization_short_name")
      if(!org_name){
        setTimeout(()=>{
        history.push("/forgot-password")
        },2000)
        toast({
          title: 'Something Went Wrong',
          description: "Some how we could not find your organisation name please go back and resend the email",
          status: "error",
          position: 'top',
          duration: 4000,
          isClosable: true,
        });
        return 
      }
      
console.log(

data,"submmited Data"
) 

    setIsLoading(true)
    try{
      let resp:any=""
      if(forServiceAcct==="public"){
        resp = await axios.patch(baseURL+`/auth/password-reset/`,{
          "password": data.password1,
          "uid_base64": credentials.uid_base64,
          "token": credentials.token});
      }else{
        resp = await axios.patch(baseURL+`/client/${org_name}/auth/password-reset/`,{
          "password": data.password1,
          "uid_base64": credentials.uid_base64,
          "token": credentials.token});
      }
      
        console.log({
          resp
        })
        //to confirm it went through let get the data which is an empty array
        const confirmTrue =resp.data.data
        
          setTimeout(()=>{
            if(forServiceAcct==="public"){
              history.push("/admin/login")

            }else{

              history.push("/")
            }
          },3000)
          toast({
            title: 'Password Reset Successfull',
            // description: "Some how we could not find your organisation name please go back and resend the email",
            status: "success",
            position: 'top',
            duration: 4000,
            isClosable: true,
          });
    setIsLoading(false)
           
        
    }
    catch(err:any){
      console.log({
        err
      })
      // Validate_uidBase64AndToken()
    }

    }

    useEffect(()=>{
      Validate_uidBase64AndToken()
    },[])
    return (
        <>
        <Flex minH="100vh" w="100vw" overflowY="hidden">
          <VStack
            h="100vh"
            w="100%"
            flex={1}
            bg="lightblue"
            spacing="20px"
            align="center"
            justify="center"
          >
            <Image src={Logo} alt="e-metric logo" />
            <Image src={ForgotPasswordIllustration} alt="" />
          </VStack>
          <Flex h="100vh" w="100%" bg="white" flex={1} align="center">




              {isLoading && <Preloader />}


            
            {
            (credentials.isCorrect===true)?
            <Box w="66%" mx="17%">
              <Heading as="h1" color="primary" size="xl" fontWeight={900}>
                Rest Password?
              </Heading>
              <Text mb={10} fontWeight="semibold" fontSize="sm">
                Enter your New Password  
              </Text>
  
              <Box as="form" 
              onSubmit={handleSubmit(onSubmit)}
              >
                <Stack spacing={8}>
                <InputWithLabel
                  id="org_name"
                  type="text"
                    label="New Password"
                    size="lg"
                    variant="filled"
                    placeholder="Amazon"
                    bg="secondary.200"
                    register={register('password1')}
                    formErrorMessage={errors.password1?.message}
                  />
                  <InputWithLabel
                  id="email"
                  type="password"
                    label="Confirm Password"
                    size="lg"
                    variant="filled"
                    placeholder="******"
                    bg="secondary.200"
                    register={register('password2')}
                    formErrorMessage={errors.password2?.message}
                  />
  
                <Button
                type="submit"
                  variant="primary"
                  fontWeight="bold"
                  isLoading={
                      isLoading===true}
                  loadingText="Please Wait"
                  // w="full"
                  // display="block"
                  size="lg"
                >
                  Reset Password
                </Button>
                  
                </Stack>
  
  
  
                
                <Text
                  as="small"
                  textAlign="center"
                  display="block"
                  fontWeight="bold"
                  mt="4"
                >
                  Remember Password?{' '}
                  {/* @ts-ignore */}
                  <Link to="/" color="primary">
                    Login
                  </Link>
                </Text>
              </Box>
            </Box>:""

        }
            
            
            
          </Flex>
        </Flex>Re
      </>
    )
}

export default RestPassword