import {
    Box,
    Text,
    Grid,
    Stack,
    Flex,Input,Button
  } from '@chakra-ui/react';
import HumanPerformanceDataTable,{HumanPerformanceDataTablePropsType} from '../../components/HumanPerformanceDataTable';
import axios from '../../services/api';
import {getMyInfo} from "../../services/auth.service";
import { useEffect,useState,useMemo } from 'react';
import { useErrorHandler } from "react-error-boundary";
import moment from "moment"
import Preloader from '../../components/Preloader';
import FilterTableData from '../../components/FilterTableData';
import TaskReportBreakDown from '../../components/TaskReportBreakDown/TaskReportBreakDown';
/*
get the initial date rage with empty useEffect
onClick of the button to search we call the  "getUserPerformance " func to get the data with the newly modified state oin the fucntion already
we only going to keep track of the data state in the second use Effect
*/

const UserPerformance = ()=>{
    const [data,setData]=useState<HumanPerformanceDataTablePropsType[]>();
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const loggedinUser:any= useMemo(()=>getMyInfo(),[])
    const [start_date_before,setStart_date_before] = useState<string>('');
    const [start_date_after,setStart_date_after] = useState<string>('');
    const [teamDashboardReport,setTeamDashboardReport] = useState<any>(null)
  const handleError = useErrorHandler();
    
    const getUserPerformance = async()=>{
    const ORG_NAME = localStorage.getItem('current_organization_short_name');
    setIsLoading(true)
        if (!ORG_NAME) return
        // if (!ORG_NAME) return
        try{
      const response =await axios.get(`/client/${ORG_NAME}/task/report/user/${loggedinUser.uuid}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`)
            console.log(response)
            setData(response.data.data)
        }   
        catch(err:any){
            console.log(err)
            if(err.response.status === 401){
                handleError(err)
          }
        }

        setIsLoading(false)
    }
    const getDashboardData=async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
            if (!ORG_NAME) return
        const urlForDashboardata =`/client/${ORG_NAME}/task/report/user/${loggedinUser.uuid}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&dashboard_report=True`

        try{
            const response =await axios.get(urlForDashboardata)
            console.log({
                'repsonse for dashboard report':response
            })
            let trigErrorIFthereisOne=response.data.data[0]
            setTeamDashboardReport(response.data.data[0])
        }
        catch(err:any){
            console.log(err)
            
            if(err.response.status === 401){
                handleError(err)
          }
        }
    }

 

    useEffect(()=>{
        getDashboardData()
        if(start_date_before&&start_date_after){
            getDashboardData()
        }
    },[start_date_after,start_date_before])
  


    console.log(data,'for usrperfomances')
    console.log(loggedinUser.uuid,'user uuid')
    console.log({
        teamDashboardReport
    })
    // if(isLoading) return <p>Loading</p>
    // if(isLoading===false && data?.length===0) return <p>you dont have a report at the moment</p>
    return (
        <div style ={{position:"relative"}}>
        
        <FilterTableData 
        getDataFunction={getUserPerformance}
        start_date_before={start_date_before}
        setStart_date_before={setStart_date_before}
        start_date_after={start_date_after}
        setStart_date_after={setStart_date_after}
        />

        <br />
        {
            data?
            <>
                
            {/* <HumanPerformanceDataTable  data={data}  dataReport={teamDashboardReport}/> */}
            <TaskReportBreakDown data={data} dataReport={teamDashboardReport}/>
                
           </>
            :
            ""
        }

        {isLoading&&<Preloader />}
        </div>
    )

}

export default UserPerformance