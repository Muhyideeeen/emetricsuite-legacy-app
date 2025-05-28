import React, { useEffect, useState } from "react";
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  Button,
  FormControl,
  FormLabel,
  Text,
  Select,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { useErrorHandler } from "react-error-boundary";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import InputWithLabel from "../components/InputWithLabel";
import { selectDivision } from "../redux/division/divisionSlice";
import { selectGroup } from "../redux/group/groupSlice";
import { selectDepartment } from "../redux/department/departmentSlice";
import { selectUnit } from "../redux/unit/unitSlice";
import { addDesignation } from "../redux/designation/DesignationAPI";
import { selectDesignation } from "../redux/designation/DesignationSlice";
import { selectCorporate } from "../redux/corporate/corporateSlice";
import SelectAsyncPaginate from "../components/AsyncSelect"

export interface LevelID {
  uuid: string;
}

export type DesignationInputsType = {
  name: string;
  level: string;
  level_id: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name of Designation is required"),
});

const AddDesignation = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },setValue
  } = useForm<DesignationInputsType>({ resolver: yupResolver(schema) });
  const handleError = useErrorHandler()
  const toast =useToast();
  const [selectedLevelNames, setSelectedLevelNames] = useState<
    { name: string; uuid: string }[]
  >([]);

  const dispatch = useAppDispatch();
  const org_name = localStorage.getItem("current_organization_short_name");
const {status,"errorMessage":designationErrorMessage } = useAppSelector(selectDesignation);
const { corporates } = useAppSelector(selectCorporate)
  const { divisions } = useAppSelector(selectDivision);
  const { groups } = useAppSelector(selectGroup);
  const { departments } = useAppSelector(selectDepartment);
  const { units } = useAppSelector(selectUnit);
  const [currentCoprate,setCurrentCoprate]= useState<any>(null);
  const [selectedValue,setSelectedValue] = useState<string|null>(null);
  // Group all levels in an object so they can be accessed dynamically
  const orgLevels = {
    corporate_level: corporates,
    division: divisions,
    group: groups,
    department: departments,
    unit: units,
  };

  const levelField = register("level");
  if(status=='failed'){
    console.log("DesginationError",designationErrorMessage)

  }
  const onSubmit = (data: DesignationInputsType) => {
    const dataToSubmit ={...data,handleError}
console.log(dataToSubmit,"submmited")
    dispatch(addDesignation(dataToSubmit));
    toast({
            title: "Designation Added",
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
          })
    reset();
  };
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value)
    
    const selectedValue = e.target.value;
    // console.log(e.target.value)
    // Please refer to https://dev.to/mapleleaf/indexing-objects-in-typescript-1cgi
    // to understand why the below steps were taken.
    // It is required for indexing objects in typescript
    // @ts-ignore
    function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    // @ts-ignore
      return key in obj;
    }

    if (!selectedValue) {
      setSelectedLevelNames([]);
    } else if (hasKey(orgLevels, selectedValue)) {
      const mappedSelectedLevelNames = orgLevels[selectedValue].map(
        (selectedLevel) => ({
          name: selectedLevel.name,
          uuid: selectedLevel.uuid,
        })
      );
      setSelectedLevelNames(mappedSelectedLevelNames);
    }
  };

  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader fontSize="md">Add Job Designation</DrawerHeader>

      <DrawerBody>
        <form id="add-designation-form" onSubmit={handleSubmit(onSubmit)}>
          <InputWithLabel
            id="designation"
            label="Designation"
            variant="filled"
            bg="secondary.200"
            name="designation"
            register={register("name")}
            formErrorMessage={errors.name?.message}
            mb="5"
            isInvalid={errors.name && true}
          />
          <FormControl mb="5">
            <FormLabel htmlFor="structure_level" fontSize="xs" fontWeight="semibold">
              Pick a Structure Level
            </FormLabel>
            <Select
              placeholder="Select Structure Level"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              id="structure_level"
              {...levelField}
              onChange={(e) => {
                levelField.onChange(e);
                handleLevelChange(e);
              }}
            >
              <option value="corporate-level">Corporate</option>
              <option value="divisional-level">Division</option>
              <option value="group-level">Group</option>
              <option value="departmental-level">Department</option>
              <option value="unit-level">Unit</option>
            </Select>
            <Text fontSize="sm" color="crimson">
              {errors.level?.message}
            </Text>
          </FormControl>

          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontSize="xs" fontWeight="semibold">
              Level Name
            </FormLabel>
            <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              key={selectedValue}
                                  url={`/organization/setup/${selectedValue}/list/${org_name}/?me=1`}
                                  value={currentCoprate}
                                  onChange={(value)=>{
                                    console.log(value?.uuid)
                                    console.log("hwhriher")
                                    // setValue("level",value?.name)
                                    setValue("level_id",value?.uuid)
                                  return   setCurrentCoprate(value)
                                  
                                  }}
                                  SelectLabel={(option:any)=>`${option.name}`}
                                  SelectValue={(option:any)=> {
                                    return `${option.uuid}`
                                  } }
                                  placeholder={""}
              
              />
            
            <Text fontSize="sm" color="crimson">
              {errors.level_id?.message}
            </Text>
          </FormControl>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <Button
          type="submit"
          form="add-designation-form"
          variant="primary"
          w="full"
          isLoading={status === "loading"}
          loadingText="Adding..."
        >
          Add Designation
        </Button>
      </DrawerFooter>
    </>
  );
};

export default AddDesignation;
