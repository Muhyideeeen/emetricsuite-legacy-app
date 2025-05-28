
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
import {useHistory } from "react-router-dom";
const ComingSoon =()=>{

    const history = useHistory();


    return (
      <div style={{
        "height":'100vh',
        "display":"flex",
        "alignItems":"center",
        "justifyContent":"center"
    }}>
         <h1 style={{"fontSize":"2rem"}}>Coming Soon..</h1>
    </div>
    )
}

export default ComingSoon