
import { useEffect,useState } from "react";
import {
  Box,
  Text,
  Center,
  Button,
  Flex,
  Image,Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,Input,
  useDisclosure,FormLabel,
  useToast,Select,FormControl,Skeleton
} from "@chakra-ui/react";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useErrorHandler } from "react-error-boundary";
import InputWithLabel from "../components/InputWithLabel";
import axios from "../services/api"

interface submitEmployeeDocType{
    name:string,
    file:any
}
const schema = yup.object().shape({
    name:yup.string().required(),
      file:yup.mixed().required(),
  })
const UploadEmployeeDocs:React.FC<{
    isOpen:any;
    onOpen:()=>void;
    onClose:()=>void;
    employee_uuid:string;

  }> =({
    isOpen,
     onOpen,
      onClose ,employee_uuid
  })=>{
    const toast =useToast()
    const {
        register,
        handleSubmit,control,setValue,
        formState: { errors },reset,getValues
      } = useForm<submitEmployeeDocType>({ resolver: yupResolver(schema) });
  const handleError = useErrorHandler();
    const [fileNames,setFileNames]=useState<{id:string|number,name:string}[]>([])
      const [isLoading,setIsLoading]=useState<boolean>(false);
      const [writeManually,setWriteManually]= useState(false);
    const getAllSavedRequiredFileName = async ()=>{
        const org_name =localStorage.getItem("current_organization_short_name")
        
        if(!org_name) return 
        setIsLoading(true);
        try{
            const resp = await axios.get(`/client/${org_name}/employee-file-name/`)
           console.log({
               resp
           })

           setFileNames(resp.data.data)
           
           setIsLoading(false);

        }
        catch(err:any){
            console.log({
                err
            })
            if(err.status===401||err.response.status===401){
                handleError(err)
              
            }
           setIsLoading(false);

        }
        setIsLoading(false);


    }



    const handleAddNewInputRow = () => {
        // setObjectivePerspectiveList([
        //   ...objectivePerspectiveList,
        //   { objective_perspective_point: null, perspective_id: "" },
        // ]);

      };

  const onSubmit:SubmitHandler<submitEmployeeDocType>= async (data) =>{
    console.log({data},'data',data.file[0].size,{"actual siix":Math.floor(data.file[0].size/1000)})
    if( Math.floor(data.file[0].size/1000) >600){
        toast({
            title:"Large File Size",
            description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
              status: "error",
              position: "top",
              duration: 5000,
              isClosable: true,
          })
          return
    }

    // console.log({employee_uuid})
    const org_name =localStorage.getItem("current_organization_short_name")
        
        if(!org_name) return
    setIsLoading(true)
    const form = new FormData()
    form.append("name",data.name)
    form.append("file",data.file[0])
    form.append("employee",employee_uuid)

    try{
        const resp =await axios.post(`/client/${org_name}/employee-file/`,form);
        // const confirmResp = resp.
        console.log(resp)
       
            setTimeout(()=>{
                window.location.reload()
            },2000)
            toast({
                title:"Uploaded Successfully",
                // description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
                  status: "success",
                  position: "top",
                  duration: 5000,
                  isClosable: true,
              })

            
        
    }
    catch(err:any){
        console.log({
            err
        })
        if(err.status===401||err.response.status===401){
            handleError(err)
          
        }
       setIsLoading(false);
       

    }
    setIsLoading(false);


}


  useEffect(()=>{
    getAllSavedRequiredFileName()
  },[])
    return(
        <>

<Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
        <Text fontWeight="semibold" color="secondary.900" mb="4">
        Upload Employee File
      </Text>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex my="3" ml="0">
              {/* <Image src={bagIcon} ml={2} /> */}
              <Box ml={2}>
                <Text as="h1" fontWeight="bold">
                  Submit Employee File 
                </Text>
                <Text as="h2" fontSize="md" color="gray.600">
                  {/* Start to su up your organisation structure here */}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton size="xs" />
          <ModalBody>
            <form id="corporate-level"
             onSubmit={handleSubmit(onSubmit)}
             >
           
           {
               writeManually?
               <InputWithLabel
                id="taskfile"
                label="File Type"
                variant="filled"
                bg="secondary.200"
                name="corporate-level"
                
                register={register("name")}
                formErrorMessage={errors.name?.message}
                mb="6"
              />:<FormControl id="perspective_id" gridColumn="span 3">
              <FormLabel htmlFor="perspective_id" fontSize="xs" fontWeight="semibold">File Type</FormLabel>
          <Skeleton isLoaded={!isLoading}>
                  <Select
                      placeholder="Select File Name"
                      variant="filled"
                      bg="secondary.200"
                      color="gray.400"
                      {...register(`name`)}
                      >
                      {fileNames.map((name) => (

                          <option
                          key={name.id}
                          value={name.name}
                          >
                          {name.name}
                          </option>
                      ))}
                      </Select>
          </Skeleton>
             
              {/* Display error message for both fields (perspective id and obj_perspective_point) */}
              {/* <Text fontSize="sm" color="crimson">
                {errors.perspective?.map(p => p?.perspective_id?.message)}
              </Text> */}
              
            </FormControl>
           }
              





              

              <Text>
                  <small>
                      is File type not showing up? click to write
                      <Checkbox isChecked={writeManually}
                      onChange={()=>setWriteManually(!writeManually)}
                      />
                  </small>
              </Text>
            
         


























              <Box>
              <FormLabel fontSize="xs" htmlFor={'submission_file'} fontWeight="semibold">
                 Upload File
              </FormLabel>

              <Input type="file"
                // accept="application/pdf" 
                accept="image/png, image/gif, image/jpeg"
              required
              {...register('file')}
              variant="filled" bg="transparent" 
                    />

              </Box>


<Text>
 
</Text>              
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="corporate-level"
              variant="primary"
              w="full"
              isLoading={isLoading ===true}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default UploadEmployeeDocs