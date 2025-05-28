// import { formonthly } from "./mock"
import {Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    TableCaption,
    useToast,
    Select, } from "@chakra-ui/react"
import axios from "../../services/api";
import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectMonthlyGenerateTable } from "../../redux/payroll/monthlyPayrollStructure/MonthlyGenerateTable/MonthlyGenerateTableSlice"
import Preloader from "../Preloader";
import { getMonthlyGenerateTable } from "../../redux/payroll/monthlyPayrollStructure/MonthlyGenerateTable/MonthlyGenerateTableApi";


const DailyGenerateTable=():React.ReactElement=>{

    // console.log(formonthly)
    const {data:formonthly,status,}= useAppSelector(selectMonthlyGenerateTable);
    const dispatch  = useAppDispatch()
    const [available_date,setAvailable_date] = useState<string[]>([])
    const handleError = useErrorHandler()
    const org_name = localStorage.getItem("current_organization_short_name");
    const toast = useToast();
    const [isLoading,setIsLoading]=useState(false)
    const [selectedDate,setSelectedDate]=useState<string>()
    
    const fixed_receivables_element = Array.from(new Set(formonthly.map(d=> d.saved_employee_receivables.map(r=>r.fixed_receivables_element)).flatMap(value=>value)))
    // fixed_receivables_element.push('Staff Name','CODE/  Grade Levels')
    const Employee_regulatory_recievables= Array.from(new Set(formonthly.map(d=> d.saved_employee_regulatory_recievables.map(r=>r.Employee_regulatory_recievables)).flatMap(value=>value)))
    const Employee_regulatory_deductables = Array.from(new Set(formonthly.map(d=>d.saved_employee_regulatory_deductables.map(r=>r.Employee_regulatory_deductables)).flatMap(value=>value)))
    const Employee_other_deductables = Array.from(new Set( formonthly.map(d=>d.saved_employee_other_deductables.map(r=>r.Employee_other_deductables)).flatMap(value=>value)))
    const other_receivables_element= Array.from(new Set(formonthly.map(d=>d.saved_employee_other_recievables.map(r=>r.other_receivables_element)).flatMap(value=>value)))


    const getAvailableDate = async ()=>{
        if(!org_name) return
        try {
            setIsLoading(true)
            const resp = await axios.get(`/client/${org_name}/payroll/monthly_generate/get_available_generated_dates/?structure_type=daily`)
            
            setAvailable_date(Array.from(new Set(resp.data.map((d:any)=>d.generated_for))))
            setIsLoading(false)
        } catch (err:any) {
            if(err.response.status===401){
                handleError(err)
              }
              toast({
                title: 'Something went wrong please re-login and check your internet',
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
              })
        }
    }

    useEffect(()=>{
        getAvailableDate()
    },[])
    useEffect(()=>{
        
    },[selectedDate])
    return(
        <div>   
            {status==='pending'&& <Preloader/>}
            {isLoading===true&& <Preloader/>}
            <Select placeholder='Select option' width={'20%'} onChange={(e)=>{
                    if(org_name){
                        dispatch(getMonthlyGenerateTable({org_name,handleError,generated_for:e.target.value}))
                    }
            }}>
                {
                    available_date.map((data:string,index:number)=>(
                        <option value={data} key={index}>Search by {data}</option>
                    ))
                }
            </Select><br />
            {
                formonthly.length!==0?
            <div style={{'display':'flex',}}>
                <Table size="sm" variant="striped"  overflow="hidden" style={{'borderRight':'1px solid black',}}>
                <TableCaption>Staff Info</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Name</Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Grade Levels</Th>
                        
                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>
                                <Td>{data.employee_full_name}</Td>
                                <Td>S{data.grade_level}</Td>
                            </Tr>

                        ))
                        }
                    </Tbody>
                </Table>

                <Table size="sm" variant="striped"  overflow="hidden" style={{'borderRight':'1px solid black',}}>
                <TableCaption>Fixed Receivables Element</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                        {
                            fixed_receivables_element.map((title,index)=>(
                                <Th py="2" key={index} style={{"textTransform":"capitalize"}}>{title}</Th>
                            ))
                        }
                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>
                            {
                                fixed_receivables_element.map(head=>(
                                    <Td>
                                    {data.saved_employee_receivables.map(s=>s.fixed_receivables_element===head?s.value:"")}
                                    </Td>
                                ))
                            }
                                {/* {data.saved_employee_receivables.map(data=>(
                                    <Td>
                                        {data.fixed_receivables_element==?}
                                    </Td>
                                ))} */}
                            </Tr>

                            ))
                        }
                    </Tbody>
                </Table>


                <Table size="sm" variant="striped"  overflow="hidden" style={{'borderRight':'1px solid black',}}>
                <TableCaption>Other Receivables Element</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                        {
                            other_receivables_element.map((title,index)=>(
                                <Th py="2" key={index} style={{"textTransform":"capitalize"}}>{title}</Th>
                            ))
                        }
                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>
                            {
                                other_receivables_element.map(head=>(
                                    <Td>
                                    {data.saved_employee_other_recievables.map(s=>s.other_receivables_element===head?s.value:"")}
                                    </Td>
                                ))
                            }
                                {/* {data.saved_employee_receivables.map(data=>(
                                    <Td>
                                        {data.fixed_receivables_element==?}
                                    </Td>
                                ))} */}
                            </Tr>

                            ))
                        }
                    </Tbody>
                </Table>


                <Table size="sm" variant="striped"  overflow="hidden" style={{'borderRight':'1px solid black',}}>
                <TableCaption>employee regulatory recievables</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                        {
                            Employee_regulatory_recievables.map((title,index)=>(
                                <Th py="2" key={index} style={{"textTransform":"capitalize"}}>{title}</Th>
                            ))
                        }
                        <Th py="2"  style={{"textTransform":"capitalize"}}>Total monthly gross</Th>
                        <Th py="2"  style={{"textTransform":"capitalize"}}>Total annual gross.</Th>

                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>

                            {
                                Employee_regulatory_recievables.map(head=>(
                                    <Td>
                                    {data.saved_employee_regulatory_recievables.map(s=>s.Employee_regulatory_recievables===head?s.value:"")}
                                    </Td>
                                ))
                            }
                                    <Td>{data.total_gross}</Td>
                                    <Td>{data.annual_gross}</Td>                            
                            </Tr>

                            ))
                        }
                        
                    </Tbody>
                </Table>


                <Table size="sm" variant="striped"  overflow="hidden" style={{'borderRight':'1px solid black',}}>
                <TableCaption>employee regulatory deductables</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                        {
                            Employee_regulatory_deductables.map((title,index)=>(
                                <Th py="2" key={index} style={{"textTransform":"capitalize"}}>{title}</Th>
                            ))
                        }
                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>
                            {
                                Employee_regulatory_deductables.map(head=>(
                                    <Td>
                                    {data.saved_employee_regulatory_deductables.map(s=>s.Employee_regulatory_deductables===head?s.value:"")}
                                    </Td>
                                ))
                            }
                            
                            </Tr>

                            ))
                        }
                    </Tbody>
                </Table>


                <Table size="sm" variant="striped"  overflow="hidden" >
                <TableCaption>employee other deductables</TableCaption>
                    <Thead bg="gray.200">
                    <Tr>
                        {
                            Employee_other_deductables.map((title,index)=>(
                                <Th py="2" key={index} style={{"textTransform":"capitalize"}}>{title}</Th>
                            ))
                        }
                        <Th py="2"  style={{"textTransform":"capitalize"}}>Total monthly net</Th>

                    </Tr> 
                    </Thead>
                    <Tbody>
                        {
                            formonthly.map((data,index)=>(
                                <Tr key={index}>
                            {
                                Employee_other_deductables.map(head=>(
                                    <Td>
                                    {data.saved_employee_other_deductables.map(s=>s.Employee_other_deductables===head?s.value:"")}
                                    </Td>
                                ))
                            }
                            <Td>{data.net_salary}</Td>
                            </Tr>

                            ))
                        }
                    </Tbody>
                </Table>
            </div>:''
            }

        </div>
    )
}

export default DailyGenerateTable