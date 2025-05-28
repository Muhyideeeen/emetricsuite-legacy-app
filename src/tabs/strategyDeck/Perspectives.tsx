import { useState, useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Box,
  Text,
  Flex,
  Stack,Button, useToast,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import AddPerspective from "../../drawers/AddPerspective";
import CustomDrawer from "../../drawers/CustomDrawer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deletePerspective, getPerspectives } from "../../redux/perspective/perspectiveAPI";
import { selectPerspective } from "../../redux/perspective/perspectiveSlice";
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
import UploadPerpective from "../../drawers/UploadPerpective";
import Update_perspective from "../../drawers/Update_perspective";
// GrFormPreviousLink
import {useErrorHandler} from "react-error-boundary";
import Preloader from "../../components/Preloader";

const Perspectives = () => {
  //pagination states
   const handleError = useErrorHandler()
  const [pageNum,setPageNum] = useState(1);
  //end pagination states

  const dispatch = useAppDispatch();
  const { 
status, perspectives,deletedPerspective,message
, count:NumOfData,
next:nextPage,previous:previousPage

  } = useAppSelector(selectPerspective);
  // const [ORG_NAME,setORG_NAME]=useState()
  // const [allPerspectives,setAllPerspectives]  = useState<any[]>([])
  const toast = useToast()
  const toastIdRef = useRef()


  useEffect(() => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {
      dispatch(getPerspectives({ORG_NAME,"pagenum":pageNum,handleError}));
    }
  }, [pageNum,]);

  useEffect(()=>{

    if(status =='added'||status=='succeeded'){
      console.log(perspectives,"WWOW")
        if(message){
          toast({
            title: message,
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
          })
        }
      
    }

    if(status==='deleted'){
      console.log('from deleted',)
      // setAllPerspectives([...perspectives.filter(data=>deletedPerspective?.perspective_id!==data.perspective_id)])
      
      if(message){
        toast({
          title: `"${deletedPerspective?.name}" Deleted!`,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
      }
    }


    return ()=>{

      toast.closeAll()
    }

  },[status])

  const removePerspective=(perspective:any)=>{
    // console.log(perspective,'item')
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {
      // dispatch(getPerspectives(ORG_NAME));
      if(window.confirm("Are Sure You Want to Delete")){
        dispatch(deletePerspective({ORG_NAME,perspective}))
      }
    }
    
  }

  // const updatePerspective=(perspective:any)=>{
  //   const ORG_NAME = localStorage.getItem("current_organization");
  //   if (ORG_NAME) {
  //     // dispatch(getPerspectives(ORG_NAME));
  //     dispatch(UpdatePerspective({ORG_NAME,perspective}))
  //   }
    
  // }
 
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          Showing {perspectives.length!==0?perspectives.length:0} of {NumOfData?NumOfData:0} Perspectives
        </Text>

        <Stack direction="row" spacing={4}>
          <CustomDrawer
          
            showModalBtnText="Add New Perspective"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="xs"
          >
            <AddPerspective />
          </CustomDrawer>
          <CustomDrawer
            showModalBtnText="Upload Perspective"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
          >
            <UploadPerpective />
          </CustomDrawer>
        </Stack>
      </Flex>

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.100"
  style={{"textTransform":"capitalize"}}
        >
          <Tr style={{"textTransform":"capitalize"}}>
            <Th py="3"
              style={{"textTransform":"capitalize"}}
             >Name of Perspective</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            >Target Point</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            >Achieved Points</Th>
            <Th
              style={{"textTransform":"capitalize"}}
            >Achieved Rating (%)</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {status === "loading" ? (
            <>
            <Preloader />
            </>
            // <Tr>
            //   <Td>
            //     {/* <Text>Loading...</Text> */}
            //   </Td>
            // </Tr>
          ) : !perspectives.length ? (
            <Tr>
              <Td>
                <Text>
                  No Perspectives found. Please create/upload perspectives
                </Text>
              </Td>
            </Tr>
          ) : (
            perspectives.map((perspective, index) => (
              <Tr key={index} style={{"textTransform":"capitalize"}}>
                <Td fontSize="smaller">{perspective.name}</Td>
                <Td>{perspective.target_point}</Td>
                <Td>0</Td>
                <Td>0</Td>
                
               
              <Td>
              <CustomDrawer
            showModalBtnText=""
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<RiSendPlaneFill />}
            drawerSize="xs"
          >
            <Update_perspective perspective={perspective}/>
          </CustomDrawer>
              </Td>
                {/* <Td><Button
                
                
                leftIcon={<RiSendPlaneFill />}
                // mb="2"
                // bg="secondary.200"
                // variant="solid"
                >
                      Update
                  </Button>
                  </Td> */}
                <Td>
                  <Button
                  leftIcon={<RiDeleteBinLine/>}
                  onClick={(e)=>removePerspective(perspective)}
                  ></Button>
                </Td>

              </Tr>
            ))
          )}
        </Tbody>
      </Table>



<Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button>
    </Box>
  );
};

export default Perspectives;
