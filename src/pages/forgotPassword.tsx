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
import { Link as ReactLink } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Logo from '../assets/images/logo.png';
import ForgotPasswordIllustration from '../assets/images/forgotpassword.svg';
import InputWithLabel from '../components/InputWithLabel';
// import { forgotPassword } from '../redux/account/accountAPI'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { SubmitHandler, useForm } from 'react-hook-form';
// import { clearState, selectUser } from '../redux/user/userSlice';
import {baseURL} from '../services/api';
import axios from "axios"
import { useErrorHandler } from "react-error-boundary";
import errorMessageGetter from "../utils/errorMessages";
import useQuery from "../components/useQuery";

const schema = yup.object().shape({
  email: yup.string().required(),
  org_name: yup.string().required(),
});
const ForgotPassword = () => {
  const query = useQuery()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{email:string,org_name:string}>({ resolver: yupResolver(schema) });
  const handleError = useErrorHandler();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const forServiceAcct = query.get("for_what_acct")
  // const { status, errorMessage, message } = useAppSelector(selectUser);
const status = Math.random() * 10 === 5 ? "succeeded" : "failed"

//   const isSubmitting = () => {
//     return status === 'loading';
//   }

  const onSubmit: SubmitHandler<{email:string,org_name:string}>= async (data) => {
    console.log("Forgot was clicked", data);
  
setIsLoading(true)
    try{
      let resp:any="either is for a service account or tenant(Which is found in the organisation Page)"
      if(forServiceAcct){
        resp =  await axios.post(baseURL+`/auth/request-password-reset-email/`,{"email":data.email});

      }else{
        resp =  await axios.post(baseURL+`/client/${data.org_name}/auth/request-password-reset-email/`,{"email":data.email});
      }
     console.log({
       resp
     })
      // checkIFITwenThrough this var just try to get data if data is not found then we will auto pushed to the catch
      const checkIFITwenThrough = resp.data.data
           toast({
        title: 'Reset Password Email Sent Successfully',
        // description: errorMessage,
        status: "success",
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
      //we set this so we can use it in the RestPasswordPage
      localStorage.setItem("current_organization_short_name",data.org_name)
setIsLoading(false)

    }
    catch(err:any){
      console.log({err})
      if(err?.response === undefined){
        toast({
          title: 'Please Check your Internet',
          // description: errorMessage,
          status: "error",
          position: 'top',
          duration: 4000,
          isClosable: true,
        });
        setIsLoading(false)
      }
      if(err?.response?.status === 404){
        toast({
          title: 'Organisation Does Not Exist',
          description: "Check the Spelling of the organisation",
          status: "error",
          position: 'top',
          duration: 4000,
          isClosable: true,
        });
        setIsLoading(false)
      }
      if(err.response.status==401){
        handleError(err)
      }
      if(err?.response?.data){
        errorMessageGetter(err.response.data)
      }
      

      
    }
setIsLoading(false)
  
  }

//   useEffect(() => {
//     if (status === 'failed') {
//       toast({
//         title: 'There was an error.',
//         description: errorMessage,
//         status: 'error',
//         position: 'top',
//         duration: 4000,
//         isClosable: true,
//       });
//     }
//   }, [status])
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
          {status === 'succeeded' ? (
            <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Password Reset successfully!
            </AlertTitle>
            {/* <AlertDescription maxWidth="sm">{message}</AlertDescription> */}
          </Alert>
          ) : (
          <Box w="66%" mx="17%">
            <Heading as="h1" color="primary" size="xl" fontWeight={900}>
              Forgot Password?
            </Heading>
            <Text mb={10} fontWeight="semibold" fontSize="sm">
              Enter your email and further instructions would be sent to reset your password
            </Text>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={8}>
              <InputWithLabel
                id="org_name"
                type="text"
                  label="Organisation Short Name"
                  size="lg"
                  variant="filled"
                  placeholder="Amazon"
                  bg="secondary.200"
                  register={register('org_name')}
                  formErrorMessage={errors.org_name?.message}
                />
                <InputWithLabel
                id="email"
                type="email"
                  label={forServiceAcct?"Email":"Employee Email"}
                  size="lg"
                  variant="filled"
                  placeholder="e.g janedoe@gmail.com"
                  bg="secondary.200"
                  register={register('email')}
                  formErrorMessage={errors.email?.message}
                />

              <Button
              type="submit"
                variant="primary"
                fontWeight="bold"
                isLoading={isLoading===true}
                loadingText="Please Wait"
                // w="full"
                // display="block"
                size="lg"
              >
                Send Mail
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
                <Link as={ReactLink} to="/" color="primary">
                  Login
                </Link>
              </Text>
            </Box>
          </Box>
          )}
        </Flex>
      </Flex>Re
    </>
  );
};

export default ForgotPassword;
