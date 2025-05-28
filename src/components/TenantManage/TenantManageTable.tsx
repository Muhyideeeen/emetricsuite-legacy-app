
import { Box ,Tr,Table,TableCaption,TableContainer,IconButton,Th,Tbody,Td,Thead, Menu, MenuButton, MenuList, MenuItem,useToast, Button
} from "@chakra-ui/react"
import { useState } from "react"
import { useErrorHandler } from "react-error-boundary"
import { HiDotsHorizontal } from "react-icons/hi"
import CustomDrawer from "../../drawers/CustomDrawer"
import CreateTenantLicence from "../../modal/CreateTenantLicence"
import { TenantDataType } from "../../redux/TenantAdminManager/TenantAdminManagerApi"
import axios from "../../services/api"
import CustomModal from "../CustomModal"
import Preloader from "../Preloader"
import TenantManageDrawerTable from "./TenantManageDrawerTable"
import TenantUpdateManage from "./TenantUpdateManage"









type Prop = {
    data:TenantDataType[]
}
const TenantManageTable =({data}:Prop):React.ReactElement=>{
  const [isDeleteing,setIsDeleteing] = useState(false);
  const toast =useToast();
  const handleError = useErrorHandler();
  const handleDelete = async(org_name:string)=>{
    console.log("202")
    // const org_name =localStorage.getItem("current_organization_short_name")
    if(!org_name) return 
  
    setIsDeleteing(true)
    try{
       const resp =await axios.delete(`/user/organisation/delete/${org_name}/`)
      console.log(
        {
          resp
        }
      )
      //  let confirmDelete = resp.data.status
        if(resp.status === 204){
          toast({
            title: "Your account Has Been Deleted",
            status: "error",
            position: "top",
            duration: 5000,
            isClosable: true,
        })
          setTimeout(()=>{
            window.location.href='/'  
          },2000)
        }
      }catch(err:any){
        console.log({err})
      if(err.response.status===401){
        handleError(err)
      }
    }
  
    setIsDeleteing(false)
  }
    return (
  <Table size="sm" variant="striped" borderRadius="lg" style={{'borderRadius':'10px'}} >
    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
    {isDeleteing&&<Preloader/>}
    <Thead   bg="gray.100" style={{'borderRadius':'10px'}} >
      <Tr>
        <Th>Client Name</Th>
        <Th>Client Address</Th>
        <Th >License Duration </Th>
        <Th>Start Date</Th>
        <Th>End Date</Th>
        <Th>PoC Duration</Th>
        {/* <Th>Name of Account Manager (Client)</Th>
        <Th>Tel of Account Manager (Client)</Th>
        <Th></Th>
        <Th></Th>
        <Th></Th>
        <Th>Name of Super Admin</Th>
        <Th>Email address of Super Admin</Th> */}
        <Td>Actived</Td>

        <Th>more</Th>
      </Tr>
    </Thead>
    <Tbody>

        {
            data.filter(d=>d.company_short_name!=='public').map((d,index:number)=>(
      <Tr key={index}>
        <Td>{d.company_name}</Td>
        <Td>{d.addresse}</Td>
        <Td >{d.lincence}yrs</Td>
        <Td>{d.start_date}</Td>
        <Td>{d.end_date}</Td>
        <Td>{d.poc} days</Td>
        {/* <Td>{d.name_of_account_manager}</Td>
        <Td>{d.tel_of_account_manager}</Td>
        <Td>{d.email_of_account_manager}</Td>
        <Td>{d.employee_limit}</Td>
        <Td>{d.name_of_account_HRmanager}</Td>
        <Td>{d.tel_of_account_HRmanager}</Td>
        <Td>{d.email_of_account_HRmanager}</Td>
      <Td>{d.owner_email}</Td> */}
      <Td>{d.activate?'yes':'no'}</Td>
        <Td cursor="pointer" px="3">
            <Menu>
                <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HiDotsHorizontal />}
                variant="outline"
                />
                    <MenuList>
                      <Button style={{'backgroundColor':'red','color':'white'}} onClick={(e)=>{
                        if(window.confirm("Are you sure you wan to delete the tenant")){
                          handleDelete(d.company_short_name)
                        }
                      }}>Delete</Button>
                      <br />
                      <br />
                    <CustomDrawer showModalBtnText="View" drawerSize="md">
                        <TenantManageDrawerTable data={d}/>
                    </CustomDrawer>
                    <br />
                    <br />
                       <CustomModal size="md" openBtnText='Update' headingText='Update Tenant'subHeadText='make some changes to this information'>
                        <TenantUpdateManage data={d}/>
                      </CustomModal>
                      <br /><br />
                      <CustomModal size="md" openBtnText='lincence management' headingText='Create Lincence'subHeadText='Give a tenant date to get disconnected'>

                        <CreateTenantLicence company_short_name={d.company_short_name}/>
                      </CustomModal>

                    </MenuList>
            </Menu>
        </Td>
      </Tr>
            ))
        }
    </Tbody>
 
  </Table>
    )
}

export default TenantManageTable