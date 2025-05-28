import  Select from "react-select"

import {
    Input,
    FormControl,
    FormLabel,
    InputProps,
    FormErrorMessage,
    Text,
    Select as ChakraSelect
  } from '@chakra-ui/react';
import {  Controller } from "react-hook-form";
import { allTimeZone } from "../utils/allTimeZone"

  type InputTypeProps =
    | 'text'
    | 'number'
    | 'password'
    | 'email'
    | 'tel'
    | 'date'
    | 'datetime-local'
    | 'url'
    | 'time'
    | 'search';


  interface SelectWithLabelProps extends InputProps {
    id: string;
    bg?: string;
    label: string;
    disabled?: boolean;
    formErrorMessage?: string;
    Name:string;
    setvalue:any;
  }


const SelectWithLabel:React.FC<SelectWithLabelProps>=({
      id,
    variant,
    placeholder,
    label,
    bg,
    disabled,
    formErrorMessage,
    Name,setvalue,
    ...rest
}) => {

  const styles={
    option:(provided:any,state:any)=>({
      ...provided,
      // backgroundColor:"red"
    }),
    control: (provided:any,state:any) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      backgroundColor:"#f2f2f2",
      "outline":"transparent",
    }),
  }
    return (
      <FormControl {...rest}>
        <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
        </FormLabel>
          <Select
        id={id}
        onChange={(e)=>{
          console.log(e)
          if(!e) return ""
            setvalue(Name,e.value)
            return e.value
        }}
          placeholder={placeholder}
          styles={styles}
          isDisabled={disabled}
          isSearchable={true}
          options={allTimeZone}
         />

        

        {/* <FormErrorMessage>{formErrorMessage}</FormErrorMessage> */}
        <Text fontSize="xs" color="crimson">
          {formErrorMessage}
        </Text>
      </FormControl>
    );
  };
  export default SelectWithLabel;
