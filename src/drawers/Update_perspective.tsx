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
  
  import { useForm, SubmitHandler } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import InputWithLabel from "../components/InputWithLabel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectPerspective } from "../redux/perspective/perspectiveSlice";
import { useEffect, useState } from "react";
import { PerspectiveParameter, UpdatePerspective } from "../redux/perspective/perspectiveAPI";
import { useSelector } from "react-redux";

   interface UpdatePerspectiveInputs {
    name: string;
  }
  
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  

const Update_perspective = (props:any)=>{
  
  const [perspective,setPerspective]=useState(props.perspective)
  const { status } = useSelector(selectPerspective);
  const dispatch = useAppDispatch()
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePerspectiveInputs>({ resolver: yupResolver(schema) });
  const toast = useToast();


  const onSubmit=(data:any)=>{
    let updated_perspective:PerspectiveParameter
    updated_perspective= {...perspective,"name":data.name}

    const ORG_NAME = localStorage.getItem("current_organization");
    if (ORG_NAME) {
      dispatch(UpdatePerspective({ORG_NAME,updated_perspective}));
    }
    
  }
  useEffect(()=>{
    // on load of this componet set this name to the form
    // console.log(pro)
    setValue('name',perspective.name)
  },[ ])

    return (

      <>
      <DrawerCloseButton />
      <DrawerHeader fontSize="md">Update  Perspective</DrawerHeader>
      <DrawerBody>
        <form id="add-perspective-form" onSubmit={handleSubmit(onSubmit)}>
          <InputWithLabel
            id="name"
            label=" Name of Perspective"
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
          loadingText="Updating Please Wait..."
        >
          Update Perspective
        </Button>
      </DrawerFooter>
    </>

    )
}


export default Update_perspective