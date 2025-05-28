import {
    Input,
    FormControl,
    FormLabel,
    InputProps,
    FormErrorMessage,
    Text,
    Select ,Box
  } from '@chakra-ui/react';
import {Controller} from "react-hook-form";
import getDay from 'react-datepicker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react"
import {convertStringToDate} from "../services/extraFunctions"
import moment from "moment";
interface EditableDateInputWithLabelType{
  // we parse string which is return from the server then all we need is to use "convertStringToDate" to convert to dqte
  DefualtValue:string;
  fieldName:string;
  name:string;
  setValue:(fieldName:any,fieldValue:any)=>void
  label:string;
  id:string;
}
const EditableDateInputWithLabel:React.FC<EditableDateInputWithLabelType> = ({
  DefualtValue,fieldName,setValue,name,label,id,...rest
})=>{

    return <>
    <FormControl {...rest}>
    <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
    </FormLabel>

    <DatePicker
      value={DefualtValue}
      className="chakra-input css-gzp9gs"
      onChange={(date)=>{
        if(date){
          setValue(fieldName, moment(date).format("MM/DD/YYYY"))
        }
        }}
      />
    </FormControl>
 
    </>


}

export default EditableDateInputWithLabel;


















export interface ExcludeDaysInCalendarProp{
  days_array:number[]
  name:string;
  formErrorMessage?:string;
  dateFormat:string;
  DefualtValue:string;
  fieldName:string;
  setValue:(fieldName:any,fieldValue:any)=>void
  label:string;
  id:string;
  disabled?:boolean;
}
export const EditableExcludeDaysInCalendar:React.FC<ExcludeDaysInCalendarProp>=({
  days_array=[],
  name,
  formErrorMessage,
  dateFormat,DefualtValue,fieldName,setValue,label,disabled=false,id,...rest
})=>{
  
  const [startDate, setStartDate] = useState<Date|null>(null);
  const isWeekday = (date:Date) => {
    const day = date.getDay();
    return days_array.includes(day);
  };

  return (

      <Box>
   <FormControl {...rest}>
    <FormLabel fontSize="xs" htmlFor={id} fontWeight="semibold">
          {label}
    </FormLabel>

<DatePicker
  value={DefualtValue}
  onChange={(date)=>{
    if(date){
      setValue(fieldName, moment(date).format("MM/DD/YYYY"))
    }
    }}
      filterDate={isWeekday}
      // minDate={new Date()}
      dateFormat={dateFormat}
      className="chakra-input css-gzp9gs"
      disabled={disabled}
    />


<Text fontSize="xs" color="crimson">
  {formErrorMessage} 
</Text>
</FormControl >

</Box>
  )
}
