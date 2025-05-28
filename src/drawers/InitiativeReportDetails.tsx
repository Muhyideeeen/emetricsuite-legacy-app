import { InitiativeReportType } from "../pages/Reports/InitiativeReport";
import {
    DrawerBody,
    DrawerHeader,
    Flex,
    Text,
    Box,
    Button,
    Stack,
    DrawerCloseButton,
    Heading,
    Grid,
    } from "@chakra-ui/react";
    import { HiOutlineChevronLeft } from "react-icons/hi";

const InitiativeReportDetail=(props:any)=>{
    // :React.FC<InitiativeReportType>
console.log(props)

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
                Report Details
            </Text>
          </Flex>
                {
                Object.keys(props).map((key)=>{

                    if(key.includes("task_id")||key.includes("name")){
                        return ""
                    }

                    return (
                        <>
                                            <br />
                                                    <Box>
                                                    <Flex justifyContent={"space-between"}>
                                                    <Text fontWeight="light" mb="1">
                                                   {key.replaceAll("_"," ").toUpperCase()}
                                                    </Text>
                                                    <Text as="small" color="gray.500">
                                                    {props[key]} 
                                                    0
                                                    </Text>
                                                    </Flex>
                                                    </Box>
                        </>
                                        )
                })
                }
          </DrawerBody>
        
        </>
    )
}


export default InitiativeReportDetail



// <br />
// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Cumulative Turn Around Time Target Point
// </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_turn_around_time_target_point}
// </Text>
// </Flex>
// </Box>



// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Cumulative Turn Around Time Target Point Achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_turn_around_time_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Percentage Cumulative Turn Around Time Target Point Achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.percentage_cumulative_turn_around_time_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
//     Quantity Target Unit
// </Text>
// <Text as="small" color="gray.500">
// {props.quantity_target_unit}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Quantity Target Point
// </Text>
// <Text as="small" color="gray.500">
// {props.quantity_target_point}
// </Text>
// </Flex>
// </Box>
// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Quantity Target point Achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.quantity_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// Quantity Target Unit Achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.quantity_target_unit_achieved}
// </Text>
// </Flex>
// </Box>

// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// percentage quantity target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.percentage_quantity_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// cumulative quantity target point         </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_quantity_target_point}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// cumulative quantity target point achieved        </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_quantity_target_point_achieved}
// </Text>
// </Flex>
// </Box>

// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// percentage cumulative quantity target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.percentage_cumulative_quantity_target_point_achieved}
// </Text>
// </Flex>
// </Box>




// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// quality target point
// </Text>
// <Text as="small" color="gray.500">
// {props.quality_target_point}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// quality target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.quality_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// percentage quality target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.percentage_quality_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// cumulative quality target point
// </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_quality_target_point}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// cumulative quality target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.cumulative_quality_target_point_achieved}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// percentage cumulative quality target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.percentage_cumulative_quality_target_point_achieved}
// </Text>
// </Flex>
// </Box>

// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// target point
// </Text>
// <Text as="small" color="gray.500">
// {props.target_point}
// </Text>
// </Flex>
// </Box>


// <Box>
// <Flex justifyContent={"space-between"}>
// <Text fontWeight="semibold" mb="1">
// target point achieved
// </Text>
// <Text as="small" color="gray.500">
// {props.target_point_achieved}
// </Text>
// </Flex>
// </Box>