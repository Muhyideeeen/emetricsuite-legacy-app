import { useState,useMemo, useEffect } from 'react';
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
import AppraisalTaskReport from '../../components/TaskReportTable/AppraisalTaskReport';
import TaskReportBreakDown from '../../components/TaskReportBreakDown/TaskReportBreakDown';

const TeamReport = ()=>{
    const [teamUUID,setTeamUUID] = useState<string>();
    const [teamData,setTeamData] =useState<any>(null)
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const loggedinUser:any= useMemo(()=>getMyInfo(),[]);
    const [start_date_before,setStart_date_before] = useState<string>();
    const [start_date_after,setStart_date_after] = useState<string>();
    const handleError = useErrorHandler();
    const [teamDashboardReport,setTeamDashboardReport] = useState<any>(null)

    // /client/{{ORGANISATION_NAME}}/task/report/team/:team_id/
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
                        console.log(
                           { "TeamLead":TeamLead,"team":Team}
                        )
                          setTeamUUID(
                            
                                Team.uuid
                          )
                      }
                  }   
                  catch(err:any){
                      console.log(err)
                  }
          
                  setIsLoading(false)


    }
    const getDashboardData=async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
            if (!ORG_NAME) return
        const urlForDashboardata =`/client/${ORG_NAME}/task/report/team/${teamUUID}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}&dashboard_report=True`

        try{
            const response =await axios.get(urlForDashboardata)
            console.log({
                "for me tot see the data":response.data.data
            })
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


    const getTeamData= async ()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
        setIsLoading(true)
        try{

            const resp = await axios.get(`/client/${ORG_NAME}/task/report/team/${teamUUID}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`)
            setTeamData(resp.data.data)
            console.log({"teamData":resp},'cc')
        }
        catch(err:any){
                console.log(err)
                if(err.response.status === 401){
                    handleError(err)
              }
        }
        setIsLoading(false)

    }

    useEffect(()=>{

        let today = new Date();
        let thirtydaysBackfromToday = new Date(new Date().setDate(today.getDate() - 30));
        setStart_date_after(moment(thirtydaysBackfromToday).format("YYYY-MM-DD"));
        setStart_date_before(moment(today).format("YYYY-MM-DD"))
        getLoggedInTeamLeadData()
    },[])
    // useEffect(()=>{

    //     // getUserPerformance()
    // },[])
    useEffect(()=>{
        
        console.log("dff")
        if(start_date_before&&start_date_after&&teamUUID){
            getTeamData()

        }
        if(start_date_before&&start_date_after&&teamUUID){
        getDashboardData()
        }

    },[start_date_before,start_date_after,teamUUID])


    // useEffect(()=>{
    //     getTeamData()
    // },[teamUUID])
    console.log(teamUUID,"from teamLeadUUID")
    console.log(teamData,'team data')

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
{/* {
            teamData?
            <HumanPerformanceDataTable  data={teamData} dataReport={teamDashboardReport}/>
            :
            ""
        } */}

        {
            teamData?
            <TaskReportBreakDown data={teamData}/>
            :''
        }
       </> 
    )
}

export default TeamReport