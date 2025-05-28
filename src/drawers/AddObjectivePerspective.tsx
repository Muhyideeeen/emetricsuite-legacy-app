import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { createObjective } from '../redux/objectives/objectiveAPI';
// import {
//   clearState,
//   selectObjective,
// } from '../redux/objectives/objectiveSlice';
import InputWithLabel from '../components/InputWithLabel';
// import { selectUser } from '../redux/user/userSlice';
import { useEffect } from 'react';

interface AddObjectivePerspectiveInputs {
  objective_name: string;
  objective_owner: string;
  objective_type: string;
  duration: string;
  start_time: string;
  end_time: string;
  routineType: string;
  financial_target_point: number;
  customer_target_point: number;
  internal_process_target_point: number;
  learning_and_growth_target_point: number;
  total_target: number;
}

const schema = yup.object().shape({
  objective_name: yup.string().required(),
  objective_owner: yup.string().required(),
  objective_type: yup.string().required(),
  duration: yup.string().required(),
  start_time: yup.string().required(),
  end_time: yup.string().required(),
  routineType: yup.string().required(),
  financial_target_point: yup.number().required(),
  customer_target_point: yup.number().required(),
  internal_process_target_point: yup.number().required(),
  learning_and_growth_target_point: yup.number().required(),
  total_target: yup.number().required(),
});

const AddObjectivePerspective = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddObjectivePerspectiveInputs>({ resolver: yupResolver(schema) });
//   const { status } = useAppSelector(selectObjective);
//   const { org_name } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const toast = useToast();

//   const isSubmitting = () => {
//     return status === 'loading';
//   };

  const onSubmit: SubmitHandler<AddObjectivePerspectiveInputs> = data => {
    // dispatch(createObjective({ data, org_name }));
  };

//   useEffect(() => {
//     if (status === 'succeeded') {
//       toast({
//         title: 'Objective Created Successfully',
//         status: 'success',
//         position: 'top',
//         duration: 4000,
//       });
//       dispatch(clearState());
//     }
//     if (status === 'failed') {
//       toast({
//         title: 'Failed to create objective',
//         description: 'Try again',
//         status: 'error',
//         position: 'top',
//         duration: 9000,
//         isClosable: true,
//       });
//       dispatch(clearState());
//     }
//   }, [status]);
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>Create New Objective/Perspective</DrawerHeader>
      <DrawerBody>
        <form
          id="add-objective-perspective-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputWithLabel
            id="objective_name"
            label="Name of Objective/Perspective"
            variant="filled"
            bg="secondary.200"
            mb="5"
            name="objective_name"
            register={register('objective_name', { required: true })}
            formErrorMessage={
              errors.objective_name?.type === 'required'
                ? 'Objective Name is required'
                : undefined
            }
          />
          <InputWithLabel
            id="objective_owner"
            label="Objective Owner"
            variant="filled"
            bg="secondary.200"
            mb="5"
            name="objective_owner"
            register={register('objective_owner', { required: true })}
            formErrorMessage={
              errors.objective_owner?.type === 'required'
                ? 'Objective Owner is required'
                : undefined
            }
          />
          <FormControl id="objective_type" mb="5">
            <FormLabel htmlFor="objective_type">Objective Type</FormLabel>
            <Select
              placeholder="Select type"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              {...register('objective_type', { required: true })}
            >
              <option value="Qualitative">Qualiitative</option>
              <option value="Quantitative">Quantitative</option>
              <option value="Quantitative & Qualitative">
                Quantitative &amp; Qualitative
              </option>
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.objective_type?.message}
            </Text>
          </FormControl>
          <InputWithLabel
            id="duration"
            label="Duration"
            variant="filled"
            bg="secondary.200"
            mb="5"
            name="duration"
            register={register('duration', { required: true })}
            formErrorMessage={
              errors.duration?.type === 'required'
                ? 'Duration is required'
                : undefined
            }
          />
          <InputWithLabel
            id="start_time"
            label="Start Time"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="datetime-local"
            name="start_time"
            register={register('start_time', { required: true })}
            formErrorMessage={
              errors.start_time?.type === 'required'
                ? 'Start Time is required'
                : undefined
            }
          />
          <InputWithLabel
            id="end_time"
            label="End Time"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="datetime-local"
            name="end_time"
            register={register('end_time', { required: true })}
            formErrorMessage={
              errors.end_time?.type === 'required'
                ? 'End Time is required'
                : undefined
            }
          />
          <FormControl id="objective_type" mb="5">
            <FormLabel htmlFor="objective_type">
              Select Routine Options
            </FormLabel>
            <Select
              placeholder="Select type"
              variant="filled"
              bg="secondary.200"
              {...register('routineType', { required: true })}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="bi-annually">Bi-Annually</option>
              <option value="annually">Annually</option>
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.routineType?.message}
            </Text>
          </FormControl>
          <InputWithLabel
            id="financial_target_point"
            label="Financial Target Point"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="number"
            name="financial_target_point"
            register={register('financial_target_point', { required: true })}
            formErrorMessage={
              errors.financial_target_point?.type === 'required'
                ? 'Financial Target Point is required'
                : undefined
            }
          />
          <InputWithLabel
            id="customer_target_point"
            label="Customer Target Point"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="number"
            name="customer_target_point"
            register={register('customer_target_point', { required: true })}
            formErrorMessage={
              errors.customer_target_point?.type === 'required'
                ? 'Customer Target Point is required'
                : undefined
            }
          />
          <InputWithLabel
            id="internal_process_target_point"
            label="Internal Process Target Point"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="number"
            name="internal_process_target_point"
            register={register('internal_process_target_point', {
              required: true,
            })}
            formErrorMessage={
              errors.internal_process_target_point?.type === 'required'
                ? 'Internal Process Target Point is required'
                : undefined
            }
          />
          <InputWithLabel
            id="learning_and_growth_target_point"
            label=" Learning &amp; Growth Target Point"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="number"
            name="learning_and_growth_target_point"
            register={register('learning_and_growth_target_point', {
              required: true,
            })}
            formErrorMessage={
              errors.learning_and_growth_target_point?.type === 'required'
                ? 'Learning & Growth Target Point is required'
                : undefined
            }
          />
          <InputWithLabel
            id="total_targett"
            label="Total Target"
            variant="filled"
            bg="secondary.200"
            mb="5"
            type="number"
            name="total_target"
            register={register('total_target', { required: true })}
            formErrorMessage={
              errors.total_target?.type === 'required'
                ? 'Total Target is required'
                : undefined
            }
          />
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button
          type="submit"
          form="add-objective-perspective-form"
          variant="primary"
          w="full"
        //   isLoading={isSubmitting()}
          loadingText="Creating..."
        >
          Create Objective
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddObjectivePerspective;
