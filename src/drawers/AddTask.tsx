import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Button,
    Input,
    FormControl,
    FormLabel,
    HStack,
  } from '@chakra-ui/react';
  
  const AddTask = () => {
    return (
      <>
        <DrawerCloseButton />
        <DrawerHeader fontSize="md">Create New Task</DrawerHeader>
        <DrawerBody>
          <form
            id="my-form"
            onSubmit={e => {
              e.preventDefault();
              console.log('submitted');
            }}
          >
            <FormControl id="name_of_task" mb="5">
              <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="name_of_task">Name of Task</FormLabel>
              <Input size="sm" type="email" variant="filled" bg="secondary.200" />
            </FormControl>
  
            <HStack mb="5" align="baseline">
              <FormControl id="tat_target_end_date">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="tat_target_end_date">
                  TAT Target End Date
                </FormLabel>
                <Input size="sm" type="date" variant="filled" bg="secondary.200" />
              </FormControl>
              <FormControl id="tat_target_end_time">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="tat_target_end_time">End Time</FormLabel>
                <Input size="sm" type="text" variant="filled" bg="secondary.200" />
              </FormControl>
            </HStack>
            <HStack mb="5" align="baseline">
              <FormControl id="qty_target_points">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="qty_target_points">
                  Quantity Target Points
                </FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
              <FormControl id="qty_target_units">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="qty_target_units">
                  Quantity Target Units
                </FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
            </HStack>
            <HStack mb="5" align="baseline">
              <FormControl id="qly_target_points">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="qly_target_points">
                  Quality Target Points
                </FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
              <FormControl id="tat_target_points">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="tat_target_points">
                  Tat Target Points
                </FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
            </HStack>
  
            <HStack mb="5" align="baseline">
              <FormControl id="my_cont_target">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="my_cont_target">My Cont Target</FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
              <FormControl id="team_cont_target">
                <FormLabel fontSize="xs" fontWeight="semibold" htmlFor="team_cont_target">Team Cont Target</FormLabel>
                <Input size="sm" type="number" variant="filled" bg="secondary.200" />
              </FormControl>
            </HStack>
          </form>
        </DrawerBody>
        <DrawerFooter>
          <Button type="submit" form="my-form" variant="primary" w="full">
            Create Task
          </Button>
        </DrawerFooter>
      </>
    );
  };
  
  export default AddTask;
  