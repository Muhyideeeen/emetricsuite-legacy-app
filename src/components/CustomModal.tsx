import {
    Box,
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
    Text,
    useDisclosure,
  } from "@chakra-ui/react";
import React from "react";
import bagIcon from "../assets/icons/bag-frame.svg";

  type OrgSetupFormModalProps =React.PropsWithChildren<{
    // onClose(): void;
    // isOpen: boolean;
    openBtnText:string;
    headingText:string;
    subHeadText:string;
    openBtnTextStyle?:any
    size?:string
  }>
  const CustomModal = ({children,size='4xl',openBtnText,headingText,subHeadText,openBtnTextStyle={}}:OrgSetupFormModalProps):React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button onClick={onOpen} style={openBtnTextStyle}>{ openBtnText }</Button>
        <Modal onClose={onClose} size={size} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex my="3" ml="0">
                <Image src={bagIcon} ml={5} />
                <Box ml={2}>
                  <Text as="h1" fontWeight="bold">
                   {headingText}
                  </Text>
                  <Text as="h2" fontSize="md" color="gray.600">
                  {subHeadText}
                  </Text>
                </Box>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default CustomModal;
  