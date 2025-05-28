import { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Image,
  Grid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import SignUpIllustration from "../assets/images/signup-illustration.svg";
import Logo from "../assets/images/logo.png";
import InputWithLabel from "../components/InputWithLabel";
import { signUpUser } from "../redux/auth/signUp/signUpAPI";
import { HiOutlineChevronRight } from "react-icons/hi";
import { selectSignUp } from "../redux/auth/signUp/signUpSlice";

export interface SignUpInputs {
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
});
const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({ resolver: yupResolver(schema) });

  const dispatch = useAppDispatch();
  const { status, errorMessage, message } = useAppSelector(selectSignUp);
  const toast = useToast();

    const isSubmitting = () => {
      return status === 'loading';
    };

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {
    dispatch(signUpUser(data));
  };

    useEffect(() => {
      if (status === 'succeeded') {
        toast({
          title: message,
          status: 'success',
          position: 'top',
          duration: 4000,
        })
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
      <Flex h="100vh" w="100%" bg="white" flex={1.4} align="center">
        {status === "succeeded" ? (
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
              {/* {message} */}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Your account has been created successfully. Kindly check your mail
              to verify your account.
            </AlertDescription>
          </Alert>
        ) : (
          <Box w="80%" mx="10%">
            <Heading as="h1" color="primary" size="xl" fontWeight={900}>
              Welcome to E-metric Suite
            </Heading>
            <Heading as="h5" size="sm" mb={10}>
              Create your account below
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid
                gridTemplateColumns="1fr 1fr"
                columnGap={4}
                rowGap={8}
                mb="10"
              >
                <InputWithLabel
                  id="firstName"
                  label="First Name"
                  size="lg"
                  variant="filled"
                  placeholder="e.g Christopher"
                  bg="secondary.200"
                  name="first_name"
                  register={register("first_name")}
                  formErrorMessage={errors.first_name?.message}
                />

                <InputWithLabel
                  id="lastName"
                  label=" Last Name"
                  size="lg"
                  variant="filled"
                  placeholder="e.g Godwin"
                  bg="secondary.200"
                  name="last_name"
                  register={register("last_name")}
                  formErrorMessage={errors.last_name?.message}
                />

                <InputWithLabel
                  id="phoneNumber"
                  label="Phone Number"
                  size="lg"
                  variant="filled"
                  placeholder="e.g +2348000000000"
                  bg="secondary.200"
                  name="phone_number"
                  register={register("phone_number")}
                  formErrorMessage={errors.phone_number?.message}
                />

                <InputWithLabel
                  id="email"
                  label="Email"
                  type="email"
                  size="lg"
                  variant="filled"
                  bg="secondary.200"
                  placeholder="e.g banwill@gmail.com"
                  name="email"
                  register={register("email")}
                  formErrorMessage={errors.email?.message}
                />
                <InputWithLabel
                  id="password"
                  label="Password"
                  type="password"
                  size="lg"
                  variant="filled"
                  bg="secondary.200"
                  placeholder="**************"
                  name="password"
                  register={register("password")}
                  formErrorMessage={errors.password?.message}
                />
              </Grid>
              <Grid gridTemplateColumns="1fr 1fr" columnGap={4} mb="2">
                <Button
                  w="100%"
                  fontWeight="bold"
                  variant="primary"
                  size="lg"
                  py={7}
                  type="submit"
                    isLoading={isSubmitting()}
                  rightIcon={<HiOutlineChevronRight />}
                  loadingText="Submitting..."
                >
                  Submit
                </Button>
              </Grid>
              <Text fontSize="sm" fontWeight="bold">
                {" "}
                Already have an account?{" "}
                {/* @ts-ignore */}
                <Link color="primary" to="/">
                  Login
                </Link>
              </Text>
            </Box>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default SignUp;
