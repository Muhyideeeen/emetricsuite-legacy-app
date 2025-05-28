import { useEffect } from "react";
import {
  Box,
  Text,
  Center,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AppBar from "../../components/AppBar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useHistory } from 'react-router-dom'
import { useErrorHandler } from "react-error-boundary";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputWithLabel from "../../components/InputWithLabel";
import bagIcon from "../../assets/icons/bag-frame.svg";
import { setupCorporate } from "../../redux/corporate/corporateAPI";
import { selectCorporate } from "../../redux/corporate/corporateSlice";

export interface CorporateInputs {
  corporateName: string;
  organizationShortName: string;
}

const corporateSchema = yup.object().shape({
  corporateName: yup.string().required("Corporate Level Name is required"),
  organizationShortName: yup
    .string()
    .required("Organisation Short Name is required"),
});

const SetupCorporate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CorporateInputs>({
    resolver: yupResolver(corporateSchema),
  });
  const { status, message, errorMessage } =
    useAppSelector(selectCorporate);
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();
  const handleError = useErrorHandler();


  const onSubmit: SubmitHandler<CorporateInputs> = (submitedData) => {
    const data ={...submitedData,handleError}
    dispatch(setupCorporate(data));
  };

  // get the organzation short name form local storgae
  let current_organization_short_name = localStorage.getItem('current_organization_short_name');
  if(!current_organization_short_name){
    current_organization_short_name="Please You Need to Re-Login Somthing Went Wrong"
  }
  const isSubmitting = () => {
    return status === 'adding';
  }

  useEffect(() => {
    if (status === "added") {
      toast({
        title: message,
        status: "success",
        position: "top",
        duration: 5000,
      });
      history.push('/admin/organization-structure');
    }

    if (status === "failed") {
      toast({
        title: errorMessage,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status]);
  return (
    <>
      <AppBar
        heading="Corporate Level"
        avatar="/logo192.png"
        imgAlt="Jane Doe's avatar"
      />
      <Center h="full">
          <Box mt="8" textAlign="center">
            <Text fontWeight="semibold" color="secondary.900" mb="4">
              Setup your Corporate Level below
            </Text>
            <Button onClick={onOpen}>Setup Corporate Level</Button>
            <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <Flex my="3" ml="0">
                    <Image src={bagIcon} ml={2} />
                    <Box ml={2}>
                      <Text as="h1" fontWeight="bold">
                        Setup Corporate Level
                      </Text>
                      <Text as="h2" fontSize="md" color="gray.600">
                        Start setting up your organisation structure here
                      </Text>
                    </Box>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton size="xs" />
                <ModalBody>
                  <form id="corporate-level" onSubmit={handleSubmit(onSubmit)}>
                    <InputWithLabel
                      id="corporate-level"
                      label="Enter Corporate Level"
                      variant="filled"
                      bg="secondary.200"
                      name="corporate-level"
                      register={register("corporateName")}
                      formErrorMessage={errors.corporateName?.message}
                      mb="6"
                    />
                    <InputWithLabel
                      id="organizationShortName"
                      label="Organization Short Name"
                      size="lg"
                      variant="filled"
                      placeholder=""
                      bg="secondary.200"
                      isReadOnly={true}
                      value={current_organization_short_name}
                      register={register("organizationShortName")}
                      formErrorMessage={errors.organizationShortName?.message}
                    />
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    form="corporate-level"
                    variant="primary"
                    w="full"
                    isLoading={isSubmitting()}
                    loadingText="Submitting"
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
      </Center>
    </>
  );
};

export default SetupCorporate;
