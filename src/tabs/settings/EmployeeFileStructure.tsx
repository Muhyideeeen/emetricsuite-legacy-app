import {useState,useEffect} from "react"
import {
    Flex , Grid,
    FormLabel,Heading,Input,
    Button,Box,useToast,useDisclosure
} from "@chakra-ui/react";
import { v4 as uuid_v4 } from 'uuid';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import axios,{baseURL} from "../../services/api";
import Preloader from "../../components/Preloader";
import {useErrorHandler} from "react-error-boundary";
import errorMessageGetter from "../../utils/errorMessages";
import UploadEmployeeDocs from "../../modal/UploadEmployeeDocs"
/*
isSaved => when geting from the end point as we fill the content in the box we set isSaved to true who in turn set the 
            box to disabled
*/

const EmployeeFileStructure = ()=>{
    const toast=useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

    const handleError = useErrorHandler();
    const  [requiredNames,setRequiredNames] =useState<{
      id:string,name:string,isSaved:boolean,
    }[]>([])
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const [newFileName,setnewFileName]=useState<string>();
    const handleAddNewInputRow = async (value?:string)=>{
        const org_name =localStorage.getItem("current_organization_short_name")
        if(!org_name) return
    //    we put the loader and async request here
    setIsLoading(true)
       if(value){
        try{
            const resp = await axios.post(`/client/${org_name}/employee-file-name/`,{
                "name":value
            })
            const data = resp.data.data            
            console.log({
                resp
            })
            setRequiredNames([
                ...requiredNames,{id:data.id,name:data.name,isSaved:true}
            ])
            setnewFileName("")
            toast({
                title: "Created Successfully",
                status: "success",
                position: "top",
                duration: 3000,
                isClosable: true,
              })
        }  
        catch(err:any){
            console.log("pers err", err);
            if(err.response.status==401){
              handleError(err)
            }
            // if(err.response.data)
            
            toast({
                title: errorMessageGetter(err.response)||"Something went wrong",
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
              })
        } 


       }
       
       setIsLoading(false)
    
    }

    const handleDelete= async(id:string)=>{
        const org_name =localStorage.getItem("current_organization_short_name")
        
        if(!org_name) return 
        setIsLoading(true);

        // 
        try{
            const resp = await axios.delete(`/client/${org_name}/employee-file-name/${id}/`)
            const confirmResp=resp.data.data
            setRequiredNames(requiredNames.filter((data)=>{

                return id!==data.id
            }));
            toast({
                title: "Deleted Successfully",
                status: "success",
                position: "top",
                // duration: 3000,
                isClosable: true,
              })
        setIsLoading(false);

        }
        
        catch(err:any){
            console.log("pers err", err);
            if(err.response.status==401){
              handleError(err)
            }
            // if(err.response.data)
            
            toast({
                title: errorMessageGetter(err.response)||"Something went wrong",
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
              })
        }
       setIsLoading(false)

    }
   
    const getAllSavedRequiredFileName = async ()=>{
        const org_name =localStorage.getItem("current_organization_short_name")
        
        if(!org_name) return 
        setIsLoading(true);
        try{
            const resp = await axios.get(`/client/${org_name}/employee-file-name/`)
           console.log({
               resp
           })
           setRequiredNames(resp.data.data.map((data:any)=>{
               return {"id":data.id,name:data.name,isSaved:true}
           }))
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

    useEffect(()=>{
        getAllSavedRequiredFileName()
    },[])
    return (
        <>
        {isLoading&&<Preloader/>}
        {/* <Heading style={{"textAlign":"center"}}>Struture Of Required Files</Heading> */}
        <Box
            style={{
                "width":"60%",
                "margin":"0 auto",
                "textAlign":"center"
            }}
        >
            <Input placeholder="Enter File Name"
            value={newFileName}
            disabled={isLoading}
            onChange={(e)=>setnewFileName(e.target.value)}
            />
            <Button
            leftIcon={<RiAddLine />}
            mb="2"
            bg="secondary.200"
            variant="solid"
            onClick={(e)=>handleAddNewInputRow(newFileName)}
          >
            Create File Name
                    </Button>
        </Box>
        <br/>
        <Grid
                            key={uuid_v4()}
              gridTemplateColumns="repeat(3, 1fr)"
              alignItems="end"
              columnGap="3"
              rowGap={"3"}
              mb="3"
        width={"70%"}
              style={{
               
                "margin": "0 auto",
                // "minHeight":"100%",
                // "overflowY":"scroll"
    
            }}
              >
                    {
                        requiredNames.map((data,index)=>(
                           
                <Box 
                //   key={index} 
                style={{"position":"relative",
                // "border":'1px solid red'
                }}>
                    <Input 
                    key={index}
                    placeholder={"file Name"}
                   

                      disabled={data.isSaved} 
                    //   onInputCh
                       value={data.name}
                      />
                        <Button
                        leftIcon={<RiDeleteBinLine/>}
                        mb="2"
                        bg="secondary.200"
                        variant="solid"
                        style={{
                            "position":"absolute",
                            "top":"0",
                            "right":"0",
                            "fontSize":".8rem"
                        }}
                        onClick={(e)=>handleDelete(data.id)}
                        >

                        </Button>
                </Box>
        
                        ))
                    }
                     
                </Grid>
                    

 
        </>
    )
}


export default EmployeeFileStructure