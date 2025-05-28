import { useEffect, useState } from "react";
import AppBar from "../components/AppBar"
import Preloader from "../components/Preloader";
import AddJD from "../drawers/AddJDAndInitiative"
import { Employee } from "../redux/employees/employeesSlice";
import axios from "../services/api";
import { getMyInfo } from "../services/auth.service";
import JDAndInitiavesTab from '../tabs/strategyDeck/JDAndInitiative';
import { Tabs, TabList, TabPanels, Tab, TabPanel ,Box} from '@chakra-ui/react'
import SelectAsyncPaginate from "../components/AsyncSelect";


const TeamLeadCreateInitiative = ():React.ReactElement=>{
    const [team_lead_lookUp,setTeam_lead_lookUp] = useState('')
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    const loggedinUser:any = getMyInfo()
    const [isLoading,setIsloading] =useState(false)
    const [team_info,setTeam_info] = useState<{level_name:string,level_id:string}>()
    const [team_member,setTeam_member]= useState<any>(null);
    const getLookUp = async()=>{
        //
        setIsloading(true)
        try {
            const resp = await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedinUser.email}`)
        if(resp.data.data.length!==0){
            const data:Employee = resp.data.data[0]
            if(data.corporate_level){
                setTeam_lead_lookUp(`&corporate_level__uuid=${data.corporate_level.uuid}`)
                setTeam_info({level_name:'corporate-level',level_id:data.corporate_level.uuid})
            }
            if(data.department){
                setTeam_lead_lookUp(`&department__uuid=${data.department.uuid}`)
                setTeam_info({level_name:'departmental-level',level_id:data.department.uuid})

            }
            if(data.division){
                setTeam_lead_lookUp(`&division__uuid=${data.division.uuid}`)
                setTeam_info({level_name:'divisional-level',level_id:data.division.uuid})

            }
            if(data.group){
                setTeam_lead_lookUp(`&group__uuid=${data.group.uuid}`)
                setTeam_info({level_name:'group-level',level_id:data.group.uuid})
            }
            if(data.unit){
                setTeam_lead_lookUp(`&unit__uuid=${data.unit.uuid}`)
                setTeam_info({level_name:'unit-level',level_id:data.unit.uuid})

            }

        }
        } catch (err:any) {
            console.log(err)
        }
        setIsloading(false)

    }
    useEffect(()=>{
    // on load of this page we get the logged in user team uuid and use it to look up the team kpi
    getLookUp()
    },[])

    return (
        <>
            <AppBar
            heading="TeamLead Kpi"
            avatar="/logo192.png"
            imgAlt="Jane Doe's avatar"
            />


        <Tabs isLazy>
            <TabList>
                <Tab>My KPI</Tab>
                <Tab>Team KPI</Tab>
                <Tab>Individual Team Member Kpi</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                <JDAndInitiavesTab isInInitiaivePage={false} team_lead_lookUp={`&owner_email=${loggedinUser.email}`} team_info={team_info}/>
                </TabPanel>
                <TabPanel>
                <JDAndInitiavesTab team_lead_lookUp={team_lead_lookUp} team_info={team_info}/>
                </TabPanel>
                <TabPanel>
                    <>
                        <Box style={{'width':'60%','margin':'0 auto'}}>
                        <SelectAsyncPaginate
                        url={`/client/${ORG_NAME}/employee/?upline__email=${loggedinUser.email}`}
                        value={team_member}
                        onChange={(value)=>{
                        // console.log(value.user.email,">>>>>")
                        return   setTeam_member(value)
                        
                        }}
                        SelectLabel={(option:any)=>`${option.user.first_name} ${option.user.last_name}`}
                        SelectValue={(option:any)=> {
                        return `${option.user.email}`
                        } }
                        placeholder={"Get Your Team Member"}
                        />
                        </Box>

                        {
                            team_member?
                            <Box key={team_member}>
                                <JDAndInitiavesTab isInInitiaivePage={false}  team_lead_lookUp={`&owner_email=${team_member.user.email}`} team_info={team_info}/>
                            </Box>
:''
                        }
                    </>
                </TabPanel>
            </TabPanels>
        </Tabs>

        </>
    )
}
export default TeamLeadCreateInitiative


