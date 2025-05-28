import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HiOutlinePlus } from "react-icons/hi";
import axios from "../services/api";
import { AxiosError, AxiosResponse } from "axios";
import errorMessageGetter,{errorMessageForFileUpload} from "../utils/errorMessages";
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { addDesignation } from "../redux/designation/DesignationAPI";
import uploadDocumentHandler from "../utils/uploadClass";
import { useErrorHandler } from "react-error-boundary";

const UploadTasks=()=>{
    // const app = useAppSelector()
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const toast = useToast();
    const fileInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()
    const handleError= useErrorHandler()
    const handleFileUpload = () => {
        // trigger a click event on the file input
        if (fileInput.current !== null) {
          fileInput.current.click();
        }
      };
    
    const doc =new uploadDocumentHandler(
toast,'/task/bulk-add/','task',
selectedFile,isFilePicked,
setSelectedFile,setIsFilePicked,dispatch,handleError
)
    return (
        <>
        <DrawerCloseButton />
        <DrawerHeader>Upload Tasks In Batch</DrawerHeader>
        <DrawerBody>
          <Text>Upload document in .xlsx or .xls format</Text>
          <form id="upload-employee-form"
           onSubmit={(e)=>doc.handleSubmit(e)}
           >
            <Flex
              w="400px"
              h="150px"
              border="dashed"
              borderColor="gray.400"
              borderRadius="md"
              // p="10"
              mt="4"
              align="center"
              justify="center"
            >
              <Input
                display="none"
                multiple={false}
                name="employee_template_file"
                type="file"
                ref={fileInput}
                onChange={(e)=>doc.handleFileChange(e)}
              />
              <Box>
                <Button
                  variant="outline"
                  color="primary"
                  leftIcon={<HiOutlinePlus color="gray.400" />}
                  onClick={handleFileUpload}
                >
                  Choose File
                </Button>
                <Box as="span">
                  {isFilePicked && selectedFile !== undefined
                    ? selectedFile.name
                    : null}
                </Box>
              </Box>
            </Flex>
          </form>
        </DrawerBody>
        <DrawerFooter>
          <Button
            type="submit"
            form="upload-employee-form"
            variant="primary"
            w="full"
          >
            Upload File
          </Button>
        </DrawerFooter>
      </>

    )


}



export default UploadTasks




// UploadInitiative