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
import React from "react";

import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import { Objective as ObjectiveType, PerspectiveSchema } from "../redux/objective/objectiveSlice";
import { ActiveInitiativeType } from "../redux/objective/objectiveSlice";
//this is the Main Details
const ObjectiveDetails:React.FC<ObjectiveType>=(props)=>{
    console.log('flowol..',props.active_initiative)
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
                  Perspectives 
              </Tab>
            </TabList>
  
            <TabPanels>
              <TabPanel>
                  <ObjectiveDetail
                    name={props.name}
                    objective_status={props?.objective_status?props?.objective_status:"None"}
                    routine_option={props?.routine_option}
                    routine_round={props.routine_round?props.routine_round:0}
                    objective_id={props.objective_id?props.objective_id:"None.."}
                    target_point={props.target_point}
                    start_date={props.start_date}
                    end_date={props.end_date}
                    task_type={props.task_type}
                  />
              </TabPanel>
              

           

            <TabPanel>
                {/* <p>Hello Perspectisves</p> */}
               <ConnectedPerspectives
               perspectives={props.perspectives}
               totalTargetPoint={props.target_point}
               />
            </TabPanel>

            </TabPanels>
          </Tabs>
        </DrawerBody>


        </>
    )
}
export default ObjectiveDetails


const ObjectiveDetail:React.FC<{
    "name":string;
    "objective_status":string;
    "routine_option":string;
    "routine_round":number;
    "objective_id":string;
    "target_point":string;
    "start_date":string;
    "end_date":string;task_type:string;
}> =({
    name,objective_status,routine_option,task_type,
    routine_round,objective_id,target_point,start_date,end_date
})=>{

    
    return (
        <Box>
            <Box mb="4">
            <Text fontWeight="semibold">Name</Text>
            <Text fontSize="smaller">{name}</Text>
          </Box>

            <Box>
              <Text mb={1} fontWeight="semibold">
               Objective Status
              </Text>
              <Text as="small" color="gray.500">
                {objective_status}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Routine Option
              </Text>
              <Text as="small" color="gray.500">
                { routine_option }
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Routine Round
              </Text>
              <Text as="small" color="gray.500">
                 {routine_round}
                 </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb="1">
               Target Point
              </Text>
              <Text as="small" color="gray.500">
                  { target_point }
                 </Text>
            </Box>





        <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">

            <Box>
              <Text fontWeight="semibold" mb="1">
                Start Date
              </Text>
              <Text as="small" color="gray.500">
                 {start_date}
                 </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb="1">
               End Date
              </Text>
              <Text as="small" color="gray.500">
                  { end_date }
                 </Text>
            </Box>
          </Grid>
</Box>
    )
} 


const ObjectiveOwnerDetails:React.FC<{
    first_name:string;
    last_name:string;
    phone_number:string;
    email:string;
}>=(props)=>{

        return (
            <Box>
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
            <Box>
              <Text mb={1} fontWeight="semibold">
              First Name
              </Text>
              <Text as="small" color="gray.500">
                {props.first_name}
              </Text>
            </Box>
            <Box>
              <Text mb={1} fontWeight="semibold">
                Last Name
              </Text>
              <Text as="small" color="gray.500">
                { props.last_name }
              </Text>
            </Box>
            <Box>
              <Text fontWeight="semibold" mb="1">
                Phone Number
              </Text>
              <Text as="small" color="gray.500">
                 {props.phone_number}
                 </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb="1">
               Email
              </Text>
              <Text as="small" color="gray.500">
                  { props.email }
                 </Text>
            </Box>
          </Grid>
</Box>
        )
}

const ActiveInitiative=({active_initiatives}:{"active_initiatives":ActiveInitiativeType[]})=>{
        console.log(active_initiatives,"from me")
    return(
        <>
        
            {
                active_initiatives.length==0?<p>There is no Active Initiative</p>:
                active_initiatives.map((data:ActiveInitiativeType)=>{

                    return (
                        <Box>
                            <Heading as="h5" size="sm" color="primary" mb="4">
                            Initiative Information
                        </Heading>
                        <Box mb="4">
                        <Text fontWeight="semibold">Name</Text>
                        <Text fontSize="smaller">{data.name}</Text>
                      </Box>
                    <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
                        <Box>
                          <Text mb={1} fontWeight="semibold">
                          Target Point
                          </Text>
                          <Text as="small" color="gray.500">
                              {data.target_point}
                          </Text>
                        </Box>
                        <Box>
                          <Text mb={1} fontWeight="semibold">
                          Routine Round
                          </Text>
                          <Text as="small" color="gray.500">
                                {data.routine_round}
                          </Text>
                        </Box>

                      </Grid>
                        </Box>
                    )
                })
            }
        </>
    )

}

const ConnectedPerspectives=({perspectives,totalTargetPoint}:{perspectives:PerspectiveSchema[],totalTargetPoint:string;})=>{

    return (
        <>
        {
            perspectives.map((data:PerspectiveSchema)=>(
                <Flex justifyContent={"space-between"}>
                
                      
                      <Text  color="gray.500">
                        {data.perspective.name}
                      </Text>
                    
                   
                      
                      <Text as="small" color="gray.500">
                        { data.objective_perspective_point }
                      </Text>
                    
        
                </Flex>
            ))

        }
        <Box style={{backgroundColor:"#0000ff4f","height":"2px",
        width:"100%","margin":".8rem 0","borderRadius":"10px"}}> </Box>
             <Flex justifyContent={"space-between"}>
                      <Text mb={1} fontWeight="semibold">
                       Total Target
                      </Text>
                      <Text as="small" color="gray.500">
                        { totalTargetPoint}
                      </Text>
              </Flex >
        </>
    )
}