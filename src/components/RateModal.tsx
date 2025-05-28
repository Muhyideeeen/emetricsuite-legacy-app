import { useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
const RateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  return (
    <>
      <Button onClick={onOpen} size="sm" variant="primary">
        Rate
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
          <ModalHeader />
          <ModalCloseButton size="sm" />
          <ModalBody pb={6}>
            <Flex mb="10">
              <Box pr="2">
                <FormControl>
                  <FormLabel>Enter Rate Score: (Qty &amp; Qly)</FormLabel>
                  <Input type="text" variant="filled" ref={initialRef} />
                </FormControl>
              </Box>
              <Box pl="2">
                <FormControl>
                  <FormLabel>Enter Rate Score: (Qty)</FormLabel>
                  <Input type="text" variant="filled" />
                </FormControl>
              </Box>
            </Flex>
            <FormControl>
              <FormLabel>Enter Your Remark</FormLabel>
              <Textarea
                variant="filled"
                rows={8}
                resize="none"
                placeholder="Enter your Remark here"
              ></Textarea>
            </FormControl>
            <Text as="small" display="block" mt="4">By Clicking Rate and Submit below, you won't be able to make changes again</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" mr={3}>
              Rate and Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RateModal;
