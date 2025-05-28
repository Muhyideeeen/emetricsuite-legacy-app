import { useState } from 'react'
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
  } from '@chakra-ui/react';
  import { Link } from 'react-router-dom';
  
  import { useAppDispatch, useAppSelector } from '../../redux/hooks';
  import { loginUser } from '../../redux/auth/login/loginAPI';
  
  import Logo from '../../assets/images/logo.png';
  import LoginIllustration from '../../assets/images/login-illustration.svg';
  import InputWithLabel from '../../components/InputWithLabel';
  import { SubmitHandler, useForm } from 'react-hook-form';
  import * as yup from 'yup';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useEffect } from 'react';
  import { useHistory, Redirect } from 'react-router-dom';
import { selectLogin } from '../../redux/auth/login/loginSlice';
import axios from '../../services/api'
import { getAllOrganizations } from '../../redux/organization/organizationAPI';
import TokenService from '../../services/token.service';
  
  
  export interface LoginInputs {
    email: string;
    password: string;
  }
  
  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Email is invalid'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  });
  
  const TenantManageLogin = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginInputs>({ resolver: yupResolver(schema) });
  
    const dispatch = useAppDispatch();
    const toast = useToast();
    const history = useHistory();
    const { status, message, errorMessage} = useAppSelector(selectLogin);
    const [duplicatedCredtials,setDuplicatedCredtials] = useState<LoginInputs>({
      email:"",password:""
    })
    const isSubmitting = () => {
      return status === 'loading';
    };
  
    const onSubmit: SubmitHandler<LoginInputs> = data => {
      dispatch(loginUser(data));
    };

  
  
    useEffect(() => {
      if (status === 'succeeded') {
        toast({
          title: message,
          status: 'success',
          position: 'top',
          duration: 5000,
        });
        console.log({'success':'lol i have stuff'})
        history.push('/tenant-management/home')
      }
      if (status === 'failed') {
        toast({
          title: errorMessage,
          status: 'error',
          position: 'top',
          duration: 5000,
          isClosable: true,
        });
      }
    }, [status]);

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
            <Image src={LoginIllustration} alt="" />
          </VStack>
          <Flex h="100vh" w="100%" bg="white" flex={1} align="center">
            <Box w="66%" mx="17%">
              <Heading as="h1" color="primary" size="xl" fontWeight={900}>
                Login to Emetric Admin Management 
              </Heading>
              <Heading as="h5" size="sm" mb={10}>
                Welcome Back
              </Heading>
  
              <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={8}>
                  <InputWithLabel
                    id="email"
                    label="Email Address"
                    type="email"
                    size="lg"
                    variant="filled"
                    placeholder="e.g janedoe@gmail.com"
                    bg="secondary.200"
                    name="email"
                    register={register('email')}
                    isInvalid={errors.email ? true : false}
                    formErrorMessage={errors.email?.message}
                  />
  
                  <InputWithLabel
                    id="password"
                    label="Password"
                    type="password"
                    size="lg"
                    variant="filled"
                    placeholder="**************"
                    bg="secondary.200"
                    name="password"
                    register={register('password')}
                    formErrorMessage={errors.password?.message}
                  />
                </Stack>
        <br />
                <Button
                  variant="primary"
                  fontWeight="bold"
                  w="full"
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting()}
                  loadingText="Signing In"
                >
                  Login
                </Button>
               

          
              </Box>
            </Box>
          </Flex>
        </Flex>
      </>
    );
  };
  
  export default TenantManageLogin;
  