import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { HumanPerformanceDataTablePropsType } from "../HumanPerformanceDataTable"



type Prop = {
    data:HumanPerformanceDataTablePropsType[]
}

const OverallJobQuatityReport =({data}:Prop):React.ReactElement=>(

    <Table
    size="sm" 
    variant="striped" borderRadius="lg" 
    // colorScheme='teal'
    overflow="hidden">
            <Thead bg="gray.200">
              <Tr>
                <Th py="5" style={{"textTransform":"capitalize"}}>
                  Task Name/Employee name
                </Th>
               <Th py="5"  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Qty point</Th>
                 <Th  style={{"textTransform":"capitalize","padding":"0 2px","textAlign":"center"}}>Qty Point Score</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
                        {
                          data?
                          data.map((item)=>(
                            <Tr style={{"textTransform":"capitalize"}}>
                            
                            <Td
                            style={{"lineHeight":"20px"}}
                            >{item.name}</Td>
                            <Td style={{"textAlign":"center"}}>{item.quantity_target_point}</Td>
                            <Td style={{"textAlign":"center"}}>{item.quantity_target_point_achieved}</Td>
                           
                        </Tr>
                          )):""
                        }
    
            </Tbody>
          </Table>

)

export default OverallJobQuatityReport