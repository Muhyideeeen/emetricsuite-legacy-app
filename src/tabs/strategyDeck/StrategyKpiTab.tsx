import { Tabs, TabList, TabPanels, Tab, TabPanel ,Box} from '@chakra-ui/react'
import { useEffect, useState, } from 'react';
import AppBar from '../../components/AppBar'
import SelectAsyncPaginate from '../../components/AsyncSelect';
import StructurePick from '../../components/StructurePick/StructurePick';

import JDAndInitiavesTab from './JDAndInitiative';



function useForceUpdate(data:any,selectedLevel:any){
    //

}


const StrategyKpiTab  =():React.ReactElement=>{


    const [team_member,setTeam_member]= useState<any>(null);
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    const [team_lead_lookUp,setTeam_lead_lookUp] = useState('')
    const [team_info,setTeam_info] = useState<{level_name:string,level_id:string}>()

    return (
        <>
         

<Tabs isLazy>
            <TabList>
                <Tab>Organisation Kpi</Tab>
                <Tab>Team KPI</Tab>
                <Tab>Individual Team Member Kpi</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <JDAndInitiavesTab />
                </TabPanel>


                <TabPanel>
                {/* <JDAndInitiavesTab team_lead_lookUp={team_lead_lookUp} team_info={team_info}/> */}
                <br />
                <div style={{'width':'700px','margin':'0 auto'}}>
                <StructurePick
                    handleLevelChange={(data,selectedLevel)=>{
                        console.log({'level_info':data.uuid,selectedLevel})
                    
                    
                        if(selectedLevel==='corporate-level'){
                            setTeam_lead_lookUp(value=>`&corporate_level__uuid=${data.uuid}`)
                            setTeam_info(value=>{
                                return {level_name:'corporate-level',level_id:data.uuid}
                            })
                        }
                        if(selectedLevel==='departmental-level'){
                            setTeam_lead_lookUp(value=>`&department__uuid=${data.uuid}`)
                            setTeam_info(vaule=>{
                                return {level_name:'departmental-level',level_id:data.uuid}
                            })
            
                        }
                        if(selectedLevel==='divisional-level'){
                            setTeam_lead_lookUp(value=>`&division__uuid=${data.uuid}`)
                            setTeam_info(value=>{
                                return {level_name:'divisional-level',level_id:data.uuid}
                            })
            
                        }
                        if(selectedLevel==='group-level'){
                            setTeam_lead_lookUp(vaule=>`&group__uuid=${data.uuid}`)
                            setTeam_info(value=>{
                                return {level_name:'group-level',level_id:data.uuid}
                            })
                        }
                        if(selectedLevel==='unit-level'){
                            setTeam_lead_lookUp(value=>`&unit__uuid=${data.uuid}`)
                            setTeam_info(value=>{
                                return {level_name:'unit-level',level_id:data.uuid}
                            })
            
                        }
                    }}
                    handleStructureLevelChange={(data:any)=>{

                    }}
                />
                </div>
                <br />
                <br />

                {
                    team_lead_lookUp&&team_info?
                    <JDAndInitiavesTab team_lead_lookUp={team_lead_lookUp} team_info={team_info} key={team_lead_lookUp} isInInitiaivePage={false}/>
                    :''
                }
                
               
                </TabPanel>
                <TabPanel>
                    <>
                    <br />

                        <Box style={{'width':'60%','margin':'0 auto'}}>
                        <SelectAsyncPaginate
                        url={`/client/${ORG_NAME}/employee/?some=2`}
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
                        <br />

                        {
                            team_member?
                            <Box key={team_member}>
                                <JDAndInitiavesTab isInInitiaivePage={false}  team_lead_lookUp={`&owner_email=${team_member.user.email}`} />
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

export default StrategyKpiTab