import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  Input,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";

const AddTaskSpread = () => {
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>Create New Task Spread</DrawerHeader>
      <DrawerBody>
        <form
          id="my-form"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submitted");
          }}
        >
          <FormControl id="name_of_objective" mb="5">
            <FormLabel htmlFor="name_of_objective">
              Name of Objective/Perspective
            </FormLabel>
            <Input type="text" variant="filled" bg="secondary.200" />
          </FormControl>
          <Flex mb="5">
            <FormControl flex="2" id="objective_owner" mb="5">
              <FormLabel htmlFor="objective_owner">Task 1</FormLabel>
              <Input type="text" variant="filled" bg="secondary.200" />
            </FormControl>
            <FormControl flex="1" id="objective_owner" mb="5" ml="2">
              <FormLabel htmlFor="objective_owner" wordBreak="normal">
                Cont Target Point
              </FormLabel>
              <Input type="number" variant="filled" bg="secondary.200" />
            </FormControl>
          </Flex>
          <Flex mb="5">
            <FormControl flex="2" id="objective_owner" mb="5">
              <FormLabel htmlFor="objective_owner">Task 2</FormLabel>
              <Input type="text" variant="filled" bg="secondary.200" />
            </FormControl>
            <FormControl flex="1" id="objective_owner" mb="5" ml="2">
              <FormLabel htmlFor="objective_owner" wordBreak="normal">
                Cont Target Point
              </FormLabel>
              <Input type="number" variant="filled" bg="secondary.200" />
            </FormControl>
          </Flex>
          <Flex mb="5">
            <FormControl flex="2" id="objective_owner" mb="5">
              <FormLabel htmlFor="objective_owner">Task 3</FormLabel>
              <Input type="text" variant="filled" bg="secondary.200" />
            </FormControl>

            <FormControl flex="1" id="objective_owner" mb="5" ml="2">
              <FormLabel htmlFor="objective_owner" wordBreak="normal">
                Cont Target Point
              </FormLabel>
              <Input type="number" variant="filled" bg="secondary.200" />
            </FormControl>
          </Flex>
          <Flex mb="5">
            <FormControl flex="2" id="objective_owner" mb="5">
              <FormLabel htmlFor="objective_owner">Task 4</FormLabel>
              <Input type="text" variant="filled" bg="secondary.200" />
            </FormControl>

            <FormControl flex="1" id="objective_owner" mb="5" ml="2">
              <FormLabel htmlFor="objective_owner" wordBreak="normal">
                Cont Target Point
              </FormLabel>
              <Input type="number" variant="filled" bg="secondary.200" />
            </FormControl>
          </Flex>
          <Flex mb="5">
            <FormControl flex="2" id="objective_owner" mb="5">
              <FormLabel htmlFor="objective_owner">Task 5</FormLabel>
              <Input type="text" variant="filled" bg="secondary.200" />
            </FormControl>

            <FormControl flex="1" id="objective_owner" mb="5" ml="2">
              <FormLabel htmlFor="objective_owner" wordBreak="normal">
                Cont Target Point
              </FormLabel>
              <Input type="number" variant="filled" bg="secondary.200" />
            </FormControl>
          </Flex>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button type="submit" form="my-form" variant="primary" w="full">
          Create Strategy
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddTaskSpread;
