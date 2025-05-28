
import {
    Box,
    Flex,Input,Button
  } from '@chakra-ui/react';
import moment from "moment";
import { useEffect } from 'react';

export const FilterTableData:React.FC<{
    start_date_before:string;
    setStart_date_before:(e:string)=>void
    start_date_after:string;
    setStart_date_after:(e:string)=>void;
    getDataFunction:()=>void;
}>=({setStart_date_after,start_date_after,start_date_before,setStart_date_before,getDataFunction})=>{


    useEffect(()=>{
        let today = new Date();
        let thirtydaysBackfromToday = new Date(new Date().setDate(today.getDate() - 30));
        setStart_date_after(moment(thirtydaysBackfromToday).format("YYYY-MM-DD"));
        setStart_date_before(moment(today).format("YYYY-MM-DD"))
        // getUserPerformance()
    },[])

    useEffect(()=>{
        if(start_date_before&&start_date_after){

            getDataFunction()
        }

    },[start_date_before,start_date_after])
    return (

        <Flex style={{"width":"50%"}} justifyContent="space-between" align={"center"}>
        
        <Flex alignItems={"center"}>

{/* <label>From</label> */}
<label><strong>From</strong>:</label>

<Input 
value={start_date_after}
onChange={(e)=>setStart_date_after(e.target.value)}

type="date" />
</Flex>
        
        
        <Flex  alignItems={"center"}>

                <label><strong>To</strong>:</label>
                <Input 
                    value={start_date_before}
                    onChange={(e)=>setStart_date_before(e.target.value)}
                type="date" />

        </Flex>

       
        
    </Flex>
    )
}


export default FilterTableData