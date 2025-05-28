import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,Link,
  Stack,Button
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import { NormalTD, StickyTableWrapper, StickyTD, StickyTH, TableView } from "../../css-wth-styled/ObjectiveAndJDInitiative.style";
import AddObjectiveAndJDInitiative from "../../drawers/AddObjectiveAndJDInitiative";
import CustomDrawer from "../../drawers/CustomDrawer";
import {useEffect, useState} from 'react'
import axios from "../../services/api";
import { GrFormNextLink,GrFormPreviousLink } from "react-icons/gr";

interface jdObjSpreadInterface{
  obj_name:string;
  obj_id:string;
  all_jd:[];
  commulative_point:any;
}
// interface jdObjSpreadInterfaces extends Array<jdObjSpreadInterface>{}

const ObjectiveAndJDInitiave = () => {
  const [numOfInitiative,setnumOfInitiative]=useState(0);

  //pagination states
  const [pageNum,setPageNum] = useState(1);
  //end pagination states 
  const [NumOfData,setNumOfData]=useState(0);
  const [nextPage,setNextPage] = useState<string|null>();
  const [previousPage,setPreviousPage] = useState<string|null>();
  

  const [objectives,setObjectives] = useState<any>([]);
  const [isLoading,setIsLoading]=useState(false)

  const org_name= localStorage.getItem('current_organization_short_name')
  
  

  const getObjectives= async (abortCont:any)=>{
    
    const respObjective = await axios.get(`/client/${org_name}/objective/?objective_status=active&page=${pageNum}`,{signal:abortCont.signal}) 
    const respDataObjective = await respObjective
    if(respDataObjective.status===200){
      setObjectives(respDataObjective.data.data.filter((obj:any)=>obj.active_initiative.length!==0))
      setnumOfInitiative(respDataObjective.data.data.map((objective:any)=>{
        return objective.active_initiative.length
      })
      .reduce((cumm:number,prev:number)=>prev+cumm,0)
      )
    }

    else{
      setObjectives([])
    }

    setNextPage(respDataObjective.data.next)
    setPreviousPage(respDataObjective.data.previous)
    setNumOfData(respDataObjective.data.count)
  }


  // const getObjectives

  useEffect(()=>{
    const abortCont = new AbortController();

    getObjectives(abortCont)
    
    
 

    return ()=>abortCont.abort()
  
  },[])

  useEffect(()=>{
    const abortCont = new AbortController();

    getObjectives(abortCont)
    
    
 

    return ()=>abortCont.abort()
  },[pageNum])

console.log(objectives,'all objectives')
  return (
    <Box style={{overflow:'hidden'}}>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          {/* Showing 10 of 40 Objective/ Kpi &amp; Initiative Spread */}
        </Text>

      </Flex>

    <TableView>





    <Table size="sm" variant="striped" borderRadius="lg" overflow="scroll">
        <Thead bg="gray.100">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th py="5"  style={{"textTransform":"capitalize"}}>Objective</Th>
           
        
            {/* <Th>Name</Th> */}
            <Th style={{fontSize:".7rem","textTransform":"capitalize"}}>Cumm. Point</Th>
            {[...new Array(numOfInitiative)].map((num,index)=>{
              console.log(num)
              return(
            <Th style={{fontSize:".7rem","textTransform":"capitalize"}}>{`Kpi Initiative ${index} `}</Th>

              )
            })}

                          
          </Tr>
        </Thead>
        <Tbody>
           
        {
                              objectives.map((data:any)=>{

                                return (
                                  <Tr style={{"textTransform":"capitalize"}}>
                                    
                                    <Td>
                                      {data.name}
                                    </Td>


                                    <Td>
                                     
                                  {data.active_initiative.map((initiative:any)=>{
                  return initiative.target_point
                                }).reduce((prev:any,current:any)=>{return parseInt(prev)+parseInt(current)},0)
          
          }
                                    </Td>

                                {
                                // data.all_jd.length!==0?
                                data.active_initiative.map((jd:any)=>(
                                
                                  <Td>
                                  <Stack>
                                  <Link
                    textAlign="center"
                    fontSize="smaller"
                    display="block"
                    color="blue.500"
                    textDecoration="underline"
                    href="#"
                  >{jd.name}</Link>
                          <Text textAlign="center" as="small">
                  {jd.target_point}
                  </Text>
                                    </Stack>
                                    </Td>


                                ))


                                    }
                                  </Tr>
                                )
                              })
                            }

           
       
        </Tbody>
      </Table>







  
    </TableView>
    <Button disabled={!previousPage}
onClick={(e)=>setPageNum(pageNum==1?1:pageNum-1)}
leftIcon={ <GrFormPreviousLink/>}></Button>

<Button disabled={!nextPage}leftIcon={<GrFormNextLink/>}
onClick={(e)=>setPageNum(pageNum+1)}></Button>

      {/* <Table size="sm" variant="striped" borderRadius="lg" 
      // overflow={"auto"}
      style={{overflow:"auto",display:"block",width:'1100px'}}
      >
        <Thead bg="gray.100">
          <Tr>
            <Th  style={{width:"150px",}}>Name</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th textAlign="center" style={{width:"200px",}}>JD Initiative 1</Th>
            <Th style={{width:"140px",}}>Cum cont Target PT.</Th>
          </Tr>
        </Thead>
        <Tbody >
          {[...new Array(1)].map((item, index) => (
            <Tr key={index} style={{border:"1px solid red"}}>
              <Td fontSize="smaller">Become a top of the mind brand best</Td>
              <Td>
                <Stack textAlign="center">
                  <Text fontSize="smaller" display="block" color="blue.500">
                    Generate Content for SM
                  </Text>
                  <Text as="small">7</Text>
                </Stack>
              </Td>
              <Td>
                <Stack textAlign="center">
                  <Text fontSize="smaller" display="block" color="blue.500">
                    Generate Content for SM
                  </Text>
                  <Text as="small">1</Text>
                </Stack>
              </Td>
              <Td>
                <Stack textAlign="center">
                  <Text fontSize="smaller" display="block" color="blue.500">
                    Generate Content for SMt
                  </Text>
                  <Text as="small">3</Text>
                </Stack>
              </Td>
              <Td>
                <Stack textAlign="center">
                  <Text fontSize="smaller" display="block" color="blue.500">
                    Generate Content for SMt
                  </Text>
                  <Text as="small">5</Text>
                </Stack>
              </Td>
              <Td>
                <Stack textAlign="center">
                  <Text fontSize="smaller" display="block" color="blue.500">
                    Generate Content for SMt
                  </Text>
                  <Text as="small">3</Text>
                </Stack>
              </Td>
              <Td>
              <Stack textAlign="center">
                  
                  <Text as="small">3</Text>
                </Stack>
              </Td>

            </Tr>
          ))}
        </Tbody>
      </Table> */}
    </Box>
  );
};

export default ObjectiveAndJDInitiave;
