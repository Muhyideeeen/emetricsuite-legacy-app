import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Stack,Button,useToast
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import AddCareerPath from "../../drawers/AddCareerPath";
import UpdateCareerPath from  "../../drawers/UpdateCareerPath"
//   import CareerPathViewContent from '../../drawers/CareerPath';
import CustomDrawer from "../../drawers/CustomDrawer";
import {
  CareerPath as CareerPathSchema,
  deleteCareerPath,
  getCareerPaths,
} from "../../redux/careerPath/careerPathAPI";
import { useErrorHandler } from "react-error-boundary";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCareerPath } from "../../redux/careerPath/careerPathSlice";
import UploadCareerpath from "../../drawers/uploadCareerpath";
import { useDispatch } from "react-redux";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import Preloader from "../../components/Preloader";
import PaginatedItems from "../../components/Pagination/Pagination";

const CareerPath = () => {

   //pagination states
   const [pageNum,setPageNum] = useState(1);
   //end pagination states

   const handleError = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { status, careerPaths ,
    count:NumOfData,errorMessage,num_of_page
  } = useAppSelector(selectCareerPath);

  useEffect(() => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {
      dispatch(getCareerPaths({ORG_NAME,pagenum:pageNum,handleError}));
    }
  }, []);
  useEffect(()=>{
    // if(status==='succeeded'){
    //   const ORG_NAME = localStorage.getItem("current_organization");
    //   if (ORG_NAME) {
    //     dispatch(getCareerPaths({ORG_NAME,pagenum:pageNum}));
    //   }
    // }
    if(status==="deleted"){
     
      toast({
        title:"Deleted Successfully",
        // "description":description,
        status: "success",
      position: "top",
      duration: 5000,
      isClosable: true,
      })
    }

    // if(status==="failed"){
     
    //   toast({
    //     title:errorMessage,
    //     // "description":description,
    //     status: "error",
    //   position: "top",
    //   duration: 5000,
    //   isClosable: true,
    //   })
    // }

  },[status])
  const ORG_NAME = localStorage.getItem("current_organization_short_name");
  useEffect(()=>{
    if (ORG_NAME) {
      dispatch(getCareerPaths({ORG_NAME,pagenum:1,handleError}));
    }

  },[])
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
          fontSize="xs"
        >
          Showing {careerPaths.length} of {NumOfData} Career Path
        </Text>

        <Stack direction="row" spacing={4}>
          <CustomDrawer
            showModalBtnText="Add Career Path/Grade Level"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <AddCareerPath />
          </CustomDrawer>
          {/* <CustomDrawer
            showModalBtnText="Edit Career Path/Grade Level"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <h1>hELLO world</h1>
          </CustomDrawer> */}


          <CustomDrawer
            showModalBtnText="Upload Career Path/Grade Level"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
          <UploadCareerpath/>
          </CustomDrawer>


        </Stack>
      </Flex>

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.200">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th  py="5"  style={{"textTransform":"capitalize"}}>Name of Grade Level</Th>
            <Th  style={{"textTransform":"capitalize"}}>Grade Level</Th>
            <Th  style={{"textTransform":"capitalize"}}>Educational Qualification</Th>
            <Th  style={{"textTransform":"capitalize"}}>Age Range</Th>
            <Th  style={{"textTransform":"capitalize"}}>Experience Required (Years)</Th>
            <Th  style={{"textTransform":"capitalize"}}>Position Lifespan</Th>
            <Th  style={{"textTransform":"capitalize"}}>Slots available</Th>
            <Th  style={{"textTransform":"capitalize"}}>Annual Package</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              <Td>
                <Text><Preloader /></Text>
              </Td>
            </Tr>
          ) : careerPaths.length === 0 ? (
            <Tr style={{"textTransform":"capitalize"}}>
              <Td>
                <Text as="h1">No Career Paths available. Add Career Path.</Text>
              </Td>
            </Tr>
          ) : (
            careerPaths.map((path, index) => (
              <Tr key={path.career_path_id}>
                <Td fontSize="xs" textTransform="capitalize">
                  {path.name}
                </Td>
                <Td fontSize="xs">{path.level}</Td>
                <Td fontSize="xs">{path.educational_qualification}</Td>
                <Td fontSize="xs">
                  {path.min_age} - {path.max_age} years
                </Td>
                <Td fontSize="xs">{path.years_of_experience_required}</Td>
                <Td fontSize="xs">{path.position_lifespan}</Td>
                <Td fontSize="xs">{path.slots_available}</Td>
                <Td fontSize="xs">{path.annual_package}</Td>
                {/* <Td>
                  <CustomDrawer
                    showModalBtnText="View"
                    showModalBtnColor="primary"
                    drawerSize="sm"
                  >
                    <h1>Hello</h1>
                    <CareerPathViewContent />
                  </CustomDrawer>
                </Td> */}
                <Td>
                <CustomDrawer
            showModalBtnText=""
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<RiSendPlaneFill />}
            drawerSize="xs"
          >
            {/* <p>efhehfuo</p> */}
            <UpdateCareerPath {...path}/>
          </CustomDrawer>
                </Td>

                <Td>
                  <Button
                 loadingText=""
                 isLoading={status==="deleting"}
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>{
      if(window.confirm("Are Sure You Want to Delete")){
        dispatch(deleteCareerPath({"uuid":path.career_path_id}))
      }
                  }}
                  ></Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      
        <PaginatedItems
          pageCount={num_of_page}
          onPageClick={(pageNumberClick)=>{
            if (!ORG_NAME) return 
      dispatch(getCareerPaths({ORG_NAME,pagenum:pageNumberClick,handleError}));
          }}
          
        />
    </Box>
  );
};

export default CareerPath;
