// import { Grid } from "@chakra-ui/react"
// import { useEffect, useState } from "react"
// import { useErrorHandler } from "react-error-boundary"
// import CardList from "../../components/CardList"
// import axios from "../../services/api"




// type dashboardDataType={
//     "active_days": number,
//     "active hours": number,
//     "inactive_days": number,
//     "inactive_hours": number
// }

// const TimeReport = ():React.ReactElement=>{
//     const [isLoadingDashboard,setisLoadingDashboard] = useState(false)
//     const  [dashboardData,setDashboardData] = useState<dashboardDataType>({
//         "active_days": 0,
//         "active hours": 0,
//         "inactive_days": 0,
//         "inactive_hours": 0
//     })
//     const handleError= useErrorHandler();



//     const get_user_calendar_dashboard = async ()=>{
//         const org_name = localStorage.getItem('current_organization_short_name');
        
//         setisLoadingDashboard(true);
//         try{
//             const resp:any =await axios.get(`/client/${org_name}/calendar/${is_team?'team':'user'}/${user_id}/dashboard/?date_before=${end_date}&date_after=${start_date}`)
            
//             if(resp.data.status===200){
//                 const data = resp.data.data as dashboardDataType
//                 setDashboardData(data)
//             }

//             setisLoadingDashboard(false)
//         }
//         catch(err:any){
//             if(err?.response.status==401){
//                 handleError(err)
//                 setisLoadingDashboard(false)

//             }else{
//                   setisLoadingDashboard(false)

//                 toast({
//                     title: errorMessageGetter(err),
//                     status: 'error',
//                     position: "top",
//                     duration: 3000,
//                     isClosable: true,
//                   });    
//                 }
//         }


//         }

//         useEffect(()=>{
//             get_user_calendar_dashboard()
//         },[])

//     return (
//         <div>
//                          <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
//                     <CardList
//                     allow_percent={false}
//                     cardDetails={[
//                         {
//                             title:'Active Days',
//                             value:dashboardData?.active_days,rate:10,
//                         },
//                         {
//                             title:'Active Hours',
//                             value:dashboardData['active hours'],rate:10,
//                         },
//                         {
//                             title:'In-Active Days',
//                             value:dashboardData.inactive_days,rate:10,
//                         },
//                         {
//                             title:'In-Active Hours',
//                             value:dashboardData.inactive_hours,rate:10,
//                         },
//                     ]} />
//              </Grid>
//         </div>
//     )
// }

// export default TimeReport

export default {}