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
import { useErrorHandler } from "react-error-boundary";
import InputWithLabel from "../components/InputWithLabel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectPerspective } from "../redux/perspective/perspectiveSlice";
import { addPerspective } from "../redux/perspective/perspectiveAPI";

export interface AddPerspectiveInputs {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
});

const AddNewPerspective = () => {
  const { status } = useAppSelector(selectPerspective);
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPerspectiveInputs>({ resolver: yupResolver(schema) });
  const toast = useToast();

  const onSubmit: SubmitHandler<AddPerspectiveInputs> = (data) => {
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    if (ORG_NAME) {
      dispatch(addPerspective({ data, ORG_NAME ,handleError }));
    }
  };
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader fontSize="md">Create New Perspective</DrawerHeader>
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
          loadingText="Creating..."
        >
          Create Perspective
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddNewPerspective;
