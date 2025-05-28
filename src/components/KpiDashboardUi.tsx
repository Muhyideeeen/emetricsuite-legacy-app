import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useEffect, useLayoutEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import axios from "../services/api";
import { getLoggedin_userEmail, getMyInfo } from "../services/auth.service";
import { setTimeFilter } from "../services/extraFunctions";
import CardList from "./CardList"
import Preloader from "./Preloader";




type Prop = {
    dashboardType:'individual'|'team'|'corporate'
}
const KpiDashboardUi = ({dashboardType}:Prop):React.ReactElement=>{
    const [{pending ,active,closed},setKpiCount] =useState<{pending:number;active:number;closed:number}>({pending:0,active:0,closed:0})


    const cardDetails =[
        {
            title: 'Pending KPI',
            value: pending,
            rate: 4,
            width:"30%",
            allow_percent:false,
          },
          {
            title: 'Active KPI',
            value: active,
            rate: 4,
            width:"30%",
            allow_percent:false,
          },

          {
            title: 'Closed KPI',
            value: closed,
            rate: 4,
            width:"30%",
            allow_percent:false,
          },
    ]

    const [isCorporate,setCorporate] =useState(false)
    const org_name =  localStorage.getItem('current_organization_short_name')
   
    const [start_date_before__Future,setStart_date_before__Future] = useState<string>('');
    const [start_date_after__Future,setStart_date_after__Future] = useState<string>('');
  
  
    const [start_date_before__Past,setStart_date_before__Past] = useState<string>('');
    const [start_date_after__Past,setStart_date_after__Past] = useState<string>('');
   
    const handleError= useErrorHandler();
    const [teamData,setTeamData] = useState<any>(null);
    const loggedInUser:any = getMyInfo()
    const [isLoading,setIsLoading] = useState(false)





      const getLoggedInTeamLeadUUID =async()=>{

        const ORG_NAME = localStorage.getItem('current_organization_short_name');
        if (!ORG_NAME) return
        setIsLoading(true)  
        if(loggedInUser) {
            try{
                const response =await axios.get(`/client/${ORG_NAME}/employee/?user__email=${loggedInUser.email}`)
                      // console.log(response)
                      if(response.data.data.length!==0){
                          let TeamLead = response.data.data[0]
                        console.log({
                          TeamLead
                        })
                          setTeamData(
                            
                            TeamLead
                          )
                      }
                      // console.log(Team)
                  }   
                  catch(err:any){
                      console.log(err)
                      if(err.response.status==401){
                        handleError(err)
                      }
                    }
        }
    
           
          
        setIsLoading(false)
    
    
    }

      const getKpi = async()=>{
        //
        console.log({'getMyInfo()':getMyInfo()})
        setIsLoading(true)
        if(loggedInUser){

            let extra_lookup=''
            if(dashboardType==='individual'){
                extra_lookup=`owner_email=${loggedInUser.email}`
            }
            if(dashboardType==='team'){
                let teamID = teamData.corporate_level||teamData.department||teamData.division||teamData.group||teamData.unit

                if(teamData.corporate_level){
                    extra_lookup =`corporate_level__uuid=${teamID.uuid}`
                    setCorporate(true)
                }
                if(teamData.department){
                    extra_lookup =`department__uuid=${teamID.uuid}`
                }
                if(teamData.division){
                    extra_lookup =`division__uuid=${teamID.uuid}`

                }
                if(teamData.group){
                    extra_lookup =`group__uuid=${teamID.uuid}`
                }
                if(teamData.unit){
                    extra_lookup =`unit__uuid=${teamID.uuid}`
                }
            }
            if(dashboardType==='corporate'){
              if(teamData.corporate_level){
                extra_lookup =`corporate_level__uuid=${ teamData.corporate_level.uuid}`
                setCorporate(true)

              }
              setCorporate(false)

            }
            console.log({extra_lookup})
            if(org_name){
                Promise.allSettled([
                     axios.get(`/client/${org_name}/initiative/?initiative_status=active&${extra_lookup}`),
                     axios.get(`/client/${org_name}/initiative/?initiative_status=pending&${extra_lookup}&start_date_before=${start_date_before__Future}&start_date_after=${start_date_after__Future}`),
                     axios.get(`/client/${org_name}/initiative/?initiative_status=closed&${extra_lookup}&start_date_before=${start_date_before__Past}&start_date_after=${start_date_after__Past}`),
                ])

                .then((results)=>{
                    console.log({results})
                    setKpiCount({
                        active:results[0].status==="fulfilled"?results[0].value.data.count :0,
                        pending:results[1].status==="fulfilled"?results[1].value.data.count :0,
                        closed:results[2].status==="fulfilled"?results[2].value.data.count :0,
                    })
        setIsLoading(false)

                })
    
            }
        }
        // to get the inidividual we would have to get data using owner_email= sign_in user email
        // to get the team we would get the team id which will be like this division__uuid=
        // to get the corporate that if the person is even corporate we would get the corporate id which will be like this corporate_level__uuid=

      }

      
      useLayoutEffect(()=>{
        setTimeFilter({
          "setStart_date_after":setStart_date_after__Future,
          "setStart_date_before":setStart_date_before__Future,
          timeType:"future",
        })
    
        setTimeFilter({
          "setStart_date_after":setStart_date_after__Past,
          "setStart_date_before":setStart_date_before__Past,
          timeType:"past",
        })
      },[])
    
      useEffect(()=>{
        if(
            start_date_before__Future&&start_date_after__Future&&start_date_before__Past&&start_date_after__Past&&org_name
          ){


            if(dashboardType==='individual'){
                getKpi()
                console.log({dashboardType})
            }

            if(dashboardType==='team' || dashboardType==='corporate'){
                if(teamData){// there must be a teamData
                    console.log({dashboardType,teamData})
                    getKpi()
                }
            }

          }
      },[
        start_date_before__Future,start_date_after__Future,
        start_date_before__Past,start_date_after__Past,teamData
      ])

      useEffect(()=>{
        // getKpi()
        if(dashboardType==='team' || dashboardType==='corporate'){
            getLoggedInTeamLeadUUID()
        }
      },[])

      console.log({teamData})
    return (
        <>
        
        <Tabs
           isLazy
           onChange={(currentIndex)=>{
            setTimeFilter({
                currentTab:currentIndex,
                "setStart_date_after":setStart_date_after__Future,
                "setStart_date_before":setStart_date_before__Future,
                timeType:"future",
              })
            
              setTimeFilter({
                currentTab:currentIndex,
                "setStart_date_after":setStart_date_after__Past,
                "setStart_date_before":setStart_date_before__Past,
                timeType:"past",
              })
          }}
        >
            <TabList>
                <Tab>Day</Tab>
                <Tab>Week</Tab>
                <Tab>Month</Tab>
                <Tab>Quarter</Tab>
                <Tab>Bi-Annual</Tab>
                <Tab>Annual</Tab>

            </TabList>


            <TabPanels>
  {
    [...new Array(6)].map(()=>(
      <TabPanel>
        {isLoading===true?<Preloader /> :''}
        <Box>
            <Grid templateColumns="repeat(3, 1fr)" gap="4">

                <CardList cardDetails={cardDetails} allow_percent={false} />

            </Grid>
        </Box>
    </TabPanel>
    ))
  }


  
    </TabPanels>
        </Tabs>
      

        </>
    )
}

export default KpiDashboardUi