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
    | 'tel'
    | 'date'
    | 'datetime-local'|'time'
    ;
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
  
  const DateInputWithLabel: React.FC<InputWithLabelProps> = ({
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
    return (
      // @ts-ignore
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
          disabled={disabled}
        //   value={value}
          {...register}
        />
        {/* <FormErrorMessage>{formErrorMessage}</FormErrorMessage> */}
        <Text fontSize="xs" color="crimson">
          {formErrorMessage}
        </Text>
      </FormControl>
    );
  };
  
  export default DateInputWithLabel;
  