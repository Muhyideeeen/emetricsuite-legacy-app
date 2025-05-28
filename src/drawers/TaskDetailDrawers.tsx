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
import moment from "moment";
import {Task as TaskType} from "./../redux/Task/taskSlice" 
import { string_or_null } from "./../drawers/JdDetailDrawer"

const TaskDetailDrawers:React.FC<TaskType> =(props)=>{


    return (
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
                Target
              </Tab>
            </TabList>

<TabPanels>
            <TabPanel>    
               <TaskDetail 
              name={props.name}
              task_type={props.task_type}
              routine_round={props.routine_round}
              start_date={props.start_date}
              start_time={props.start_time}
              duration={props.duration}
              routine_option={props.routine_option}
              repeat_every={props.repeat_every}
              occurs_days={props.occurs_days}
              occurs_month_day={props.occurs_month_day}
            occurs_month_day_number={props.occurs_month_day_number}
               occurs_month_day_position={props.occurs_month_day_position}
               end_date={props.end_date}
               after_occurrence={props.after_occurrence}
               task_status={props.task_status}
               target_brief={props.target_brief}
               turn_around_time_target_point={props.turn_around_time_target_point}
               turn_around_time_target_point_achieved={props.turn_around_time_target_point_achieved}
               rework_limit={props.rework_limit}
               rework_remark={props.rework_remark}
               rework_end_date={props.rework_end_date}
               rework_end_time={props.rework_end_time}
               quantity_target_unit={props.quantity_target_unit}
               quantity_target_unit_achieved={props.quantity_target_unit_achieved}
               quantity_target_point={props.quality_target_point}
               quality_target_point={props.quality_target_point}
               quality_target_point_achieved={props.quality_target_point_achieved}
               target_point={props.target_point}
               target_point_achieved={props.target_point_achieved}
               sensitivity_score={props.sensitivity_score}
               plagiarism_score={props.plagiarism_score}
               average_system_based_score={props.average_system_based_score}
               rating_remark={props.rating_remark}
               quantity_target_point_achieved={props.quantity_target_point_achieved}
               upline_initiative={props.upline_initiative}
               />          
 
            </TabPanel>

            <TabPanel>
               <TaskTarget
quantity_target_unit={props.quantity_target_unit}
quantity_target_unit_achieved={props.quantity_target_unit_achieved}
quantity_target_point={props.quantity_target_point}
quantity_target_point_achieved={props.quantity_target_point_achieved}
quality_target_point={props.quality_target_point}


quality_target_point_achieved={props.quality_target_point_achieved}
target_point_achieved={props.target_point_achieved}
turn_around_time_target_point={props.turn_around_time_target_point}
turn_around_time_target_point_achieved={props.turn_around_time_target_point_achieved}


               />
            </TabPanel>
</TabPanels>         



          </Tabs>
        </DrawerBody>

    )
}

export default TaskDetailDrawers
interface uplineInitativeType{
    name:string;
    owner:{
        "user_id":string;
        first_name:string;
        last_name:string;
        phone_number:string;
        email:string;
    },
    assignor: {
      "user_id": string;
      "first_name": string;
      "last_name": string;
      "phone_number":string;
      "email": string;
  },

}
interface TaskDetailType{
    name: string_or_null ;
    task_type:string_or_null;
    "routine_round":string_or_null;
    "start_date": string_or_null;
    "start_time": string_or_null;
    "duration":string_or_null;
    "routine_option":string_or_null;
    "repeat_every":string_or_null;
    "occurs_days": number[];
    "occurs_month_day_number": string_or_null;
    "occurs_month_day_position": string_or_null;
    "occurs_month_day":string_or_null;
    "end_date": string_or_null;
    "after_occurrence": number;
    "task_status": string_or_null;
    "target_brief": string_or_null;
    "turn_around_time_target_point": string_or_null;
    "turn_around_time_target_point_achieved": string_or_null;
    "rework_limit": number;
    "rework_remark":string_or_null;
    "rework_end_date": string_or_null;
    "rework_end_time":string_or_null;
    "quantity_target_unit":string_or_null;
    "quantity_target_unit_achieved": string_or_null;
    "quantity_target_point": string_or_null;
    "quantity_target_point_achieved": string_or_null;
    "quality_target_point":string_or_null;
    "quality_target_point_achieved": string_or_null;
    "target_point": string_or_null;
    "target_point_achieved": string_or_null;
    "sensitivity_score": string_or_null;
    "plagiarism_score":string_or_null;
    "average_system_based_score": string_or_null;
    "rating_remark": string_or_null;
    upline_initiative:uplineInitativeType;
}
const TaskDetail:React.FC<TaskDetailType> =(props)=>{
  const objectiveStyleType ={'backgroundColor':"#0e62ff3b","color":'#262687f7',"padding":".1rem .9rem","borderRadius":"5px"};
  const cal_end_time = moment(props.start_time,"hh:mm A").add(moment.duration(props.duration))
  const end_time = `${cal_end_time.hour()}:${cal_end_time.minute()}:${cal_end_time.second()}`


    return(
        <>
{/* <Heading as="h5" size="sm" color="primary" mb="4">
          Basic Information
        </Heading> */}



<Stack spacing="6">
      <Box>
        {/* <Heading as="h5" size="sm" color="primary" mb="4">
          Basic Information
        </Heading> */}
        {/* <Box mb="4">
          <Text fontWeight="semibold">Profile</Text>
          <Text fontSize="smaller">
              {profile}
              </Text>
        </Box> */}
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
          <Box>
            <Text mb={1} fontWeight="semibold">
              Owner/Team
            </Text>
            <Text as="small" color="gray.500">
            {props.upline_initiative?.owner?.email}
            </Text>
          </Box>
          <Box>
            <Text mb={1} fontWeight="semibold">
              Task Assignor
            </Text>
            <Text as="small" color="gray.500">
            {props.upline_initiative?.assignor?.email}
             

            </Text>
          </Box>

        </Grid>

        <Box>
            <Text fontWeight="semibold" mb="1">
              Kpi
            </Text>
            <Text as="small" color="gray.500">
              {/* {dateOfBirth} */}
              {props.upline_initiative.name}

            </Text>
          </Box>
      </Box>

      <Box>
        {/* <Heading as="h5" size="sm" color="primary" mb="4">
          Contact Information
        </Heading> */}

        
          <Box mb="4">
            <Text fontWeight="semibold">Objective Type</Text>
        <Flex 
        alignItems={"center"}
        justifyContent={"space-between"}
        gap="5" mb="5"
        style={{"width":"80%"}}
        >

          {props.task_type==="qualitative"&&
          
          (

            <Text fontWeight="semibold"
        style={objectiveStyleType}
        >
          Qualitative
          </Text>

          )
          
          }
        
        {
          props.task_type==="quantitative"&&(
            <Text
            fontWeight="semibold"
            style={objectiveStyleType}
            >Quantitative</Text>
          )
        }

{
          props.task_type==="quantitative_and_qualitative"&&(
            <Text fontWeight="semibold"
        style={objectiveStyleType}
        >Quantitative & Qualitative</Text>

          )
        }

        
        </Flex>
          </Box>
        {/* <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5"> */}
          <Box>
            <Text mb={1} fontWeight="semibold">
              Department
            </Text>
            <Text as="small" color="gray.500">
              None
            </Text>
          </Box>
         
          <Box>
            <Text fontWeight="semibold" mb="1">
              Routine Option
            </Text>
            <Text as="small" color="gray.500">
              {props.routine_option}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              Duration
            </Text>
            <Text as="small" color="gray.500">
              {props.duration}
            </Text>
          </Box>
        {/* </Grid> */}
      </Box>



      <Box>
            <Text mb={1} fontWeight="semibold">
              Rework Options
            </Text>
            <Text as="small" color="gray.500">
              {props.rework_limit?props.rework_limit:"Nill"}
            </Text>
          </Box>


      <Box>
        {/* <Heading as="h5" size="sm" color="primary" mb="4">
          Employment Information
        </Heading> */}
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap="5" mb="5">
         
          <Box>
            <Text mb={1} fontWeight="semibold">
             Start Date
            </Text>
            <Text as="small" color="gray.500">
              {props.start_date}
            </Text>
          </Box>
        
          <Box>
            <Text mb={1} fontWeight="semibold">
             StartTime
            </Text>
            <Text as="small" color="gray.500">
              {props.start_time}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="1">
              End Date
            </Text>
            <Text as="small" color="gray.500">
              {props?.end_date}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb="1">
              End Time 
            </Text>
            <Text as="small" color="gray.500">
              {end_time}
        
            </Text>
          </Box>
        </Grid>
      </Box>
    </Stack>
        </>
    )
}


interface TaskTargetType{
    "quantity_target_unit":string_or_null;
    "quantity_target_unit_achieved": string_or_null;
    "quantity_target_point": string_or_null;
    "quantity_target_point_achieved": string_or_null;
    "quality_target_point":string_or_null;
    "quality_target_point_achieved": string_or_null;
    "target_point_achieved": string_or_null;
    "turn_around_time_target_point": string_or_null;
    "turn_around_time_target_point_achieved": string_or_null;

}
const TaskTarget:React.FC<TaskTargetType>=(props)=>{



    return (
        <>
        <Box>
            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Quantity Target Unit
            </Text>
            <Text as="small" color="gray.500">
              {props.quantity_target_unit?props.quantity_target_unit:"NiL.."}
            </Text>
            </Flex>

          <br/>
            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
              Turnaround Time Score Target
            </Text>
            <Text as="small" color="gray.500">
              {props.turn_around_time_target_point?props.turn_around_time_target_point:"NiL.."}
            </Text>
            </Flex>

<br />

            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Quantity Target Unit Achieved
            </Text>
            <Text as="small" color="gray.500">
              {props.quantity_target_unit_achieved?props.quantity_target_unit_achieved:"NiL.."}
            </Text>
            </Flex>

<br />

            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Quantity Target Point Achieved
            </Text>
            <Text as="small" color="gray.500">
              {props.quantity_target_point_achieved?props.quantity_target_point_achieved:"NiL.."}
            </Text>
            </Flex>
<br />


            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Quality Target Point
            </Text>
            <Text as="small" color="gray.500">
              {props.quality_target_point?props.quality_target_point:"NiL.."}
            </Text>
            </Flex><br />


            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Quality Target Point Achieved
            </Text>
            <Text as="small" color="gray.500">
              {props.quality_target_point_achieved?props.quality_target_point_achieved:"NiL.."}
            </Text>
            </Flex>
<br />

            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Target Point Achieved
            </Text>
            <Text as="small" color="gray.500">
              {props.target_point_achieved?props.target_point_achieved:"NiL.."}
            </Text>
            </Flex>

<br />
            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Turn Around Time Target Point
            </Text>
            <Text as="small" color="gray.500">
              {props.turn_around_time_target_point?props.turn_around_time_target_point:"NiL.."}
            </Text>
            </Flex>



<br />
            <Flex justifyContent={"space-between"}>
            <Text fontWeight="semibold" mb="1">
            Turn Around Time Target Point Achieved
            </Text>
            <Text as="small" color="gray.500">
              {props.turn_around_time_target_point_achieved?props.turn_around_time_target_point_achieved:"NiL.."}
            </Text>
            </Flex>

        </Box>
        </>
    )
}