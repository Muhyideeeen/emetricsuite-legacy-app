import {
Box,
Text,
Grid,
Stack,
Flex,
Select,
Skeleton,
} from '@chakra-ui/react';
import axios from '../../services/api';
import HumanPerformanceDataTable,{HumanPerformanceDataTablePropsType} from '../../components/HumanPerformanceDataTable';
import {getMyInfo} from "../../services/auth.service";
import { useEffect,useState,useMemo } from 'react';
import SelectAsyncPaginate from '../../components/AsyncSelect';
import FilterTableData from '../../components/FilterTableData';
    import { useErrorHandler } from "react-error-boundary";
import KPIReportBreakDown from '../../components/KPIReportBreakDown/KPIReportBreakDown';
        

const InitiativeReport = ()=>{
    const [initiative,setInitiative] =useState<any>();
    const [isLoading,setIsLoading] = useState<boolean>();
    const [currentInitiative,setCurrentInitiative] = useState<any>(null)
    const [data,setData]=useState<any>(null)
    const [IsLoadingTable,setIsLoadingTable]=useState<boolean>(false);
    const [start_date_before,setStart_date_before] = useState<string>('');
    const [start_date_after,setStart_date_after] = useState<string>('');
    const org_name = localStorage.getItem("current_organization_short_name")
    const handleError = useErrorHandler();

    const initiativeApi = async ()=>{
        if(!org_name) return
        setIsLoading(true)
        try{
// ?initiative_status=pending&initiative_status=active
            const resp = await axios.get(`/client/${org_name}/initiative/?initiative_status=pending&initiative_status=active`);
            // console.log(resp.data,';llf')
            setInitiative(resp.data.data)
        }
        catch(err:any){
            console.log(err)
        }
        setIsLoading(false)

    
    }

    const getIntitativeReport =async()=>{
        // /client/{{ORGANISATION_NAME}}/task/report/initiative/:initiative_id/
        const org_name = localStorage.getItem("current_organization_short_name")
        if(!org_name) return
        setIsLoadingTable(true)
        const urlForAllData=`/client/${org_name}/task/report/initiative/${currentInitiative}/`
        const urlForFilterData=`/client/${org_name}/task/report/initiative/${currentInitiative}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`

        try{
            console.log(currentInitiative,"initiative")
            const resp = await axios.get((start_date_before.length!==0&&start_date_after.length!==0&&currentInitiative)?urlForFilterData:urlForAllData)
            console.log(resp.data,'woaa')
            setData(resp.data.data)
        }
        catch(err:any){
                console.log(err)
                if(err.response.status === 401){
                    handleError(err)
              }
        }
        setIsLoadingTable(false)

    }
 


    useEffect(()=>{
        getIntitativeReport()
    },[currentInitiative])
    return (



<>

<Box style={{width:"50%","margin":"0 auto"}}>
                        <SelectAsyncPaginate 
                            value={currentInitiative}
                            url={`/client/${org_name}/initiative/?initiative_status=pending&initiative_status=active`}
                            onChange={(value)=>{
                              console.log(value,">>>>>")
                            return   setCurrentInitiative(value.initiative_id)
                            
                            }}
                            SelectLabel={(option:any)=>`${option.name}`}
                            SelectValue={(option:any)=> {
                              return `${option.objective_id}`
                            } }
                            placeholder={"Select Initiative"}
                    
                        />
                </Box>
            <br />
{
    currentInitiative&&(
        <FilterTableData
        getDataFunction={getIntitativeReport}
        start_date_before={start_date_before}
        setStart_date_before={setStart_date_before}
        start_date_after={start_date_after}
        setStart_date_after={setStart_date_after}
        /> 
    )
}
<br />

        {IsLoadingTable && <p>Loading...</p>}
        {
            data?
            <KPIReportBreakDown  data={data}/>
            :""
        }
        {(IsLoadingTable===false && data?.length===0)?<p>You Don't Have Initiative Report</p>:""}
     
        </>
        )
}

export default InitiativeReport