import { useEffect, useState } from "react";
import axios from "../services/api";
import { Link as ReactLink, useLocation } from "react-router-dom";
import {
  Flex,
  VStack,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Button,Box, useToast
} from "@chakra-ui/react";

import SignUpIllustration from "../assets/images/signup-illustration.svg";
import Logo from "../assets/images/logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm ,SubmitHandler} from "react-hook-form";
import InputWithLabel from "../components/InputWithLabel";
import { HiOutlineChevronRight } from "react-icons/hi";

interface SubmitInput{
    password:string;
}

const schema = yup.object().shape({
    password:yup.string().min(4).required("you need to enter a Password greater than 8")
})
interface Data {
  status: null | number;
  data: [];
  message: string;
}
type LoadingType=false|true|null
const TenantValidateEmail = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<SubmitInput>({ resolver: yupResolver(schema) });
    
      const toast =useToast()

  const [isLoading, setIsLoading] = useState<LoadingType>(null);
  const [data, setData] = useState<Data>({status: null, data: [], message: ""});
  const [error, setError] = useState("");

  const location = useLocation();

  const validateUserEmail = async (key: string,Org_name:string,password:string) => {
    try {
      const response = await axios.post(`/client/${Org_name}/auth/email-invite/setup/`, { "key":key,"password":password});
      console.log({response,key})
      setIsLoading(false);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      // setIsLoading(false);
      setIsLoading(null);
      setError(err.response.data.message||err.message);
    }
  };

 
  
  useEffect(()=>{

    if(error){
        toast({
            title: error,
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
        if(error==='Your account has already been setup'){
          // redirect the person to login page
          setIsLoading(false)
        }
    }
    setError("");
  },[error])

    const onSubmit:SubmitHandler<SubmitInput> =(data)=>{
      
        setIsLoading(true);
        // retrieve the key from the query string in the url
        const key = new URLSearchParams(location.search).get("key");
        const Org_name = new URLSearchParams(location.search).get("org");
        console.log(key,Org_name,data.password)
        if (key && Org_name) {
          validateUserEmail(key,Org_name,data.password);
           
        }


    }



  return (
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
        <Image src={SignUpIllustration} alt="" />
      </VStack>
      
      <Flex h="100vh" w="100%" bg="gray.300" flex={1} align="center">
        
{
isLoading===null?


<Box margin={"0 auto"}  as="form" onSubmit={handleSubmit(onSubmit)}>

<InputWithLabel 

id="password"
label="Set Your Password Here!!"
type="password"
size="lg"
variant="filled"
placeholder="******"
bg="secondary.200"
name="password"
register={register("password")}
formErrorMessage={errors.password?.message}
/>

<Button
w="40%"
fontWeight="light"
variant="primary"
size="lg"

py={7}
type="submit"
// isLoading={isSubmitting()}
rightIcon={<HiOutlineChevronRight />}
loadingText="Submitting..."
>
Submit
</Button>
</Box>
:



isLoading ? (
    <h1>Verifying, Please wait...</h1>
    ) : (
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
            {data.message}
            </AlertTitle>

        <AlertDescription maxWidth="sm">
        Click{" "}
        <Link as={ReactLink} to="/admin/login">
            <Button variant="primary">here</Button>
        </Link>{" "}
        to proceed to login
        </AlertDescription>
    </Alert>
    )



}
    
 

      </Flex>

    </Flex>
  );
};

export default TenantValidateEmail;
