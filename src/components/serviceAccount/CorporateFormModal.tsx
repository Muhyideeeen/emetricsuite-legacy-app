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
} from "@chakra-ui/react";
import bagIcon from "../../assets/icons/bag-frame.svg";

const CorporateFormModal = ({onClose, isOpen}:{onClose:() => void, isOpen:boolean}) => {

  return (
    <>
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
            {/* <form id="corporate-level">
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
                register={register("organizationShortName")}
                formErrorMessage={errors.organizationShortName?.message}
              />
            </form> */}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="corporate-level"
              variant="primary"
              w="full"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CorporateFormModal;
