import { useState } from "react"
import StructurePick from "../../components/StructurePick/StructurePick"
import TaskListTable from "./TaskComponent/TaskListTable"







const AdmiViewTeamTask = ():React.ReactElement=>{
    const [team_lead_lookUp,setTeam_lead_lookUp] = useState('')
    const [team_info,setTeam_info] = useState<{level_name:string,level_id:string}>()

    return (
        <div>
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

            {
                team_lead_lookUp&&team_info?
                <TaskListTable owner_email='' admin_lookUp={team_lead_lookUp} />:
                ''
                }

        </div>
    )
}

export  default AdmiViewTeamTask