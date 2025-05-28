import {
    Input,
    FormControl,
    FormLabel,
    InputProps,
    FormErrorMessage,
    Text,
    Select ,Box
  } from '@chakra-ui/react';
import { useState } from 'react';
  import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai"
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
  interface InputWithLabelProps extends InputProps {
    id: string;
    type?: InputTypeProps;
    bg?: string;
    label: string;
    value?: any;
    name?: string;
    register?: any;
    disabled?: boolean;
    formErrorMessage?: string;
  }
  
  const InputWithLabel: React.FC<InputWithLabelProps> = ({
    id,
    type = 'text',
    variant,
    placeholder,
    label,
    bg,
    disabled,
    register,
    formErrorMessage,
    value,
    ...rest
  }) => {
    const [eye,setEye] =useState<boolean>(false)
    return (
      <FormControl {...rest}>
        <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
        </FormLabel>
      <Box style={{"position":"relative"}}> 
        <Input
            id={id}
            type={eye?"text":type}
            variant={variant}
            placeholder={placeholder}
            bg={bg}
            disabled={disabled}
            value={value}
            {...rest}
            {...register}
          />

          {
            type==="password"?
          <Box 
          style={{"cursor":"pointer","position":"absolute",
          "right":"15px","top":"10px","fontSize":"1.5rem"}}
          onClick={(e)=>setEye(!eye)}
          >
            {
              eye?
              <AiFillEye />
              :
              <AiFillEyeInvisible/>
            }
          </Box>
          :""
          }
      </Box>

        {/* <FormErrorMessage>{formErrorMessage}</FormErrorMessage> */}
        <Text fontSize="xs" color="crimson">
          {formErrorMessage}
        </Text>
      </FormControl>
    );
  };
  
  export default InputWithLabel;
  