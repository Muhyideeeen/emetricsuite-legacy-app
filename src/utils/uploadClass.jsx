import axios from "../services/api";
import { useDispatch } from "react-redux";
import { errorMessageForFileUpload } from "./errorMessages";
import { addDesignation, getDesignation } from "../redux/designation/DesignationAPI";
import { getCareerPaths} from "../redux/careerPath/careerPathAPI";
import { getPerspectives } from "../redux/perspective/perspectiveAPI";
import { getObjectives } from "../redux/objective/objectiveAPI";
import { useErrorHandler } from "react-error-boundary";
import { getAllEmployees } from "../redux/employees/employeesAPI";
import { getTasks } from "../redux/Task/taskAPI";
import {isObject} from "../services/extraFunctions"
class uploadDocumentHandler{
    constructor(
        toast,url,typeOFupload,
        selectedFile,isFilePicked,
        setSelectedFile,setIsFilePicked,
        dispatch,handleError
        ){
        this.toast=toast;
        this.url =url;
        this.dispatch=dispatch
        this.typeOFupload=typeOFupload;
        this.isFilePicked=isFilePicked;
        this.selectedFile=selectedFile;
        this.setIsFilePicked=setIsFilePicked;
        this.setSelectedFile=setSelectedFile;
          this.handleError = handleError;
    }

     handleSubmit(event,) {
        event.preventDefault();
        
        // check if the file is an excel file
        if (this.isFilePicked && this.selectedFile) {
          if (
            this.selectedFile.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            this.selectedFile.type === "application/vnd.ms-excel"
          ) {
              console.log(
                this.selectedFile
              )
              
              let ORG_SHORT_NAME = localStorage.getItem("current_organization_short_name");
              const formData = new FormData();
              formData.append("template_file", this.selectedFile);
              if(this.typeOFupload === 'organization-setup'){
                // orginiasation short name for only orginsation setup 
               
                formData.append('organisation_short_name',ORG_SHORT_NAME)
              }
            let formatedUrl =''
            if(this.typeOFupload==='organization-setup'){
                formatedUrl=this.url
            }
            else{
                formatedUrl=`/client/${ORG_SHORT_NAME}${this.url}`

            }
            this.toast({
              title:"We have Recievd your please wait",
              description:"please wait for some seconds as we proceess the data",
          
              status: "success",
              position: "top-right",
              duration: 9000,
              isClosable: true,
             })
            axios.post(formatedUrl, formData)
              .then((res) => {
                  console.log({res})
               
              let ORG_NAME = localStorage.getItem("current_organization_short_name");


              this.toast({
                title: "Uploaded Successfully",
                status: "success",
                position: "top-right",
                duration: null,
                isClosable: true,
              })
                setTimeout(()=>{


                  if(this.typeOFupload == 'task'){
                    // NOTE owner_email can be emtpty sice the user is a admin u get
                    this.dispatch(getTasks({"org_name":ORG_NAME,"owner_email":""}))
                  }
                  if(this.typeOFupload=='designation'){
  
                      // this.dispatch(addDesignation({  name: '',
                      //   level: "",
                      //   level_id: ""}))
                      this.dispatch(getDesignation({"handleError":this.handleError }))
                  }
                  if(this.typeOFupload ==="employee"){
                    this.dispatch(getAllEmployees({"org_name":ORG_NAME,"handleError":this.handleError}))
                  }
                  if(this.typeOFupload==='careerpath'){
                      this.dispatch(getCareerPaths({ORG_NAME,"handleError":this.handleError }))
                  }
  
                  if(this.typeOFupload==='perspective'){
                      // getPerspectives
                      console.log("PErspective was uploaded",ORG_NAME)
                      this.dispatch(getPerspectives({ORG_NAME,"handleError":this.handleError }))
                  }
                  if(this.typeOFupload==='objectives'){
                      this.dispatch(getObjectives({ORG_NAME,"handleError":this.handleError }))
                  }
                  window.location.reload()

                },4000)
                this.setSelectedFile(undefined)
              })
              .catch((err) => {

                console.log(err.response)
                // console.log('\nss\nddd')
                //   console.log(errorMessageGetter(err.response),"yes from the nw fucntion")
                if(err.response.status==401){
            
                  this.handleError(err)
                }

                if(err.response.status==403){
            
                 this.toast({
                  title:"You do not have permission to perform this action",
                  description:"This Feature is not available for your user type",
              
                  status: "error",
                  position: "top-right",
                  duration: null,
                  isClosable: true,
                 })
                }
                if(err.response.status ===500){
                  this.toast({
                    title:"This was an unexpected server error",
                    description:"please contact the development team",
                
                    status: "error",
                    position: "top-right",
                    duration: null,
                    isClosable: true,
                   })
                }
                for(let errorObj of errorMessageForFileUpload(err.response)){
                  

                  
                    if(errorObj){
                      this.toast({
                        title:errorObj.title,
                        description: isObject(errorObj.message)==true?errorObj.message?.name:errorObj.message ,
                      //   description: err.response?.data.errors[0].message[0],
                        status: "error",
                        position: "top-right",
                        duration: null,
                        isClosable: true,
                      })
  
                  }
 
               
                }
              });
          } else {
            this.toast({
              title: "File must be an excel document",
              status: "error",
              position: "top-right",
              duration: 5000,
              isClosable: true,
            });
          }
        }
        // return false
      };


     handleFileChange = (event) => {
        const files = event.target.files;
    
        if (!files[0]) return;
        this.setSelectedFile(files[0]);
        this.setIsFilePicked(true);
      };
}




export default uploadDocumentHandler














































// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files as FileList;

//     if (!files[0]) return;
//     setSelectedFile(files[0]);
//     setIsFilePicked(true);
//   };
//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     // check if the file is an excel file
//     if (isFilePicked && selectedFile) {
//       if (
//         selectedFile.type ===
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//         selectedFile.type === "application/vnd.ms-excel"
//       ) {
//         const formData = new FormData();
//         formData.append("template_file", selectedFile);

//         const ORG_SHORT_NAME = localStorage.getItem("current_organization");

//         axios.post(`/client/${ORG_SHORT_NAME}/designation/bulk-add/`, formData)
//           .then((res: AxiosResponse) => {
//             toast({
//               title: res.data.message,
//               status: "success",
//               position: "top-right",
//               duration: 5000,
//               isClosable: true,
//             })
//             setSelectedFile(undefined)
//             dispatch(addDesignation({  name: '',
//               level: "",
//               level_id: ""}))
//           })
//           .catch((err:AxiosError) => {

//             console.log(err.response)
//             // console.log('\nss\nddd')
//             //   console.log(errorMessageGetter(err.response),"yes from the nw fucntion")
//             toast({
//               title: errorMessageForFileUpload(err.response),
//             //   description: err.response?.data.errors[0].message[0],
//               status: "error",
//               position: "top-right",
//               duration: 5000,
//               isClosable: true,
//             })
//           });
//       } else {
//         toast({
//           title: "File must be an excel document",
//           status: "error",
//           position: "top-right",
//           duration: 5000,
//           isClosable: true,
//         });
//       }
//     }
//   };