import {
    Input,
    FormControl,
    FormLabel,
    InputProps,
    FormErrorMessage,
    Text,
    Select 
  } from '@chakra-ui/react';

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


  interface ReuseableSelectWithLabelProps extends InputProps {
    id: string;
    // type?: InputTypeProps;
    bg?: string;
    label: string;
    // value?: string | number;
    name?: string;
    register?: any;
    disabled?: boolean;
    formErrorMessage?: string;
    valueList:string[];
  }


const ReuseableSelectWithLabel:React.FC<ReuseableSelectWithLabelProps>=({
      id,
    // type = 'text',
    variant,
    placeholder,
    label,
    bg,
    disabled,
    register,
    formErrorMessage,
    valueList,
    ...rest
}) => {
    return (
      <FormControl {...rest}>
        <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
        </FormLabel>
        {/* <Input
          id={id}
          type={type}
          variant={variant}
          placeholder={placeholder}
          bg={bg}
          disabled={disabled}
          {...register}
        /> */}

        <Select
                  id={id}
        //   type={type}
          variant={variant}
          placeholder={placeholder}
          bg={bg}
          disabled={disabled}
          {...register}
        >

    {
       valueList.map(data=><option value={data}>{data}</option>)
    }
        </Select>

        {/* <FormErrorMessage>{formErrorMessage}</FormErrorMessage> */}
        <Text fontSize="xs" color="crimson">
          {formErrorMessage}
        </Text>
      </FormControl>
    );
  };
  export default ReuseableSelectWithLabel;
