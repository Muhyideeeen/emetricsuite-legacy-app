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
  } from "@chakra-ui/react";
  import { HiOutlinePlus } from "react-icons/hi";
  import { NormalTD, StickyTableWrapper, StickyTD, StickyTH, TableView } from "../../css-wth-styled/ObjectiveAndJDInitiative.style";
  import AddObjectiveAndJDInitiative from "../../drawers/AddObjectiveAndJDInitiative";
  import CustomDrawer from "../../drawers/CustomDrawer";
  import {useEffect, useState} from 'react'
  import axios from "../../services/api";
  
  interface jdObjSpreadInterface{
    obj_name:string;
    obj_id:string;
    all_jd:[];
    commulative_point:any;
  }
  // interface jdObjSpreadInterfaces extends Array<jdObjSpreadInterface>{}
  
  const ObjectiveAndJDInitiave = () => {
    const [numOfInitiative,setnumOfInitiative]=useState(0);
  
  
  
    // const [jdObjSpread,setJdObjSpread]=useState<jdObjSpreadInterfaces>([]);
    const [jdObjSpread,setJdObjSpread]=useState<any>([]);
    const [initiatives,setInitiatives] = useState<any>([]);
    const [objectives,setObjectives] = useState<any>([]);
    const [isLoading,setIsLoading]=useState(false)
  
    const org_name= localStorage.getItem('current_organization_short_name')
    // const getInitiatives = async (abortCont:any)=>{
    //   let initiatives:any
    //   const resp = await axios.get(`/client/${org_name}/initiative/?is_objective_downline=True`,{
    //     signal:abortCont.signal
    //   }) 
    //   const respData = await resp
    //   if(respData.status===200){
    //     setInitiatives([...respData.data.data])
    //   }
  
    
    // }
    
  
    const getObjectives_and_Initiative = async (abortCont:any)=>{
      
      const respObjective = await axios.get(`/client/${org_name}/objective/?objective_status=active`,{signal:abortCont.signal}) 
      const respDataObjective = await respObjective
      if(respDataObjective.status===200){
        setObjectives([...respDataObjective.data.data])
      }
  
  
      const respInitiative = await axios.get(`/client/${org_name}/initiative/?is_objective_downline=True`,{
        signal:abortCont.signal
      }) 
      const respInitiativeData = await respInitiative
      if(respInitiativeData.status===200){
        setInitiatives([...respInitiativeData.data.data])
      }
  
      return {
        respDataObjective,respInitiativeData
      }
    }
  
  const FormatData = (all_initiatives:[],all_objectives:[])=>{
      // save the length of this initiative in this state
      setnumOfInitiative(all_initiatives.length)
  
      const data = [
      ...all_objectives.map((obj:any)=>{
  
        return {
          "obj_name":obj.name,
          "obj_id":obj.objective_id,
          // we want to calculate the total point
          "commulative_point":[...all_initiatives.map((initiative:any)=>{
                  if(obj.objective_id === initiative.upline_objective.objective_id){
                    return initiative.target_point
                  }else{return 0}
          })].reduce((prev,current)=>{return parseInt(prev)+parseInt(current)},0),
          "all_jd":[
            ...all_initiatives.map((initiative:any)=>{
  
              if( obj.objective_id === initiative.upline_objective.objective_id){
                return initiative
              }
  
              else{
                return {name:"...."}
              }
            })
          ],
        }
      })
      ]
  
      return data
  }
    // const getObjectives
  
    useEffect(()=>{
      const abortCont = new AbortController();
      // getObjectives(abortCont)
      // getInitiatives(abortCont)
      getObjectives_and_Initiative(abortCont)
      .then((data)=>{
          console.log(
            initiatives,objectives
          )
      })
      .catch((err)=>{
      setIsLoading(false)
      })
      
   
      // FormatData(initiatives,objectives)
  
      return ()=>abortCont.abort()
    
    },[])
  
    useEffect(()=>{
      let isMounted = true; 
      if(initiatives.length!==0 && objectives.length!==0 && isMounted==true){
        setJdObjSpread([...FormatData(initiatives,objectives)])
      }
      setIsLoading(false)
        
      return () => { isMounted = false };
    },[initiatives,objectives])
    
    console.log(jdObjSpread)
    return (
      <Box style={{overflow:'hidden'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text
            as="small"
            display="inline-block"
            fontWeight="semibold"
            alignSelf="flex-end"
          >
            Showing 10 of 40 Objective/ Kpi &amp; Initiative Spread
          </Text>
  
          <Stack direction="row" spacing={4}>
            <CustomDrawer
              showModalBtnText="Add Objective/Kpi &amp; Initiative"
              showModalBtnVariant="primary"
              showModalBtnColor="white"
              leftIcon={<HiOutlinePlus />}
              drawerSize="md"
            >
              <AddObjectiveAndJDInitiative />
            </CustomDrawer>
            <CustomDrawer
              showModalBtnText="Upload Objective/Kpi &amp; Initiative"
              showModalBtnVariant="outline"
              showModalBtnColor="primary"
              leftIcon={<HiOutlinePlus />}
              // drawerSize="sm"
            >
              <AddObjectiveAndJDInitiative />
            </CustomDrawer>
          </Stack>
        </Flex>
  
      <TableView>
      <StickyTableWrapper>
        {(isLoading===false&&jdObjSpread.length!==0)?
                        <table style={{padding:"0 1rem"}}>
                        <Thead bg="gray.100">
                            <tr>
                              <StickyTH>Name</StickyTH>
                              <th style={{fontSize:".7rem"}}>Commuladtive Point</th>
                              {[...new Array(numOfInitiative)].map((num,index)=>{
                                console.log(num)
                                return(
                              <th style={{fontSize:".7rem"}}>{`Kpi Initiative ${index} `}</th>
  
                                )
                              })}
    
                            </tr>
    
                            
                        </Thead>
    
                        <tbody>
                          {/* <tr> */}
                              {
                                jdObjSpread.map((data:any)=>{
  
                                  return (
                                    <tr>
                                      <StickyTD>
                                          {data.obj_name}
                                      </StickyTD>
                                      <NormalTD>
                                    {data.commulative_point}
                                      </NormalTD>
  
                                  {
                                  // data.all_jd.length!==0?
                                  data.all_jd.map((jd:any)=>(
                                    <NormalTD>
                                    {jd.name}
                                    </NormalTD>
                                  ))
  
  
                                      }
                                    </tr>
                                  )
                                })
                              }
                                
                          
                             
                              {/* <td > </td> */}
                              
                          {/* </tr> */}
    
    
    
                        </tbody>
                  </table>
  :"Is loading oo"        
      }
        </StickyTableWrapper>
      </TableView>
        
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
  
 