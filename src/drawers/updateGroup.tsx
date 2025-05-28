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
  
  import InputWithLabel from "../components/InputWithLabel";
  import { useAppDispatch, useAppSelector } from "../redux/hooks";
  import { useEffect, useState } from "react";
  import { useForm, SubmitHandler } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
import { selectGroup } from "../redux/group/groupSlice";
import { updateGroup } from "../redux/group/groupAPI";
import { useErrorHandler } from "react-error-boundary";



interface UpdateGroupType{
    name:string;
    // organisation_short_name:string;
    uuid:string;
}

const schema = yup.object().shape({
    name: yup.string().required(),
  });


const UpdateGroup =(props:UpdateGroupType)=>{

    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    const { groups,status,message } = useAppSelector(selectGroup)
    const dispatch = useAppDispatch()
    const handleError = useErrorHandler()
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateGroupType>({ resolver: yupResolver(schema) });
    const toast = useToast();
    
    
    useEffect(()=>{
        // on First Set the field u want to update to the field so the user can update from there
    setValue('name',props.name)
        
    },[])

    useEffect(()=>{

      if(status=='updated'){
        toast({
          title: message,
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
      }
    },[status])



    
    const onSubmit=(data:{name:string})=>{

        
        if(ORG_NAME){

            dispatch(updateGroup({org_name:ORG_NAME,uuid:props.uuid,"name":data.name,handleError}))
        }
    }



    return(
        <>
        <DrawerCloseButton />
        <DrawerHeader fontSize="md">Update  Group</DrawerHeader>
        <DrawerBody>
          <form id="add-perspective-form" 
          onSubmit={handleSubmit(onSubmit)}
          >
            <InputWithLabel
              id="name"
              label=" Name of Corprate"
              variant="filled"
              bg="secondary.200"
              name="name"
              mb="5"
              register={register("name")}
              formErrorMessage={errors.name?.message}
            />
          </form>
        </DrawerBody>
        <DrawerFooter>
          <Button
            type="submit"
            form="add-perspective-form"
            variant="primary"
            w="full"
            size="sm"
            // fontSize="sm"
            isLoading={status === "adding"}
          loadingText="Updateing..."
          >
            Update
          </Button>
        </DrawerFooter>
      </>
    )
}



export default UpdateGroup