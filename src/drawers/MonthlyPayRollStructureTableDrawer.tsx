import { DrawerCloseButton, DrawerHeader,DrawerBody,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex, } from "@chakra-ui/react"
import { MonthlyPayrollStructureType } from "../redux/payroll/monthlyPayrollStructure/monthlyPayrollStructureApi"



type Prop ={
  data:MonthlyPayrollStructureType
}

const MonthlyPayRollStructureTableDrawer = ({data}:Prop):React.ReactElement=>{
console.log({data})

    return(
        <>
        <DrawerCloseButton />
        <DrawerHeader fontSize="md">Monthly Pay Roll Structure For <strong>Grade level2</strong></DrawerHeader>
        
        <DrawerBody>
        {/* <Flex justifyContent={'space-between'} align={'center'} flexDirection='column'> */}
        <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden" style={{'margin':'0 2px'}}>
              <Thead bg="gray.200">
                  <Tr>
                    {/* <Th py="4"  style={{"textTransform":"capitalize"}}>Grade Level</Th> */}
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Employee Other Recievable Elements</Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Percentage of Gross </Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Value</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {
                    data.employee_other_receivables.map((info:any,index:number)=>(
                      <Tr key={index}>
                        <Td>{info.other_receivables_element}</Td>
                        <Td>{info.other_receivables_element_gross_percent}</Td>
                        <Td>{info.value}</Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>
              <br />
              <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden" style={{'margin':'0 2px'}}>
              <Thead bg="gray.200">
                  <Tr>
                    {/* <Th py="4"  style={{"textTransform":"capitalize"}}>Grade Level</Th> */}
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Employee Fixed Recievable Elements</Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Percentage of Gross </Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Value</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {
                    data.employee_receivables.map((info:any,index:number)=>(
                      <Tr key={index}>
                        <Td>{info.fixed_receivables_element}</Td>
                        <Td>{info.fixed_receivables_element_gross_percent}</Td>
                        <Td>{info.value}</Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>
<br />

              <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden" style={{'margin':'0 2px'}}>
              <Thead bg="gray.200">
                  <Tr>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Employee Regulatory Recievables</Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>State Regulatory Rates </Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Percentage of Gross</Th>
                    <Th py="2"  style={{"textTransform":"capitalize"}}>Value</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {
                    data.employee_regulatory_recievables.map((info:any,index:number)=>(
                      <Tr key={index}>
                        <Td>{info.Employee_regulatory_recievables}</Td>
                        <Td>{info.regulatory_rates}</Td>
                        <Td>{info.Employee_regulatory_recievables_gross_percent}</Td>
                        <Td>{info.value}</Td>
                      </Tr>
                    ))
                  }
                </Tbody>

              </Table>

              <br />

              <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden" style={{'margin':'0 2px'}}>
              <Thead bg="gray.200">
                  <Tr>
                      <Th py="4"  style={{"textTransform":"capitalize"}}>Regulatory Deductables</Th>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>State Regulatory Rates %</Th>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>Percentage of Gross  </Th>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>Value  </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {
                    data.employee_regulatory_deductables.map((info:any,index:number)=>(
                      <Tr key={index}>
                        <Td>{info.Employee_regulatory_deductables}</Td>
                        <Td>{info.regulatory_rates}</Td>
                        <Td>{info.Employee_regulatory_deductables_gross_percent}</Td>
                        <Td>{info.value}</Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>

              <br />

              <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden" style={{'margin':'0 2px'}}>
              <Thead bg="gray.200">
                  <Tr>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>Other Deductables</Th>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>Employee Total Deductables</Th>
                      <Th py="2"  style={{"textTransform":"capitalize"}}>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    data.employee_other_deductables.map((info:any,index:number)=>(
                      <Tr key={index}>
                        <Td>{info.Employee_other_deductables}</Td>
                        <Td>{info.Employee_other_deductables_gross_percent}</Td>
                        <Td>{info.value}</Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>
        {/* </Flex> */}
        

        </DrawerBody>
        </>
    )
}


{/*  */}


export default MonthlyPayRollStructureTableDrawer