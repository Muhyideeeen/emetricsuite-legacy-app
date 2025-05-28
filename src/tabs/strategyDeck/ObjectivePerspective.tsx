import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,Link,
  Text,
  Flex,
  Stack,Button,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import CustomDrawer from "../../drawers/CustomDrawer";
import AddObjectivePerspective from "../../drawers/AddObjectivePerspective";
import { useState,useEffect } from "react";
import axios from "../../services/api";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";
const ObjectivePerspective = () => {
  //pagination states
  const [pageNum,setPageNum] = useState(1);
  //end pagination states 
  const [all_perspective,setAll_perspective]= useState<any>([]=[])
  const [all_objective,setAll_objective]= useState<any>([]=[])
  const [isLoading,setIsLoading]= useState(true)
  const [next,setNext]= useState<string|null>('')
 
  // NumOfData nextPage previousPage
  const [NumOfData,setNumOfData]=useState(0);
  const [nextPage,setNextPage]=useState<string|null>(null);
  const [previousPage,setPreviousPage]=useState<string|null>(null);
  //end pagination states

  const getPerspective=  ()=>{
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    
    let perspective_pageNum=1;
    axios.get(`/client/${ORG_NAME}/perspective/?page=${perspective_pageNum}`)
    .then((resp:any)=>{
      setNext(resp.data.next)
        if(next){
          perspective_pageNum = perspective_pageNum+1
        }
      
          console.log(resp.data.data,"Data But U",perspective_pageNum)
          setAll_perspective([...all_perspective,...resp.data.data])
        
        
        
    })


    // if(respData.status===200){
    //   setAll_perspective([...respData.data.data])
    // }

  } 
  
  const getObjective = async (pagenum=1)=>{
    const ORG_NAME = localStorage.getItem("current_organization_short_name");

    const response = await axios.get(`/client/${ORG_NAME}/objective/?page=${pagenum}`);
    const respData = await response

    if(respData.status===200){
      setAll_objective([...respData.data.data])
      setNumOfData(respData.data.count);
      setNextPage(respData.data.next);
      setPreviousPage(respData.data.previous);
    }




    setIsLoading(false);


  }

  useEffect(()=>{
    // only works onLoad of the Page

    
    // for(let i=0;true;i++){

    //   if(!next){
    //     setIsLoading(false)
    //     break
    //   }
    // }
    getPerspective()
    getObjective()
    
  },[])
  useEffect(()=>{
    getObjective(pageNum)
  },[pageNum])
  console.log(all_perspective)

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          {/* Showing 10 of 40 Objective/Perspective */}
        </Text>

        {/* <Stack direction="row" spacing={4}>
          <CustomDrawer
            showModalBtnText="Add Objective/Perspective"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <AddObjectivePerspective />
          </CustomDrawer>
          <CustomDrawer
            showModalBtnText="Upload Objective/Perspective"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <AddObjectivePerspective />
          </CustomDrawer>
        </Stack> */}
      </Flex>
{
  !isLoading?
      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.200">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th py="5"
              style={{"textTransform":"capitalize"}}
            
            >Objective Name</Th>
            {
              all_perspective.length!=0?
              all_perspective.map((data:{'perspective_id':"",'name':''})=>{
               return <Th key={data.perspective_id}
              style={{"textTransform":"capitalize"}}
               >{data.name}</Th>
              })
              :<Th>You Dont Have Perpective at This poin</Th>
            }
            <Th 
              style={{"textTransform":"capitalize"}}
            
            >Cummulative Point</Th>
          </Tr>
        </Thead>
        <Tbody>
           {
             all_objective.length!=0?
             all_objective.map((obj:any)=>{
               return(

                  <Tr style={{"textTransform":"capitalize"}}>
                      <Td>
                      <Stack>

                      <Link
                    textAlign="left"
                    fontSize="smaller"
                    display="block"
                    color="blue.500"
                    textDecoration="underline"
                    href="#"
                  >  {obj.name}</Link>
                          <Text textAlign="center" as="small">
                  {/* {jd.target_point} */}
                  </Text>
                                    </Stack>
                      
                        </Td>
                      {/* 



                      Okay this is the Explanation to the Logic Below
                      We got all the perspective and loop throough it
                      so for each perspective in the all_perspective array we got the current obj(meaning Objective)
                      and find if the perspective id is located in the Current Objective uf yes just return the objective_perspective_point
                      */}
                      {
                        all_perspective.length!=0?
                        all_perspective.map((data:any,index:number)=>{

                          // look if there is a match in perspective
                  let ans=        obj.perspectives.find((obj_perspective:any)=>{    
                            return obj_perspective.perspective.perspective_id==data.perspective_id})

return ans!=undefined?<Td

>{ans.objective_perspective_point}</Td>:<Td>0</Td>

                        }):"is not found"
                      }

                      <Td
          style={{"textAlign":'center'}}
                      
                      >{obj.target_point}</Td>
                  </Tr>

               )
             })
             :<Th>..</Th>

           }
         <Tr>
           <Td><strong>Percpective Total</strong></Td>
           {all_perspective.map((data:any)=>{

             return (
               <Td>{data.target_point}</Td>
             )
           })}
         </Tr>
        </Tbody>
      </Table>

      :"Loading...."
 
}
 

<Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button>

 </Box>
  );
};

export default ObjectivePerspective;
