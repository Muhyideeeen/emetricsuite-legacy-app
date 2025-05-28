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
  Stack,
  Link,Button,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import AddTaskSpread from "../../drawers/AddTaskSpread";
import CustomDrawer from "../../drawers/CustomDrawer";
import axios from "../../services/api";
import { useEffect,useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectJdIntiatives } from "../../redux/jdsAndIntiatives/jdsAndIntiativesSlice";
import {GrFormNextLink,GrFormPreviousLink} from "react-icons/gr"
const JDTaskSpread = () => {

    //pagination states
    const [pageNum,setPageNum] = useState(1);
    // NumOfData nextPage previousPage
    const [NumOfData,setNumOfData]=useState(0);
    const [nextPage,setNextPage]=useState<string|null>(null);
    const [previousPage,setPreviousPage]=useState<string|null>(null);
    const [maxLengthOFTask,setMaxLengthOFTask] = useState<number>();
    //end pagination states
  
    const [TabIndex,setTabIndex]= useState<number>(0)
  
    const { status, message, errorMessage } =useAppSelector(selectJdIntiatives)
      //this st
     const [initiatives,setInitiatives] = useState<any>([]=[])
  
    const [isLoading, setIsLoading] = useState(false);
  
  
  
  
    const getInitiatives=async (pagenum=1)=>{
      setIsLoading(true)
      const ORG_NAME = localStorage.getItem("current_organization_short_name");
  
      try {
        //generalUrl
        let url:string;
        //ownerUrl
        // url =`/client/${ORG_NAME}/initiative/?owner_email=${getLoggedin_userEmail()}&page=${pagenum}`
        url =`/client/${ORG_NAME}/initiative/?page=${pagenum}`
        
        const response = await axios.get(url);
     console.log(
       response.data
     )
        setInitiatives(response.data.data);
        setMaxLengthOFTask(response.data.data.map((i:any)=>i.tasks.length).reduce((prev:any,next:any)=>{
          return prev+next},0))
        setNumOfData(response.data.count);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
  
      setIsLoading(false)
      } catch (err: any) {
        console.log(err);
        setInitiatives([]);
  
      setIsLoading(false)
  
      }
  
    }
  
  
  
    useEffect(() => {
      //this effect will take place when we click on next page and ownersofInitiative is updated
      getInitiatives(pageNum,)
  
      // ownersofInitiative
    }, [pageNum,])
  
    useEffect(() => {
      //this only get initiatives only when the status is any of them below
      console.log(status)
      if(status==='succeeded' || status==='added'){
        getInitiatives()
  
      }
    }, [status,])

    console.log(
      maxLengthOFTask,"stuff"
    )
    
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          {/* Showing 10 of 40 JD Task Spread */}
        </Text>

        
      </Flex>

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th style={{"textTransform":"capitalize"}}>Name</Th>
            {/* <Th>Task 1</Th> */}
            <Th style={{"textTransform":"capitalize"}}>Cum cont Target PT.</Th>
            {
              maxLengthOFTask?
              [...Array(maxLengthOFTask)].map((data:any,index:any)=><Th key={index}  style={{"textAlign":"center","textTransform":"capitalize"}}>Task {index+1}</Th>)
           :<Th  style={{"textAlign":"center","textTransform":"capitalize"}}>Task 1</Th>
            }
          </Tr>
        </Thead>
        <Tbody>

        {isLoading?<p>Loading</p>:
          initiatives.length!==0?initiatives.map((initiative:any, index:number) => (
            <Tr key={index} style={{"textTransform":"capitalize"}}>
              <Td fontSize="smaller">{initiative.name}</Td>
              <Td>
                <Text textAlign="center" as="small">
                  {initiative.target_point}
                </Text>
              </Td>

              {
                initiative?.tasks.length!==0?
                initiative?.tasks.map((data:any)=>(
                  <Td style={{"textAlign":"center"}}>
                  <Stack
                  > 
                    <Link
                      textAlign="center"
                      fontSize="smaller"
                      display="block"
                      color="blue.500"
                      textDecoration="underline"
                      href="#"
                    >
                        {data?.name}
                    </Link>
                    <Text textAlign="center" as="small">
                      {data?.target_point}
                    </Text>
                  </Stack>
                </Td>
                ))
               :
               <Td >
                  <Stack >
                    <Link
                      textAlign="center"
                      fontSize="smaller"
                      display="block"
                      // color="blue.500"
                      textDecoration="underline"
                      href="#"
                      style={{"color":"gray"}}
                    >
                        NiL.
                    </Link>
                    <Text 
                      style={{"color":"gray"}}
                    
                    textAlign="center" as="small"  >
                      NiL
                    </Text>
                  </Stack>
                </Td>
              }
             
            </Tr>
          )):<p>you dont have a spread yet</p>}
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

export default JDTaskSpread;
