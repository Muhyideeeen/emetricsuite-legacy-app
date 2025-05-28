const errorType1 ={
    "errors": [
        {
            "field": "quantity_target_unit_achieved",
            "message": "100.00 is not a valid quantity target unit achieved"
        }
    ],
    "message": "Request Validation Error",
    "status": 400
}
const errorType2={
    "errors": [
        {
            "field": "submission",
            "message": "None is not a valid submission"
        }
    ],
    "message": "Request Validation Error",
    "status": 400
}
const errorType3 ={
    "message": "Permission denied, owner is not allowed to make submission at this stage",
    "status": 403,
    "errors": []
}
const errorType4 = {
    "errors": [
        {
            "field": "task",
            "message": {
                "task_id": {
                    "task.task_id": "3879b598-266d-44c0-a310-5fa55e37e172 is not a valid task id"
                }
            }
        }
    ],
    "message": "Request Validation Error",
    "status": 400
}
const errorType5 ={
    "message": "Permission denied, assignor is not allowed to make submission at this stage",
    "status": 403,
    "errors": []
}
const errorType6 = {
    "errors": [
        {
            "field": "submission",
            "message": [
                "Unsupported file extension."
            ]
        }
    ],
    "message": "Request Validation Error",
    "status": 400
}

 const errorMessage = (errorData)=>{
    const errrorlist=[]
    if(errorData.errors && errorData.errors.length!==0){
        for(let i of errorData.errors)
        errrorlist.push({
                'field':i.field,
                //if it an instance of array bro let pick the first value else get the string
                message:i.message instanceof Array?i.message[0]:i.message
        })
    }

    else{
        errrorlist.push({
            "field":"",
            message:errorData.message
        })
    }
    // else if()
    return errrorlist
}





console.log(errorMessage(errorType6))