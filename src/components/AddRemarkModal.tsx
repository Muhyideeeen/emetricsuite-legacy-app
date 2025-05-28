import { useRef } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
const AddRemarkModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  return (
    <>
      <Button onClick={onOpen} textDecoration="underline" size="sm" variant="ghost">
        Input Remark
      </Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Remark</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Remark:</FormLabel>
              <Textarea
                ref={initialRef}
                placeholder="Enter your remark here"
                resize="none"
                rows={8}
              ></Textarea>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" mr={3}>
              Add Remark
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRemarkModal;
