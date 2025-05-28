import {
    Input,
    FormControl,
    FormLabel,
    InputProps,
    FormErrorMessage,
    Text,
    Select 
  } from '@chakra-ui/react';
import {useEffect, useState} from "react";
  interface InputWithLabelProps extends InputProps {
    id: string;
    type?: | 'tel'
    | 'date'
    | 'datetime-local'|'time'|"text";
    bg?: string;
    label: string;
    value:undefined| string;
    name: string;
    disabled?: boolean;
    formErrorMessage?: string;
    setValue:(arg1:any,arg2:any)=>void;
}
const UpdateInput: React.FC<InputWithLabelProps> =({
    id,
    type = 'text',
    variant,
    placeholder,
    label,
    bg,name,
    disabled,
    formErrorMessage,
    value,setValue,
    ...rest
  })=>{
    const [componentData,setComponentData]=useState<undefined|string>(value);

    useEffect(()=>{
setComponentData(value)
    },[componentData])


    return(
        <FormControl {...rest}>
        <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
        </FormLabel>
        <Input
          id={id}
          type={type}
          variant={variant}
          placeholder={placeholder}
          bg={bg}
          value={value}
          disabled={disabled}
          onChange={(e)=>{
              setValue(name,e.target.value);
          }}
        />
        {/* <FormErrorMessage>{formErrorMessage}</FormErrorMessage> */}
        <Text fontSize="xs" color="crimson">
          {formErrorMessage}
        </Text>
      </FormControl>
    )
}

export default UpdateInput