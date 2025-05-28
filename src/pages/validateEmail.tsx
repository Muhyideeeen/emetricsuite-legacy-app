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
  Button
} from "@chakra-ui/react";

import SignUpIllustration from "../assets/images/signup-illustration.svg";
import Logo from "../assets/images/logo.png";

interface Data {
  status: null | number;
  data: [];
  message: string;
}

const ValidateEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>({status: null, data: [], message: ""});
  const [error, setError] = useState("");

  const location = useLocation();

  const validateUserEmail = async (key: string) => {
    try {
      const response = await axios.post(`/auth/validate-email/`, { key });
      console.log({response,key})
      setIsLoading(false);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setIsLoading(false);
      setError("There was an error");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // retrieve the key from the query string in the url
    const key = new URLSearchParams(location.search).get("key");
    if (key) {
      validateUserEmail(key);
    }
  }, []);

  if (error) {
    return <h1>{error}</h1>;
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
        {isLoading ? (
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
        )}
      </Flex>
    </Flex>
  );
};

export default ValidateEmail;
