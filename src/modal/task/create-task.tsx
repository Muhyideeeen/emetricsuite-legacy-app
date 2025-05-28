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
import { HiOutlinePlus } from "react-icons/hi";
  import bagIcon from "../../assets/icons/bag-frame.svg";
import TaskCreateForm from "../../form/TaskCreateForm";


const CreateTaskModal = ( )=>{

  const { isOpen, onOpen, onClose } = useDisclosure();


    
    return (
        <>
        <Button
            variant={"primary"}
            leftIcon={<HiOutlinePlus />}
        onClick={onOpen}>Add Task</Button>
        <Modal onClose={onClose} size="4xl" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex my="3" ml="0">
                <Image src={bagIcon} ml={5} />
                <Box ml={2}>
                  <Text as="h1" fontWeight="bold">
                    Setup Task
                  </Text>
                  <Text as="h2" fontSize="md" color="gray.600">
                    Start setting up your Task here
                  </Text>
                </Box>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                        <TaskCreateForm />   
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )

}


export default CreateTaskModal