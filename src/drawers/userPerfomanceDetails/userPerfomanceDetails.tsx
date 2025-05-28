import {
    DrawerBody,
    Flex,
    Text,
    Box,
    DrawerCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading,Tooltip
  } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import { HumanPerformanceDataTablePropsType } from "../../components/HumanPerformanceDataTable";
import QualitytargetPoint from "./userPerformanceTableDetail/QualitytargetPoint";
import Quantitytargetpoint from "./userPerformanceTableDetail/Quantitytargetpoint";
import SytemBasedRating from "./userPerformanceTableDetail/SytemBasedRating";
import TargetPoint from "./userPerformanceTableDetail/TargetPoint";
import TurnAroundTimeAnalysis from "./userPerformanceTableDetail/turnAroundTimeAnalysis";


export const UserPerfomanceDetails:React.FC<{data:HumanPerformanceDataTablePropsType}>=({data})=>{
     console.log({data})
    return(
        <DrawerBody w="100%" mx="auto">
        <Flex alignItems="baseline">
                <DrawerCloseButton
                as={HiOutlineChevronLeft}
                display="block"
                position="relative"
                />
                <Text mt={-1} ml={5} fontSize="lg">
                
                </Text>
          </Flex>
<br />

     <TurnAroundTimeAnalysis data={data}/>

<br />


<Quantitytargetpoint data={data} />

      
<br />
<QualitytargetPoint data={data}/>




       


<br />
<TargetPoint data={data} />

<br />
<SytemBasedRating data={data} />

        </DrawerBody>

    )
}


const PointListiing:React.FC<{data:any,name:string}>=({data,name})=>{

    const [title,setTitle]=useState<string[]>();
    useEffect(()=>{
        setTitle(
            Object.keys(data).filter(key=>{

                return key.includes(name)
            })
        )
    },[])
    console.log(title)
    if(name==='target_point'){
        return(
            <>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Target Point
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["target_point"]}
            </Text>
            </Flex>
            <br />

            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Target Point Achieved
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["target_point_achieved"]}
            </Text>
            </Flex>
            <br />


            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Percentage Target Point Achieved
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["percentage_target_point_achieved"]}
            </Text>
            </Flex>
            <br />

            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Cumulative Target Point
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["cumulative_target_point"]}
            </Text>
            </Flex>
            <br />

            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Cumulative Target Point Achieved
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["cumulative_target_point_achieved"]}
            </Text>
            </Flex>
            <br />

            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            Percentage Cumulative Target Point Achieved
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data["percentage_cumulative_target_point_achieved"]}
            </Text>
            </Flex>
            <br />

</>
        )
    }
    return (
        <>
            <br />

        <Box>
            {
                title?.map((info:any)=>(
<>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontWeight="light" mb="1">
            {info.replaceAll("_"," ")}
            </Text>
            <br />
            <Text as="small" color="gray.500">
                {data[info]}
            </Text>
            </Flex>
            <br />
</>
                ))
            }
        </Box>
        <br />

    </>
    )
}