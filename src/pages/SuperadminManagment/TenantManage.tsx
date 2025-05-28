import { Box, Button, Stack } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useErrorHandler } from "react-error-boundary"
import { HiOutlinePlus } from "react-icons/hi"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import AppBar from "../../components/AppBar"
import CustomModal from "../../components/CustomModal"
import TenantManageTable from "../../components/TenantManage/TenantManageTable"
import CustomDrawer from "../../drawers/CustomDrawer"
import { useAppDispatch } from "../../redux/hooks"
import { getAllTenantsApi } from "../../redux/TenantAdminManager/TenantAdminManagerApi"
import { selectTenant_admin_management } from "../../redux/TenantAdminManager/TenantAdminManagerSlice"






const TenantManage = ()=>{
    const dispatch = useAppDispatch()
    const {status,errorMessage,data} = useSelector(selectTenant_admin_management);
    const handleError = useErrorHandler()
    const route  = useHistory()







    useEffect(()=>{
        dispatch(getAllTenantsApi({handleError}))
    },[])
    console.log({'tableD':data})

    

    return (
        <Box>
            <AppBar
              avatar="/logo192.png"
              imgAlt="Jane Doe's avatar"
            heading="Tenant Management"/>
           



           <Stack direction="row" spacing={4}>
                <Button
                // @ts-ignore
                 showModalBtnText="Add New Perspective"
                 showModalBtnVariant="primary"
                 showModalBtnColor="white"
                 leftIcon={<HiOutlinePlus />}
                 drawerSize="xs"
                 onClick={e=>route.push("/sign-up")}
                >
                    Create Tenant
                </Button>

                {/* <CustomModal openBtnText='Update' headingText='Update Tenant'subHeadText='..'>
                    <p> hell world</p>
                    </CustomModal> */}
          </Stack>

           <br />
           <TenantManageTable data={data}/>
        </Box>
    )
}
export default TenantManage