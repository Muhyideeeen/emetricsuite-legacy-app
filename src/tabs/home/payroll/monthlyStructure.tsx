import { ReactElement, useEffect, useState } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,Flex,
    Th,
    Td,Grid, Heading, Text, Select
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import CustomDrawer from "../../../drawers/CustomDrawer";
import MonthlyPayRollStructureTableDrawer from "../../../drawers/MonthlyPayRollStructureTableDrawer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectMontlyPayRollStructure } from "../../../redux/payroll/monthlyPayrollStructure/monthlyPayrollStructureSlice";
import { getMonthlyPayrollStructure, MonthlyPayrollStructureType } from "../../../redux/payroll/monthlyPayrollStructure/monthlyPayrollStructureApi";
import { useErrorHandler } from "react-error-boundary";
import Preloader from "../../../components/Preloader";



export type structureType ='monthly'|'daily'|'hourly'

const MonthlyStructure = ():ReactElement=>{
    const dispatch = useAppDispatch();
    const {status,data} = useAppSelector(selectMontlyPayRollStructure);
    const handleError = useErrorHandler()
    const org_name = localStorage.getItem("current_organization_short_name");
    const [structure_type,setStructure_type] = useState<structureType|null>(null)
    useEffect(()=>{
      if(org_name){
        if(structure_type){
          dispatch(getMonthlyPayrollStructure({
            handleError,
            org_name,structure_type,
          }))
        }
      }
    },[structure_type])
    return (
        <Box>

<Select placeholder='Select Structure Type' onChange={(e)=>{
setStructure_type(e.target.value as structureType)
}}
style={{width:'300px'}}
>
  <option value='monthly'>Monthly</option>
  <option value='daily'>Daily</option>
  <option value='hourly'>Hourly</option>
</Select>
<br />
{status==='pending'&&<Preloader/>}
<Grid templateColumns='repeat(5, 1fr)' 
            gap={6}
            mb="10"
            >



                {
                       data.map((item:MonthlyPayrollStructureType,index:number)=>(
                          <Box
                          // maxW='md'
                          width={'150px'}
                          textAlign='center'
                          borderWidth='1px' borderRadius='lg' 
                          padding={'.5rem'}
                          boxShadow='xl' 
                          key={index}
                          style={{'position':'relative'}}
                          >
                          <Text fontSize='small'>Grade Level:  <strong>s{item.id}</strong></Text>
                          <Text fontSize='small'>Grosss Amount: <strong>${item.gross_money}</strong></Text>
                          <br/>

                          <Flex alignItems={'center'}>
                          <MdDelete
                          style={{'margin':'0 10px','cursor':'pointer'}}
                          onClick={(e)=>{
                          //   dispatch(deletePublicHoliday(data.date))
                          }}
                          />
                          {/* <AiFillEye 
                          style={{'cursor':'pointer'}}
                          onClick={(e)=>{
                          //   dispatch(deletePublicHoliday(data.date))
                          }}
                          /> */}
                          <CustomDrawer
                          showModalBtnText=""
                          showModalBtnVariant="outline"
                          // showModalBtnColor="white"
                          showModalBtnColor="primary"
                          leftIcon={<AiFillEye />}
                          drawerSize='md'
                          >
                          <MonthlyPayRollStructureTableDrawer  data={item}/>
                          </CustomDrawer>
                          </Flex>

                          </Box>
                    ))
                }
            </Grid>
        </Box>
    )
}

export default MonthlyStructure