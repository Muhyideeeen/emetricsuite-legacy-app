import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  HStack,
} from "@chakra-ui/react";

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import InputWithLabel from "../components/InputWithLabel";

export interface AddTeamInputs {
    desgination: string;
    team: string;
  }
  const schema = yup.object().shape({
    desgination: yup.string().required(),
    team: yup.string().required(),
  });

const AddTeam = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<AddTeamInputs>({ resolver: yupResolver(schema) });
    
      const onSubmit: SubmitHandler<AddTeamInputs> = data => {
        console.log(data);
        
      };
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader>Add Team</DrawerHeader>
      <DrawerBody>
        <form id="add-team-form" onSubmit={handleSubmit(onSubmit)}>
          <InputWithLabel
            id="desgination"
            label="Desgination"
            variant="filled"
            bg="secondary.200"
            name="desgination"
            register={register("desgination", { required: true })}
            formErrorMessage={errors.desgination?.message}
            mb="5"
          />

          <InputWithLabel
            id="team"
            label="Team"
            variant="filled"
            bg="secondary.200"
            name="team"
            register={register("team", { required: true })}
            formErrorMessage={errors.team?.message}
            mb="5"
          />
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button type="submit" form="add-jd-form" variant="primary" w="full">
          Add Team
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddTeam;
