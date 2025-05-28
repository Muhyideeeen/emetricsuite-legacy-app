import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Button,
    Text,
    FormControl,
    FormLabel,
    Select,
    useToast,
  } from "@chakra-ui/react";
import React from "react";
import CreateHrAdmin from "../components/CreateHrAdmin";




  
const CreateHrAdminDrawer = ():React.ReactElement=>{


    return (
        <>
            <DrawerCloseButton />
            <DrawerHeader fontSize="md">Create Hr Admin</DrawerHeader>
            <DrawerBody>

                <CreateHrAdmin/>

            </DrawerBody>

            <DrawerFooter>

            </DrawerFooter>
        </>
    )
}

export default CreateHrAdminDrawer