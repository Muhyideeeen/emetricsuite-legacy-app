
import { Box } from  '@chakra-ui/react';
import { useEffect,useState,useMemo } from "react"
import { Employee } from "../../redux/employees/employeesSlice"
import axios from "../../services/api";
import { getMyInfo } from "../../services/auth.service";
import SelectAsyncPaginate from "../../components/AsyncSelect";
import HumanPerformanceDataTable,{HumanPerformanceDataTablePropsType} from '../../components/HumanPerformanceDataTable';
import { useErrorHandler } from "react-error-boundary";
import FilterTableData from '../../components/FilterTableData';
import TypeVerifierUserChecker from '../../utils/UserScreenAuthentication';
import TaskReportBreakDown from '../../components/TaskReportBreakDown/TaskReportBreakDown';
const IndividualTeamMemberReport=()=>{
    const [team_members,setTeam_members]=useState<Employee[]>();
    const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const [team_member,setTeam_member] = useState<any>(null);
    const [org_name,setOrg_name] =useState<any>(localStorage.getItem('current_organization_short_name'));
    const [data,setData]=useState<HumanPerformanceDataTablePropsType[]|null>(null);
    const handleError = useErrorHandler();
    const [start_date_before,setStart_date_before] = useState<string>('');
    const [start_date_after,setStart_date_after] = useState<string>('');

    const [teamDashboardReport,setTeamDashboardReport] = useState<any>(null)

    const getUserPerformance = async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');

        setIsLoading(true)
            if (!ORG_NAME) return
            // if (!ORG_NAME) return
            const urlForAllData =`/client/${ORG_NAME}/task/report/user/${team_member.user.user_id}/`
            const urlForFilterData=`/client/${ORG_NAME}/task/report/user/${team_member.user.user_id}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`
            try{
          const response =await axios.get((start_date_before.length!==0&&start_date_after.length!==0)?urlForFilterData:urlForAllData)
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
        const urlForDashboardata =`/client/${ORG_NAME}/task/report/user/${team_member.user.user_id}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&dashboard_report=True`

        try{
            const response =await axios.get(urlForDashboardata)
            let trigErrorIFthereisOne=response.data.data[0]
            setTeamDashboardReport(trigErrorIFthereisOne)
        }
        catch(err:any){
            console.log(err)
            
            if(err.response.status === 401){
                handleError(err)
          }
        }
    }
    useEffect(()=>{
        // getTeambers();
        if(team_member&&start_date_before&&start_date_after){

            getUserPerformance();
        getDashboardData()

        }
    },[team_member,start_date_before,start_date_after])

   
    console.log(data,"data")
    return (
        <>
        <Box style={{width:"50%","margin":"0 auto"}}>
            <SelectAsyncPaginate
                    url={
                        TypeVerifierUserChecker(["super_admin","admin"])?`/client/${org_name}/employee/?me=21`:
                        `/client/${org_name}/employee/?upline__email=${loggedinUser.email}`
                    }
                    value={team_member}
                    onChange={(value)=>{
                      console.log(value,">>>>>")
                    return   setTeam_member(value)
                    
                    }}
                    SelectLabel={(option:any)=>`${option.user.first_name} ${option.user.last_name}`}
                    SelectValue={(option:any)=> {
                      return `${option.user.user_id}`
                    } }
                    placeholder={"Get Your Team Member Report"}
            />
        </Box>
<br /><br />
{
    team_member&&(
        <FilterTableData 
        getDataFunction={getUserPerformance}
        start_date_before={start_date_before}
        setStart_date_before={setStart_date_before}
        start_date_after={start_date_after}
        setStart_date_after={setStart_date_after}
        /> 
    )
}



{isLoading&&<p>Loadin</p>}
                    <br />
                    
        {
            data?
            // <HumanPerformanceDataTable  data={data} dataReport={teamDashboardReport}/>
            <TaskReportBreakDown data={data} dataReport={teamDashboardReport}/>
            :
            ""
        }
        </>
    )
}


export default IndividualTeamMemberReport