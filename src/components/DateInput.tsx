import {Controller} from "react-hook-form";
import DatePicker from 'react-datepicker';
import getDay from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
    Text,Box
}from '@chakra-ui/react';
import {useState} from "react"
interface CalendarInputWithoutPastProp{
    name:string;
    control:any;
    placeholder?:string;
    formErrorMessage?:string;
    dateFormat:string;
    // excludeDates:[]
}

export const CalendarInputWithoutPast:React.FC<CalendarInputWithoutPastProp> =({
    name,
    control,
    placeholder="Enter Date",
    formErrorMessage,
    dateFormat,
    // excludeDates=[]
})=>{



    return (

        <Box>


                <Controller 
                            name={name}
                            control={control}
                            defaultValue={new Date()}
                            render={({field})=>(
                                <DatePicker 
                                selected={field.value } 
                                onChange={(e)=>field.onChange(e)}
                                placeholderText={placeholder}
                                className="chakra-input css-gzp9gs"
                                minDate={new Date()}
                                dateFormat={dateFormat}
                                // excludeDates={excludeDates}
                                />
                            )}
                />

                <Text fontSize="xs" color="crimson">
                    {formErrorMessage} 
                </Text>

        </Box>
    )
}



// 40
export interface ExcludeDaysInCalendarProp{
    days_array:number[]
    name:string;
    control:any;
    placeholder?:string;
    formErrorMessage?:string;
    dateFormat:string;
    disabled?:boolean;
    required?:boolean;
    defaultValue?:Date;
}
// isDisabled
// isRequired
export const ExcludeDaysInCalendar:React.FC<ExcludeDaysInCalendarProp>=({
    days_array=[],
    name,
    control,
    placeholder="Enter Date",
    formErrorMessage,
    dateFormat,
    disabled=false,
    required=true,
    defaultValue=new Date(),
})=>{
    
    const [startDate, setStartDate] = useState<Date|null>(null);
    const isWeekday = (date:Date) => {
      const day = date.getDay();
      return days_array.includes(day);
    };
console.log({defaultValue})
    return (

        <Box>

<Controller 
name={name}
control={control}
defaultValue={defaultValue}
render={
    ({field})=>(
<DatePicker
        onChange={(e)=>field.onChange(e)}
        disabled={disabled}
        required = {required}
        selected={field.value}
        // onChange={(date) => setStartDate(date)}
        filterDate={isWeekday}
        placeholderText={placeholder}
        minDate={new Date()}
        dateFormat={dateFormat}
        className="chakra-input css-gzp9gs"
      />
    )}/>

<Text fontSize="xs" color="crimson">
    {formErrorMessage} 
</Text>
 </Box>
    )
}