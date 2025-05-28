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
import bagIcon from "../../assets/icons/bag-frame.svg";
import OrganisationSetupForm from "./OrganisationSetupForm";

interface OrgSetupFormModalProps {
  onClose(): void;
  isOpen: boolean;
}
const OrganisationSetupFormModal = ({orgLevel}: {orgLevel:number}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Setup Organisation Structure</Button>
      <Modal onClose={onClose} size="4xl" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex my="3" ml="0">
              <Image src={bagIcon} ml={5} />
              <Box ml={2}>
                <Text as="h1" fontWeight="bold">
                  Setup Organisational Structure
                </Text>
                <Text as="h2" fontSize="md" color="gray.600">
                  Start setting up your organisation structure here
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrganisationSetupForm orgLevel={orgLevel} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrganisationSetupFormModal;
