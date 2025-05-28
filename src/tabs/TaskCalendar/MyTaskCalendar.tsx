import { Box, Flex, Grid, Input, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useErrorHandler } from "react-error-boundary"
import axios from "../../services/api"
import { getLoggedin_userEmail } from "../../services/auth.service"
import errorMessageGetter from "../../utils/errorMessages"
import moment from "moment";
import CustomCalendar, { EventType } from "../../components/CustomCalendar"
import Preloader from "../../components/Preloader"
import CardList from "../../components/CardList"







type Prop ={
    user_id:string;
    is_team?:boolean;
    is_dash?:boolean;//just shpow the dashboard onlyu
}
type dashboardDataType={
    "active_days": number,
    "active hours": number,
    "inactive_days": number,
    "inactive_hours": number
}
const MyTaskCalendar= ({ user_id,is_team=false,is_dash=false }:Prop):React.ReactElement=>{
    
    const toast = useToast()
    const [isLoading,setIsLoading]=useState(false);
    const [isLoadingDashboard,setisLoadingDashboard] = useState(false)
    const  [dashboardData,setDashboardData] = useState<dashboardDataType>({
        "active_days": 0,
        "active hours": 0,
        "inactive_days": 0,
        "inactive_hours": 0
    })
    const [start_date,setStart_date] = useState<string>(moment(new Date()).format("YYYY-MM-DD"))//date_after
    const [end_date,setEnd_date] = useState<string>(moment(
        new Date(new Date().setDate(new Date().getDate() +35))//date_before
    ).format('YYYY-MM-DD'))
    const [events,setEvents] = useState<null|EventType[]>() 
    const handleError= useErrorHandler();
    
    const get_user_calendar = async ()=>{
        const org_name = localStorage.getItem('current_organization_short_name');
        setIsLoading(true)
        try{
            // 
            const resp:any =await axios.get(`/client/${org_name}/calendar/${is_team?'team':'user'}/${user_id}/?date_before=${end_date}&date_after=${start_date}`)
           
            setEvents(resp.data.map((original_event:any)=>{
                return {
                    'title':original_event.task.name,
                    'start':new Date(original_event.start_time),
                    'end':new Date(original_event.end_time),}
            }))
            setIsLoading(false)

        }catch(err:any){
        setIsLoading(false)

            if(err?.response.status==401){
                handleError(err)
              }else{
                toast({
                    title: errorMessageGetter(err),
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                  });
              }

              

        }   
        
    }
    const get_user_calendar_dashboard = async ()=>{
        const org_name = localStorage.getItem('current_organization_short_name');
        
        setisLoadingDashboard(true);
        try{
            const resp:any =await axios.get(`/client/${org_name}/calendar/${is_team?'team':'user'}/${user_id}/dashboard/?date_before=${end_date}&date_after=${start_date}`)
            
            if(resp.data.status===200){
                const data = resp.data.data as dashboardDataType
                setDashboardData(data)
            }

            setisLoadingDashboard(false)
        }
        catch(err:any){
            if(err?.response.status==401){
                handleError(err)
                setisLoadingDashboard(false)

            }else{
                  setisLoadingDashboard(false)

                toast({
                    title: errorMessageGetter(err),
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                  });    
                }
        }


        }

    useEffect(()=>{

        if(is_dash){
            get_user_calendar_dashboard()
            
        }else{
            get_user_calendar()
            get_user_calendar_dashboard()

        }
    },[end_date,start_date])

    return(
        <Box>
              <Flex  style={{"width":"50%",'margin':'0 auto'}} justifyContent="space-between" align={"center"}>


<Flex alignItems={"center"}>

{/* <label>From</label> */}
<label><strong>From</strong>:</label>

<Input 
value={start_date}
onChange={(e)=>setStart_date(e.target.value)}
type="date" />
</Flex>


<Flex  alignItems={"center"}>

<label><strong>To</strong>:</label>
<Input
value={end_date}
onChange={(e)=>setEnd_date(e.target.value)}
type="date" />

</Flex>

</Flex><br /><br />
             <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
                    <CardList
                    allow_percent={false}
                    cardDetails={[
                        {
                            title:'Active Days',
                            value:dashboardData?.active_days,rate:10,
                        },
                        {
                            title:'Active Hours',
                            value:dashboardData['active hours'],rate:10,
                        },
                        {
                            title:'In-Active Days',
                            value:dashboardData.inactive_days,rate:10,
                        },
                        {
                            title:'In-Active Hours',
                            value:dashboardData.inactive_hours,rate:10,
                        },
                    ]} />
             </Grid>
          

           {isLoading&& <Preloader/>}
           {isLoadingDashboard&&<Preloader/>}
            {
                events?
                is_dash===false?
                <CustomCalendar eventData={events}/>:''
                :''
            }
        </Box>
    )
}


export default MyTaskCalendar