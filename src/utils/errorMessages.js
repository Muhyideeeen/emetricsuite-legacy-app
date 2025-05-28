


// this will help me get the  error message from a server resoponse
export const errorMessageGetter= (payload)=>{


  let Errormessage={"field":"","message":"Some Error Occured"};
  // let err
  if(payload.error){
    // action.payload.error
    for(let key in  payload.error){
        Errormessage={
            "field":key.replaceAll('_'," "),
            "message":payload.error[key]
        }
    }
  }
  if(payload.errors){
      //they might be more errors in this array just get the first if the person solve it the second would be automativally the first
      let currentErrorObject = payload.errors[0]
      console.log(currentErrorObject,'ff')
      console.log(typeof currentErrorObject.message)
      console.log(currentErrorObject.message ,'ff')
      let message ='';
      // currentErrorObject.message
      if(typeof currentErrorObject.message.name  === 'string'){
        message= currentErrorObject.message.name
      }
      if( typeof currentErrorObject.message  === 'string'){
        message =currentErrorObject.message;
      }
      if( typeof currentErrorObject.message  === "object"){
          message = currentErrorObject.message[currentErrorObject.field]
      }
      if(currentErrorObject.message instanceof Array){
        message =currentErrorObject.message[0]
      }

      Errormessage = {
          "field":currentErrorObject.field.replaceAll('_'," "),
          "message":message
      }
  }
  let message;
  if(Errormessage.field){

    message = `${Errormessage.field}: "${Errormessage.message}"`
  }
  else{
    message = ` ${Errormessage.message}`
    
  }
  return message
}

export const  errorMessageForFileUpload=(payload)=>{
  let Errormessage=[];

  for (let eachErrorObj of payload.data.errors[0].message){
    // console.log(eachErrorObj,payload.data.errors)
    Errormessage.push(
      {title:`Row: ${eachErrorObj.line}  Column: ${eachErrorObj.key.replaceAll("_"," ")}`,message:eachErrorObj.message}
    )
    
  }

  console.log(
    payload,"Error Message from File Upload Bro!!!!!"
  )

  console.log("Formated Error",Errormessage)

  return Errormessage
}

export default  errorMessageGetter




export const ReworkTaskErrorHandler =(responseData)=>{

}