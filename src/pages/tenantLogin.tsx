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
    Checkbox,
    FormControl,
    FormLabel,
  } from '@chakra-ui/react';
  import { Link } from 'react-router-dom';
  
  import { useAppDispatch, useAppSelector } from '../redux/hooks';
  import { loginTenant, ResetLoginState } from '../redux/auth/tenantLogin/tenantLoginAPI';
  
  import Logo from '../assets/images/logo.png';
  import LoginIllustration from '../assets/images/login-illustration.svg';
  import InputWithLabel from '../components/InputWithLabel';
  import { SubmitHandler, useForm } from 'react-hook-form';
  import * as yup from 'yup';
  import { yupResolver } from '@hookform/resolvers/yup';
  import { useEffect, useState } from 'react';
  import { useHistory } from 'react-router-dom';
import { selectTenantLogin } from '../redux/auth/tenantLogin/tenantLoginSlice';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
import TokenService from '../services/token.service';
import axios from '../services/api';
import { getOrganisationWorkInfo } from '../services/list.service';
  
  export interface TenantLoginInputs {
    email: string;
    password: string;
    org_name: string;
  }
  
  const schema = yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    org_name: yup.string().required("Organization Name is required"),
  });
  
  const TenantLogin = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<TenantLoginInputs>({ resolver: yupResolver(schema) });
    const [isHrAdmin,setIsHrAdmin] = useState(false)
    const dispatch = useAppDispatch();
    const toast = useToast();
    const history = useHistory();
    const { status, message,errorMessage } = useAppSelector(selectTenantLogin);
    const [duplicatedCredtials,setDuplicatedCredtials] = useState<TenantLoginInputs>({
      email:"",password:"",org_name:""
    })
    const isSubmitting = () => {
      return status === 'loading';
    };
  
    const onSubmit: SubmitHandler<TenantLoginInputs> = data => {
      setDuplicatedCredtials({...data})
      dispatch(loginTenant(data));
    };
    const get_token= async ()=>{
      //this function set Admin token so the current admin can go from service account to service account 
      let email = duplicatedCredtials.email
      if(isHrAdmin){
        email = email+`.emetricshort.${duplicatedCredtials.org_name}`
      }
      const resp = await axios.post('/auth/login/',{
        email,password:duplicatedCredtials.password
      })
      console.log({'response':resp})
      if(resp.data.status === 200 ){
        TokenService.updateLocalAdminTokens(resp.data.data.tokens)
      }
    }

    const saveShortName_andother_data= async ()=>{


      const resp = await axios.get('/user/organisation/client/all/');

      if (resp.data.count > 0){
          // fix this. current_org should be in state
          localStorage.setItem('current_organization', resp.data.data[0].company_name)
          localStorage.setItem('current_organization_short_name', resp.data.data[0].company_short_name)
          
          
      }
    }
  
    useEffect(() => {
      if(message){
        if (status === 'succeeded') {
          toast({
            title: message,
            status: 'success',
            position: 'top',
            duration: 5000,
          });
          //this means save short and long name in local storage
          localStorage.setItem('current_organization_short_name',duplicatedCredtials.org_name)

          getOrganisationWorkInfo()//also save THe Organosation  work info in the locacl storage

          //this push the user to their right landing page after they log in
          if(TypeVerifierUserChecker(["employee","team_lead"],"client_tokens")){
            history.push('/dashboard/dashboard-page');
         
          }
          else if(TypeVerifierUserChecker(["employee","team_lead","admin","super_admin",'admin_hr'],"client_tokens")){
            if(TypeVerifierUserChecker(['admin',"super_admin",'admin_hr'],"client_tokens")){
              get_token()
              
            }
            history.push('/dashboard/home');
          
            
          }
        }






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

      return ()=>{
      

        setTimeout(()=>{
          dispatch(ResetLoginState())
        },100000)
      }
    }, [status]);


    // use
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
            <Box w="86%" mx="17%"
            // style={{border:"1px solid red"}}
            >
              <Heading as="h1" color="primary"
              // size="md"
              style={{"fontSize":"2.1rem"}}
               fontWeight={900}>
                Login to your organization
              </Heading>
              <Heading as="h5" size="sm" mb={10}>
                Welcome Back
              </Heading>
  
              <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <InputWithLabel
                    id="org_name"
                    label="Organization Name"
                    type="text"
                    size="lg"
                    variant="filled"
                    placeholder="Nestle"
                    bg="secondary.200"
                    name="org_name"
                    register={register('org_name')}
                    formErrorMessage={errors.org_name?.message}
                  />
                  <InputWithLabel
                    id="email"
                    label="Employee Email"
                    type="email"
                    size="lg"
                    variant="filled"
                    placeholder="e.g janedoe@gmail.com"
                    bg="secondary.200"
                    name="email"
                    register={register('email', { required: true })}
                    formErrorMessage={errors.email?.message}
                  />
                    <Checkbox fontSize="xs" onChange={(e)=>setIsHrAdmin(!isHrAdmin)}>Login as Hr</Checkbox>
                  <InputWithLabel
                    id="password"
                    label="Password"
                    type="password"
                    size="lg"
                    variant="filled"
                    placeholder="**************"
                    bg="secondary.200"
                    name="password"
                    register={register('password', { required: true })}
                    formErrorMessage={errors.password?.message}
                  />
                </Stack>
  
                <Text
                  as="small"
                  color="primary"
                  textAlign="right"
                  display="block"
                  fontWeight="bold"
                  my="6"
                >
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Text>
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
                
                <Text
                                   textAlign="center"
                
                >

                </Text>
              



              <Text
                 as="small"
                 textAlign="center"
                 display="block"
                 fontWeight="bold"
                 mt="4"
                >
                   Login to {"  "}
                  <Link style={{color:'#0b3178'}} to="/admin/login">
                  service account
                  </Link>
                </Text>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </>
    );
  };
  
  export default TenantLogin;
  