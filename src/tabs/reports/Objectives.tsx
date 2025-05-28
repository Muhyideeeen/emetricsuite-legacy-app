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
    import { useEffect,useState,useMemo } from 'react';
    import { useErrorHandler } from "react-error-boundary";
import SelectAsyncPaginate from '../../components/AsyncSelect';
import FilterTableData from '../../components/FilterTableData';
import ObjectiveBreakDown from '../../components/ObjectiveBreakDown/ObjectiveBreakDown';
import Preloader from '../../components/Preloader';
        
    
    const ObjectivesReport = ()=>{
        const [objective,setObjective] =useState<any>();
        const [isLoading,setIsLoading] = useState<boolean>();
        const [currentobjective,setCurrentobjective] = useState<any>(null)
        const [data,setData]=useState<any>(null)
        const [IsLoadingTable,setIsLoadingTable]=useState<boolean>(false);
        const [start_date_before,setStart_date_before] = useState<string>('');
        const [start_date_after,setStart_date_after] = useState<string>('');
        const handleError = useErrorHandler();
        const org_name = localStorage.getItem("current_organization_short_name")

    
        const getObjectiveReport =async()=>{
            // /client/{{ORGANISATION_NAME}}/task/report/objective/:objective_id/
            const org_name = localStorage.getItem("current_organization_short_name")
            if(!org_name) return
            setIsLoadingTable(true)
            // const urlForAllData=`/client/${org_name}/task/report/objective/${currentobjective}/`
            const urlForFilterData=`/client/${org_name}/task/report/objective/?start_date_before=${start_date_before}&start_date_after=${start_date_after}`
            console.log({urlForFilterData})
            try{
                const resp = await axios.get(urlForFilterData);
                console.log({'woaa':resp.data})
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
     
    
        
    
        
        console.log({'objective report':data})
        return (
    
    
    
    <>
            

            {IsLoadingTable &&<Preloader/>}

<br />
        <FilterTableData
        getDataFunction={getObjectiveReport}
        start_date_before={start_date_before}
        setStart_date_before={setStart_date_before}
        start_date_after={start_date_after}
        setStart_date_after={setStart_date_after}
        /> 

<br />


            {
                data?
                <ObjectiveBreakDown  data={data}/>
                :""
            }
            {(IsLoadingTable===false && data?.length===0)?<p>You Don't Have objective Report</p>:""}
         
            </>
            )
    }
    
    export default ObjectivesReport