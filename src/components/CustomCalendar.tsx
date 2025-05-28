// @ts-ignore
import {Calendar,dateFnsLocalizer} from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState,useCallback } from "react"
import { Box } from "@chakra-ui/react"


const locales = {
    "en-US":require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
    format,parse,startOfWeek,getDay,locales
}) 


const events =[
    {
         title:'Big Meeting',
         start:new Date(2022,8,0),
         end: new Date(2022,8,0)
    },
    {
        title:'Vacation',
        start:new Date(2022,8,0),
        end: new Date(2022,8,0)
   },
   {
    title:'Conference',
    start:new Date(2022,8,0),
    end: new Date(2022,8,0)
},

]

export type EventType ={
    title:string;
    start:string;
    end:string;
}

type Prop ={
    eventData:EventType[];
}
const CustomCalendar = ({eventData}:Prop):React.ReactElement=>{
    const Views = {
        'WEEK':'WEEK',
        'MONTH':'MONTH',
        'DAY':'DAY'
    }
    // const [date, setDate] = useState(new Date(2015, 3, 1))
    // const [view, setView] = useState(Views.WEEK)


    // const onNavigate = useCallback((newDate) => setDate(newDate), [setDate])
    // const onView = useCallback((newView) => setView(newView), [setView])
    console.log({eventData})
    return (
        <Box>
        
        <Box>
            <Calendar localizer={localizer} events={eventData} 
            startAccessor='start' endAccessor='end' 
             style={{ height:500,margin:'50px'}}
            // view={view}
            // onNavigate={onNavigate}
            // onView={onView}
             />
        </Box>
    </Box>
    )
}


export default CustomCalendar