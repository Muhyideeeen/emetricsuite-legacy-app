
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
  import SignUpIllustration from "../../assets/images/signup-illustration.svg";
  import Logo from "../../assets/images/logo.png";
  
  const SomethingWentWrong =()=>{
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
               Something Went Wrong 
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {/* Click{" "} */}
                <p>Check your internet connections</p>
                <br />

               
                  <Button variant="primary" onClick={(e)=>{
                        window.location.reload()
                  }}>Refresh</Button>
             {" "}
                <a 
                // as={ReactLink} 
                href="/">
                  <Button variant="primary">Re-login</Button>
                </a>{" "}
                {/* to proceed to login */}
                <br />

               
              </AlertDescription>
            </Alert>
      
        </Flex>
      </Flex>
      )
  }
  
  
  export default SomethingWentWrong