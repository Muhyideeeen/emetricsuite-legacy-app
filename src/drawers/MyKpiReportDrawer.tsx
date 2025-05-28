
import { Box, Flex, Input ,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerCloseButton,
    Text,
} from  '@chakra-ui/react';



import { useEffect,useState,useMemo, useLayoutEffect } from "react"
import { HumanPerformanceDataTablePropsType } from '../components/HumanPerformanceDataTable';
import moment from 'moment';
import { getMyInfo } from '../services/auth.service';
import { useErrorHandler } from "react-error-boundary";
import axios from '../services/api';
import TaskReportBreakDown from '../components/TaskReportBreakDown/TaskReportBreakDown';
import Preloader from '../components/Preloader';


type Prop ={
    initiative_id:string;
}
const MyKpiReportDrawer = ({initiative_id}:Prop):React.ReactElement=>{

    const [start_date_before,setStart_date_before] = useState<string>();
    const [start_date_after,setStart_date_after] = useState<string>();
    const [taskReports,setTaskReports] = useState<HumanPerformanceDataTablePropsType[]>()
    const handleError = useErrorHandler();
    const [isLoading,setIsLoading] = useState(false);
    const loggedinUser:any=getMyInfo();
    const [initiatives,setInitiatives] = useState<any>(null)
    const ORG_NAME = localStorage.getItem('current_organization_short_name');


    
    const getInitiativeReport= async ()=>{
        setIsLoading(true)
        try{

            const resp = await axios.get(`/client/${ORG_NAME}/task/report/initiative/${initiative_id}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`)
            console.log({"cumulative_Kpi":resp},'cc')
            
            const initiative_report = resp.data.data
            setTaskReports(initiative_report)
        }
        catch(err:any){
                console.log({'team kpi error':err})
                if(err.response.status === 401){
                    handleError(err)
              }
        }
        setIsLoading(false)

    }



    useEffect(()=>{
        getInitiativeReport()
    },[start_date_before,start_date_after])

    useLayoutEffect(()=>{

        let today = new Date();
        let thirtydaysBackfromToday = new Date(new Date().setDate(today.getDate() - 30));
        setStart_date_after(moment(thirtydaysBackfromToday).format("YYYY-MM-DD"));
        setStart_date_before(moment(today).format("YYYY-MM-DD"));
    },[])
    return (
        <div>

<DrawerHeader>
          <Flex justify="space-between">
            <Text fontWeight="bold" fontSize="lg">
              More info
            </Text>
            <DrawerCloseButton mt={3.5} />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
        {isLoading&&<Preloader/>}
                <Flex style={{"width":"50%"}} justifyContent="space-between" align={"center"}>
                
                <Flex  alignItems={"center"}>
                
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
                    <br /><br />

                <Box>

                    {
                        taskReports?

                        <TaskReportBreakDown  data={taskReports}/>
                        :''
                    }
                    
                </Box>
        </DrawerBody>

        <DrawerFooter />
        </div>
    )
}

export default MyKpiReportDrawer