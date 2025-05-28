
import { Box, Button, Flex, Input, Text } from  '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Grid,

  } from '@chakra-ui/react';
import React, { useEffect,useState,useMemo, } from "react"
import { Employee } from "../../redux/employees/employeesSlice"
import axios from "../../services/api";
import { getMyInfo } from "../../services/auth.service";
import { useErrorHandler } from "react-error-boundary";
import FilterTableData from '../../components/FilterTableData';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
import Preloader from '../../components/Preloader';
import PaginatedItems from '../../components/Pagination/Pagination';
import CustomDrawer from '../../drawers/CustomDrawer';
import { HiOutlinePlus } from 'react-icons/hi';
import MyKpiReportDrawer from '../../drawers/MyKpiReportDrawer';



const IndividualInitiativeReport = ():React.ReactElement=>{
    const [initiatives,setInitiatives] = useState<any>([])
    const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
    const [isLoading,setIsLoading] = useState(false);
    const handleError = useErrorHandler();
    const org_name = localStorage.getItem('current_organization_short_name');


    const [pageNum,setPageNum] = useState(1);
    const [nextPage,setNextPage]=useState<string|null|undefined>(null);
    const [previousPage,setPreviousPage]=useState<string|null|undefined>(null);
    const [NumOfData,setNumOfData]=useState<number|undefined>(0);
    const [num_of_pages,setNum_of_pages] = useState(0)


    const getInitiatives = async()=>{
        setIsLoading(true)
        
        try {
            const resp = await axios.get(`/client/${org_name}/initiative/?owner_email=${loggedinUser.email}&page=${pageNum}`)
            console.log({
                resp
            })
            setInitiatives(resp.data.data)
            setIsLoading(false)

            setNum_of_pages(resp.data.page_count)
            setNumOfData(resp.data.count);
            setNextPage(resp.data.next);
            setPreviousPage(resp.data.previous);
        
        } catch (err:any) {
            setInitiatives([])

            if(err.response.status === 401){
                handleError(err)
        setIsLoading(false)
          
            }
        }   
    }   


    useEffect(()=>{
        getInitiatives()
    },[pageNum])

    return (
        <>
        <Table 
        size="sm"
        variant="striped" borderRadius="lg" 
        // colorScheme='teal'
        overflow="hidden"
          >
    <Thead bg="gray.100">
      <Tr style={{"textTransform":"capitalize"}}>
        <Th py="6"   fontSize="xs" 
              style={{"textTransform":"capitalize"}}
        
        >KPI Name</Th>
        <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
        
        >TaT(EndTime)</Th>
        <Th   fontSize="xs"
              style={{"textTransform":"capitalize"}}
        
        > Target Point</Th>
    
         <Th   fontSize="xs"
              style={{"textTransform":"capitalize",width:"1%"}}>Routine </Th>
         <Th></Th>
         
      </Tr>
    </Thead>

    {isLoading?<Preloader />:(

    <Tbody>
     
      {
      initiatives.length!=0?
        initiatives.map((item:any, index:number) => (
        <Tr key={index} style={{"textTransform":"capitalize"}}>
         
          <Td fontSize="xs" style={{width:"100%"}}>
            <Text mb="2" style={{width:"100%"}}>{item.name}</Text>
            </Td>
          <Td fontSize="xs"
          style={{"textAlign":'center'}}
          >
            <Text>{item.end_date}</Text>
            {/* <Text>12:00</Text> */}
          </Td>
          <Td 
          style={{"textAlign":'center'}}
          
          >{item.target_point}</Td>
          
         <Td fontSize="xs" 
          style={{"textAlign":'center'}}
         >
         {item.routine_round}</Td>

         <Td fontSize="xs" 
          style={{"textAlign":'center'}}
         >
           

            <CustomDrawer
            showModalBtnText="View"
            showModalBtnVariant='primary'
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize='full'
          >
                <MyKpiReportDrawer initiative_id={item.initiative_id}/>
          </CustomDrawer>
         </Td>

        </Tr>
        
      )):<p>You dont Have KPI at this point</p>
      
      }
    </Tbody>
    )}
  </Table>





        <PaginatedItems
      pageCount={num_of_pages}
      onPageClick ={(pageNumberClicked)=>{
        setPageNum(pageNumberClicked)
      }}
    />
        </>
    )
}


export default IndividualInitiativeReport