import { useState,useMemo, useEffect, useLayoutEffect } from 'react';
import axios from '../../services/api';
import { Employee } from "../../redux/employees/employeesSlice"
import { getMyInfo } from "../../services/auth.service";
import HumanPerformanceDataTable from '../../components/HumanPerformanceDataTable';
import { useErrorHandler } from "react-error-boundary";
import FilterTableData from '../../components/FilterTableData';
import moment from 'moment';


import {
    Box,
    Flex,Input,Button,
  } from '@chakra-ui/react';
import KPIReportBreakDown, { KpiReport } from '../../components/KPIReportBreakDown/KPIReportBreakDown';
import { InitiativeReportType } from '../../pages/Reports/InitiativeReport';



const TeamInitiative = ()=>{

    const [teamUUID,setTeamUUID] = useState<string>();
    const [teamData,setTeamData] =useState<KpiReport[]>([])
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
    const [start_date_before,setStart_date_before] = useState<string>();
    const [start_date_after,setStart_date_after] = useState<string>();
    const handleError = useErrorHandler();
    const [teamDashboardReport,setTeamDashboardReport] = useState<any>(null)


    const getLoggedInTeamLeadData =async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
        setIsLoading(true)
            if (!ORG_NAME) return


            try{
                const response =await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
                      console.log(response)
                      if(response.data.data.length!==0){
                          let TeamLead = response.data.data[0]
                          let Team = TeamLead.corporate_level||TeamLead.department||TeamLead.division||TeamLead.group||TeamLead.unit
                          //this means we have gotten a TeamLead We Just have to get his team uuid
                        
                          setTeamUUID(
                            
                                Team.uuid
                          )
                      }
                  }   
                  catch(err:any){
                      console.log({'eerror for teamlead':err})
                  }
          
                  setIsLoading(false)


    }



    const getDashboardData=async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
            if (!ORG_NAME) return
        const urlForDashboardata =`/client/${ORG_NAME}/task/report/team-initiative/${teamUUID}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&dashboard_report=True`
        console.log({teamUUID})
        try{
            const response =await axios.get(urlForDashboardata)
            console.log({
                "for me tot see the data":response.data.data
            })
            if(response.data.data.length===0){
            setTeamDashboardReport([])

            }
            else{
                let trigErrorIFthereisOne=response.data.data[0].cumulative_report[0]
                setTeamDashboardReport(trigErrorIFthereisOne)
            }
        }
        catch(err:any){
            console.log({'dasboard error':err})
            
            if(err.response.status === 401){
                handleError(err)
          }
        }
    }
    

    const getTeamData= async ()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
        setIsLoading(true)
        try{

            const resp = await axios.get(`/client/${ORG_NAME}/task/report/team-initiative/${teamUUID}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`)
            
            const initiative_report = resp.data.data
            setTeamData(initiative_report)
            console.log({"cumulative_reportsTeam":initiative_report},'cc')
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
        
        console.log("dff")
        if(start_date_before&&start_date_after&&teamUUID){
            getTeamData()

        }
        if(start_date_before&&start_date_after&&teamUUID){
        getDashboardData()
        }

    },[start_date_before,start_date_after,teamUUID])


    useLayoutEffect(()=>{

        let today = new Date();
        let thirtydaysBackfromToday = new Date(new Date().setDate(today.getDate() - 30));
        setStart_date_after(moment(thirtydaysBackfromToday).format("YYYY-MM-DD"));
        setStart_date_before(moment(today).format("YYYY-MM-DD"))
        getLoggedInTeamLeadData()
    },[])

    // useEffect(()=>{
    //     getTeamData()
    // },[teamUUID])
    console.log(teamUUID,"from teamLeadUUID")
    console.log(teamData,'team data')
    console.log({
        "initiativeDateReport":teamData
    })
    console.log({
        teamDashboardReport
    })

    if(isLoading) return <p>Loading please wait</p>

    return (


<>
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

       
    </Flex><br />
{
            teamData.length!==0?
            // <HumanPerformanceDataTable  data={teamData} dataReport={teamDashboardReport}/>
            <KPIReportBreakDown data={teamData}  dataReport={teamDashboardReport} />
            :
            ""
        }
       </> 

    )
}


export default TeamInitiative