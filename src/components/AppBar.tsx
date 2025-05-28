import { Box, Flex, Heading,Text, Image, Spacer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import EmetricImage from '../assets/images/logo.jpeg';
import axios from '../services/api';
import { getMyInfo } from '../services/auth.service';
import TypeVerifierUserChecker from '../utils/UserScreenAuthentication';
interface AppBarProps {
  heading: string;
  avatar: string;
  imgAlt: string;
}

const AppBar: React.FC<AppBarProps> = ({ heading, avatar, imgAlt }) => {
  let firstName:string;
  

    let org_Image=localStorage.getItem("org_info")
    let fullNameObj = localStorage.getItem("userNames")
    if(org_Image){
      org_Image= JSON.parse(org_Image)?.company_logo
    }
    else{
      org_Image=null
    }
    if(fullNameObj){
      firstName = JSON.parse(fullNameObj).first_name
    }
    else{
      firstName=""
    }


    const [employee,setEmployee] = useState<any>(null);
    const [isLoading,setisLoading] = useState(false);
    const loggedInEmployeeUUid:any = getMyInfo()

    const getLoggedinEmployee = async()=>{
      const org_name  = localStorage.getItem("current_organization_short_name"); 
      if(!org_name) return
      if(!loggedInEmployeeUUid) return
      // /client/{{ORGANISATION_NAME}}/employee/
      setisLoading(true)
      try{
           const resp = await axios.get(`/client/${org_name}/employee/?user__email=${loggedInEmployeeUUid?.email}`)
           console.log({
               'bluck':resp
           })

           setEmployee(resp.data.data[0])
      setisLoading(false)
      localStorage.setItem('employee_image',resp.data.data[0].employee_basic_information.profile_picture?resp.data.data[0].employee_basic_information.profile_picture:'')

      }catch(err:any){
              console.log({
                  err
              })
              setisLoading(false)
      
          }
          setisLoading(false)

  }
  useEffect(()=>{
      const employeeImage  =localStorage.getItem('employee_image')
      if(TypeVerifierUserChecker(['employee','team_lead',],'client_tokens')){
        console.log({employeeImage})
        if(employeeImage==null||employeeImage==''){
          console.log('bluck')
          getLoggedinEmployee()
        }
       }

  },[])

  const getImage = ():string =>{          
      const data = localStorage.getItem('employee_image');
      if(data){
        return data
      }
      return EmetricImage
    
  }
    return (
    <Box as="header" py="6">
      <Flex align="center">
      <Heading as="h2" fontSize="lg">
        
      <span style={{"color":"rgb(22 59 129)","textTransform":"capitalize"}}>{firstName?`${firstName}'s `:""}</span> {heading}
      </Heading>

      <Spacer />
      
      {/* <Text >
    Welcome back 
      </Text> */}
      {/* <Spacer /> */}
      <Box style={{'border':'1px solid #0b3178','borderRadius':'50%','width':'70px'}}>
        <Image src={getImage()} boxSize="70px" style={{'borderRadius':'50%'}} alt={imgAlt} />
      </Box>
      </Flex>
    </Box>
  );
};

export default AppBar;
