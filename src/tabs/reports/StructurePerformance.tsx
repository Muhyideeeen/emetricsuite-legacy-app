import {
    Box,
    Text,
    Grid,
    Stack,
    Flex,
    Select,
    Skeleton,
  } from '@chakra-ui/react';
import HumanPerformanceDataTable,{HumanPerformanceDataTablePropsType} from '../../components/HumanPerformanceDataTable';
import axios from '../../services/api';
import {getMyInfo} from "../../services/auth.service";
import { useEffect,useState,useMemo } from 'react';
import { Unit } from '../../redux/unit/unitAPI';
import { Corporate } from '../../redux/corporate/corporateAPI';
import { Division } from '../../redux/division/divisionAPI';
import { Department } from '../../redux/department/departmentAPI';
import { Group } from '../../redux/group/groupAPI';
import SelectAsyncPaginate from '../../components/AsyncSelect';
import FilterTableData from '../../components/FilterTableData';
    import { useErrorHandler } from "react-error-boundary";

const StructurePerformance = ({structure_name}:{structure_name:"corporate-level"|"divisional-level"|"group-level"|"departmental-level"|"unit-level"})=>{
    
    const [data,setData]=useState<HumanPerformanceDataTablePropsType[]>();
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const loggedinUser:any= useMemo(()=>getMyInfo(),[])
    const [structureLevels,setStructureLevels]=useState<
    Corporate[] | Division[] | Group[] | Department[] | Unit[]
  >();
    const [currentStruture,setCurrentStruture]= useState<any>(null);
    const [start_date_before,setStart_date_before] = useState<string>('');
    const [start_date_after,setStart_date_after] = useState<string>('');
    const org_name = localStorage.getItem("current_organization_short_name")
    const handleError = useErrorHandler();
    const [teamDashboardReport,setTeamDashboardReport] = useState<any>(null)

    // this fucntion gets data for the actual Structure
    const getStructurePerformance = async()=>{
    const ORG_NAME = localStorage.getItem('current_organization_short_name');

    setIsLoading(true)
        if (!ORG_NAME) return
        // if (!ORG_NAME) return
        const urlForAllData=`/client/${ORG_NAME}/task/report/team/${currentStruture}/`
        const urlForFilterData=`/client/${ORG_NAME}/task/report/team/${currentStruture}/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`
        console.log(
            urlForAllData,urlForFilterData
        )
        try{
      const response =await axios.get((start_date_before.length!==0&&start_date_after.length!==0&&currentStruture)?urlForFilterData:urlForAllData)
            console.log(response)
            setData(response.data.data)
        }   
        catch(err:any){
            console.log(err.reponse)
        }

        setIsLoading(false)
    }

    const getDashboardData=async()=>{
        const ORG_NAME = localStorage.getItem('current_organization_short_name');
            if (!ORG_NAME) return
        const urlForDashboardata =`/client/${ORG_NAME}/task/report/team/${currentStruture}/?dashboard_report=True`
        console.log(
            {
                urlForDashboardata
            }
        )
        try{
            const response =await axios.get(urlForDashboardata)
            console.log({
                'dd':response.data.data
            })
            let trigErrorIFthereisOne=response.data.data[0]
            setTeamDashboardReport(trigErrorIFthereisOne)
        }
        catch(err:any){
            console.log(err,'dddd')
            
            if(err.response.status === 401){
                handleError(err)
          }
        }
    }
    useEffect(()=>{
        if(currentStruture){
            
            getStructurePerformance()
            getDashboardData()
        }
       
    },[currentStruture])
    // if(isLoading) return <p>Loading</p>
    
    return (
        <>
        
{isLoading &&<p>Loading</p>}

        
<Box style={{width:"50%","margin":"0 auto"}}>
                        <SelectAsyncPaginate 
                            value={currentStruture}
                            url={`/organization/setup/${structure_name}/list/${org_name}/?he=marko`}
                            onChange={(value)=>{
                              console.log(value,">>>>>")
                            return   setCurrentStruture(value.uuid)
                            
                            }}
                            SelectLabel={(option:any)=>`${option.name}`}
                            SelectValue={(option:any)=> {
                              return `${option.uuid}`
                            } }
                            placeholder={
                                structure_name=="corporate-level"?
                                "Get Corporate Report":(structure_name==="divisional-level")?
                                "Get Divisional Report":(structure_name==="group-level")?"Get Group Report":
                                (structure_name==="unit-level")?"Get Unit Report":(structure_name==="departmental-level")?"Get Department Report":""
                            }
                    
                        />
</Box>
            <br />

            {
    currentStruture&&(
        <FilterTableData

        getDataFunction={getStructurePerformance}
        start_date_before={start_date_before}
        setStart_date_before={setStart_date_before}
        start_date_after={start_date_after}
        setStart_date_after={setStart_date_after}
        /> 
    )
}
<br />

        <br/>
        {
            
            
            data?
            <HumanPerformanceDataTable  data={data} dataReport={teamDashboardReport}/>
            :
            ""
        }
        {
            (isLoading===false && data?.length===0)?  <p>you dont have a report at the moment</p>:""
        }
        </>
    )

}

export default StructurePerformance