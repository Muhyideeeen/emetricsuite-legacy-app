import moment from "moment";

export const get_amount_by_percent = (percent:number,amount:number)=>{
  "this function gets the amount of a percent on a money"
  return (percent/100) *(amount)
}

export const get_percent_by_amount =  (amount:number,total_amount:number)=>{
  "this function gets the percent of a amount on a money-> basicay we use percentage to get the actuall amount"


  return (amount/total_amount)  *(100)

}

export const isObject = (val:any)=> {
  if (val === null) { return false;}
  return ( (typeof val === 'function') || (typeof val === 'object') );
}

export const weekGetter=({startDate,endDate}:{startDate:string,endDate:string})=>{
    console.log(startDate,endDate)
    
    let range = moment.duration(moment(endDate).diff(moment(startDate)));
    // console.log(range.weeks(),'some range stuff')

    return ` ${range.weeks()} weeks`
}


export const convertStringToDate =(stringDate:string):Date=>{
   
    let convertedStringToDateObj =new Date(moment(stringDate,'DD-MM-YY').format("YYYY-MM-DD"))
   console.log({
    convertedStringToDateObj
   })
    return convertedStringToDateObj
  }


export const convertStringToValidDateString=(stringDate:string):string=>{

    let convertedStringToDateObj  = moment(stringDate).format("YYYY-MM-DD")
    console.log({
        convertedStringToDateObj
    })
    return convertedStringToDateObj
}


export const createDanloadAbleFile =(link:string)=>{
  // Note: basically we putting fl_attachment in the middle
  // "https://res.cloudinary.com/haqszgzma/raw/upload/"+"fl_attachment/"+word.split("https://res.cloudinary.com/haqszgzma/raw/upload/")[1]
  
  
  /*
  https://res.cloudinary.com/haqszgzma/raw/upload/
    res would get the above link but ->haqszgzma is dynamic the code below is to get it we call it dynamic_key 
  */
 if(link){
   let res:any = link.match(/https:\/\/res\.cloudinary\.com\/[a-zA-Z]+\/raw\/upload\//i)
   let dynamic_key=""
   if(res){
      dynamic_key= res[0].split("/")[3]
 
   }
   const first_part_of_the_link =`https://res.cloudinary.com/${dynamic_key}/raw/upload/`
   return link?first_part_of_the_link +"fl_attachment/"+link.split(first_part_of_the_link)[1]:""

 }
 return ""
}


export const setTimeFilter=(
    {
        currentTab=0,
        setStart_date_after,
        setStart_date_before,
        timeType='future'
    }:{
        currentTab?:number,
        setStart_date_after:(arg:any)=>void,
        setStart_date_before:(arg:any)=>void,
        timeType?:"future"|"past"
    }
   

    )=>{
    /*
      0 => daily
      1=> monthly 
      2=> weekly
    */

    let today = new Date();
    let daysBackfromToday;
    if(timeType === "future"){
    if(currentTab===0){
      //get  data of last 1 day
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 0));
    }
    if(currentTab===1){
      //get week data
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 7));
    }
    if(currentTab===2){
      //get  data of  monthly
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 31));
    }

    if(currentTab===3){
      //get  data of last Quaterly
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 91));
  
      }
    if(currentTab===5){
      //get  data of Annualy
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 365));
    }

 
    if(currentTab===4){
      //get  data of Bi-Annualy
       daysBackfromToday = new Date(new Date().setDate(today.getDate() + 182.5));
    }

       //from
       setStart_date_after(moment(today).format("YYYY-MM-DD"));
       //To
        setStart_date_before(moment(daysBackfromToday).format("YYYY-MM-DD"))
  }


  else if(timeType === "past"){
    if(currentTab===0){
      //get  data of last 1 day
       daysBackfromToday = new Date(new Date().setDate(today.getDate() ));
    }
    if(currentTab===1){
      //get week data
       daysBackfromToday = new Date(new Date().setDate(today.getDate() - 7));
    }
    if(currentTab===2){
      //get  data of  monthly
       daysBackfromToday = new Date(new Date().setDate(today.getDate() - 31));
    }

    if(currentTab===3){
      //get  data of last Quaterly
       daysBackfromToday = new Date(new Date().setDate(today.getDate() - 91));
    }
    if(currentTab===5){
      //get  data of Annualy
       daysBackfromToday = new Date(new Date().setDate(today.getDate() - 365));
    }

    if(currentTab===4){
      //get  data of Bi-Annualy
       daysBackfromToday = new Date(new Date().setDate(today.getDate() - 182.5));
    }

    //from
setStart_date_after(moment(daysBackfromToday).format("YYYY-MM-DD"));
//To
 setStart_date_before(moment(today).format("YYYY-MM-DD"))
  }

    /*this function will return 
for Past:
  Start_date_after=> from(today) backward(past which is minus the number of days) Start_date_before
for Future:
  Start_date_after=> from(today) forward(future which is plus the number of days) Start_date_before

  
  */
    
  // console.log({
  //   "moment startDate From":moment(today).format("YYYY-MM-DD"),
  //   "moment startDate To":moment(daysBackfromToday).format("YYYY-MM-DD"),
  // })
      }



export const cal_end_time = ({start_time,duration}:{start_time:string,duration:string}):string=>{



  const cal_end_time = moment(start_time,"hh:mm A").add(moment.duration(duration))
  console.log({cal_end_time})
  const end_time = `${cal_end_time.hour()}:${cal_end_time.minute()}:${cal_end_time.second()}`


  return end_time
} 



