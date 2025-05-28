import {
    DrawerBody,
    DrawerHeader,
    Flex,
    Text,
    Image,
    Box,
    Button,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    DrawerCloseButton,
    Heading,
    Grid,
  } from "@chakra-ui/react";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
export type string_or_null =string|null

interface JdDetailType{
    "name": string;
    "upline_objective": {
        "name": string;
        "routine_option": string;
        "start_date": string;
        "end_date": string;
        "objective_id":string;
        "target_point":string;
    },
    "upline_initiative":{
        "name": string;
        "owner": {
        "user_id": string,
        "first_name": string,
        "last_name": string,
        "phone_number": string;
        "email":string;
    }}
    ;
    "assignor": null|string;
    "owner": {
        "user_id": string;
        "first_name": string;
        "last_name": string;
        "phone_number": string;
        "email": string;
    },
    "routine_option":string;
    "routine_round": number;
    "initiative_status":string;
    "start_date": string;
    "end_date": string;
    "after_occurrence": string;
    "initiative_brief":string;
    "target_point": string;
    "initiative_id":string;
}


export const JdDetailDrawer:React.FC<JdDetailType>=(props)=>{



    return (
        <>
      
  
        <DrawerBody w="85%" mx="auto">
        <Flex alignItems="baseline">
            <DrawerCloseButton
              as={HiOutlineChevronLeft}
              display="block"
              position="relative"
            />
            <Text mt={-1} ml={5} fontSize="lg">
             
            </Text>
          </Flex>
          <Tabs colorScheme="primary">
            <TabList>
              <Tab fontWeight="bold" color="gray.600" mr={8}>
                {/* <Image src={perspectivesIco} mr={2} /> */}
                Basic Info
              </Tab>
              <Tab fontWeight="bold" color="gray.600">
                {/* <Image src={folder} mr={2} /> */}
               Targets
              </Tab>

            </TabList>
  
            <TabPanels>
              <TabPanel>
                  <InitativeDetail 
                      name={props.name}
                      routine_option={props.routine_option}
                      initiative_status={props.initiative_status}
                      start_date={props.start_date}      
                      end_date={props.end_date}
                      after_occurrence={props.after_occurrence}
                      initiative_brief={props.initiative_brief}
                      target_point={props.target_point}
                      initiative_id={props.initiative_id}
                      ownerEmail={props.owner.email}
                  />
              </TabPanel>
              {/* <TabPanel>
              <InitiativeOwnerDetails
                    first_name={props.owner.first_name}
                    last_name={props.owner.last_name}
                    phone_number={props.owner.phone_number}
                    email={props.owner.email}
                />
            </TabPanel> */}

            {/* <TabPanel>    
                {
                    props?.upline_objective?
                    <ConnectedObjectiveUpline
                    name={props?.upline_objective.name}
                    start_date={props?.upline_objective.start_date}
                    end_date={props?.upline_objective.end_date}
                    routine_option={props?.upline_objective.end_date}
                    target_point={props?.upline_objective.target_point}
                  />
                    :
                    <p>Not Connected To any Objective</p>
                }                
 
            </TabPanel> */}
{/* 
            <TabPanel>
                {
                    props?.upline_initiative?
                <ConnectedIntiativeUpline
                name={props?.upline_initiative.name}
                owner_first_name={props?.upline_initiative.owner.first_name}
                owner_last_name={props?.upline_initiative.owner.last_name}
                owner_phone_number={props?.upline_initiative.owner.phone_number}
                owner_email={props?.upline_initiative.owner.email}
                />
                    :
                    <p>Not Connected To any Initiative</p>
                }
            </TabPanel> */}

            </TabPanels>
          </Tabs>
        </DrawerBody>
      </>   
    )
}

const InitiativeOwnerDetails:React.FC<{
first_name:string;last_name:string;phone_number:string;email:string;
}>=({
    first_name,last_name,phone_number,email
})=>{

    return (
<Box>
<Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
                First Name
              </Text>
              <Text as="small" color="gray.500">
                {first_name}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Last Name
              </Text>
              <Text as="small" color="gray.500">
                {last_name}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Phone Number
              </Text>
              <Text as="small" color="gray.500">
                  {phone_number}
                 </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb="1">
                Email
              </Text>
              <Text as="small" color="gray.500">
                  {email}
                 </Text>
            </Box>
          </Grid>
</Box>
    )
}

const InitativeDetail: React.FC<{
    name:string;
    routine_option:string;
    "initiative_status": string_or_null,
    "start_date": string_or_null,
    "end_date": string_or_null,
    "after_occurrence":string_or_null,
    "initiative_brief":string_or_null,
    "target_point": string,
    "initiative_id": string,ownerEmail:string|null;

  }> = ({  name,routine_option,initiative_status,start_date,end_date,after_occurrence,initiative_brief,target_point,initiative_id,ownerEmail}) => {
    return (
      <Stack spacing="6">


         <Box>
         <Text fontWeight="semibold">Owner</Text>
           <Text style={{color:"#626A77",textDecoration:"underline"}}>
              {ownerEmail}
           </Text>
         </Box>

        <Box>

         
          <Box mb="4">
            <Text fontWeight="semibold">Name</Text>
            <Text fontSize="smaller">{name}</Text>
          </Box>
          {/* <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5"> */}
            <Box>
              <Text mb={1} fontWeight="semibold">
                Routine Option
              </Text>
              <Text as="small" color="gray.500">
                {routine_option}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Current Status
              </Text>
              <Text as="small" color="gray.500">
                {initiative_status}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Brief
              </Text>
              <Text as="small" color="gray.500">
                ...danload me please
              </Text>
            </Box>
          {/* </Grid> */}
        </Box>
  

        <Box>
              <Text fontWeight="semibold" mb="1">
                After Occurence
              </Text>
              <Text as="small" color="gray.500">
                {after_occurrence?after_occurrence:"None"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Target Point
              </Text>
              <Text as="small" color="gray.500">
                {target_point}
              </Text>
            </Box>
        <Box>

          <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
                Start Date
              </Text>
              <Text as="small" color="gray.500">
               {start_date?start_date:"None"}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                End Date
              </Text>
              <Text as="small" color="gray.500">
               {end_date?end_date:"None"}
              </Text>
            </Box>

          </Grid>
        </Box>
  
        {/* <Box>
          <Heading as="h5" size="sm" color="primary" mb="4">
            Employment Information
          </Heading>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
                Date employed
              </Text>
              <Text as="small" color="gray.500">
                dateEmployed
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Date of last promotion
              </Text>
              <Text as="small" color="gray.500">
                25th October, 2019
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Name of upline
              </Text>
              <Text as="small" color="gray.500">
                Upline name
              </Text>
            </Box>
          </Grid>
        </Box> */}
      </Stack>
    );
  };

const ConnectedObjectiveUpline:React.FC<{
    name:string,routine_option:string_or_null,
    start_date:string_or_null,end_date:string_or_null,
    target_point:string_or_null
}>=(props)=>{


    return (

        <Stack spacing="6">
           
        <Box>
         
          <Box mb="4">
            <Text fontWeight="semibold">Name</Text>
            <Text fontSize="smaller">{props.name}</Text>
          </Box>
          {/* <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5"> */}
            <Box>
              <Text mb={1} fontWeight="semibold">
                Routine Option
              </Text>
              <Text as="small" color="gray.500">
                {props.routine_option}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Target Point
              </Text>
              <Text as="small" color="gray.500">
                {props.target_point}
              </Text>
            </Box>
        
          {/* </Grid> */}
        </Box>
  
        <Box>

          <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
                Start Date
              </Text>
              <Text as="small" color="gray.500">
               {props.start_date?props.start_date:"None"}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                End Date
              </Text>
              <Text as="small" color="gray.500">
               {props.end_date?props.end_date:"None"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                End Date
              </Text>
              <Text as="small" color="gray.500">
                {props.end_date?props.end_date:"None"}
              </Text>
            </Box>
            
          </Grid>
        </Box>
      </Stack>

    )
}




const ConnectedIntiativeUpline:React.FC<{
    name:string,owner_first_name:string_or_null,
    owner_phone_number:string_or_null,
    owner_last_name:string_or_null,
    owner_email:string_or_null
}>=(props)=>{


    return (

        <Stack spacing="6">
           
        <Box>
         
          <Box mb="4">
            <Text fontWeight="semibold">Name</Text>
            <Text fontSize="smaller">{props.name}</Text>
          </Box>
          <Heading as="h5" size="sm" color="primary" mb="4">
              Owner Of the Connected Initiative
           </Heading>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
                First Name
              </Text>
              <Text as="small" color="gray.500">
                {props.owner_first_name?props.owner_first_name:"None."}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Last Name
              </Text>
              <Text as="small" color="gray.500">
                {props.owner_last_name?props.owner_last_name:"None."}
              </Text>
            </Box>


            <Box>
              <Text mb={1} fontWeight="semibold">
                Email
              </Text>
              <Text as="small" color="gray.500">
                {props.owner_email?props.owner_email:"None."}
              </Text>
            </Box>

            <Box>
              <Text mb={1} fontWeight="semibold">
                Phone Number
              </Text>
              <Text as="small" color="gray.500">
                {props.owner_phone_number?props.owner_phone_number:"None."}
              </Text>
            </Box>
        
          </Grid>
        </Box>
  

      </Stack>

    )
}