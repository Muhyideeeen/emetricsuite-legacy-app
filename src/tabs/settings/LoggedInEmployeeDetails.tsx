import { useEffect,useState } from "react"
import Preloader from "../../components/Preloader"
import { EmployeeInformation,Document } from "../../drawers/Employee"
import { EmployeeData } from "../../redux/employees/employeesAPI"
import axios from "../../services/api"
import { getLoggedin_userEmail ,getMyInfo} from "../../services/auth.service"



const LoggedInEmployeeDetails = ()=>{

    const [employee,setEmployee] =useState<EmployeeData>();
    const [isLoading,setisLoading]=useState(false);
    const getLoggedinEmployee = async()=>{
        const org_name  = localStorage.getItem("current_organization_short_name"); 
        const loggedInEmployeeUUid:any = getMyInfo()
        if(!org_name) return
        if(!loggedInEmployeeUUid) return
        // /client/{{ORGANISATION_NAME}}/employee/
        setisLoading(true)
        try{
             const resp = await axios.get(`/client/${org_name}/employee/?user__email=${loggedInEmployeeUUid?.email}`)
             console.log({
                 resp
             })

             setEmployee(resp.data.data[0])
        setisLoading(false)

        }catch(err:any){
                console.log({
                    err
                })
                setisLoading(false)
        
            }
            setisLoading(false)

    }
    useEffect(()=>{

        getLoggedinEmployee()
console.log("dfrfifijirfm")
    },[])

    console.log(employee,'emrpl')
    return(
        <>

        {isLoading&&<Preloader />}
      {
          employee?
          <>
          <EmployeeInformation 
        
          profile={employee.employee_basic_information?employee.employee_basic_information.brief_description:null}
                  personalEmail={employee.user.email?employee.user.email:""}
                  officialEmail={employee.employee_contact_information?
                    employee.employee_contact_information.official_email:""}
                  phoneNumber={employee.user.phone_number?employee.user.phone_number:""}
                  dateEmployed={employee?.employee_employment_information?.date_employed}
                  dateOfBirth={employee.employee_basic_information?employee.employee_basic_information.date_of_birth:null}
                  address={employee.employee_contact_information?employee.employee_contact_information.address:null}
                  team_lead={employee.employee_employment_information?.upline}
                  designationProp={employee.employee_basic_information}
                  level={
                    (employee?.corporate_level&&employee?.corporate_level) ||
                    (employee?.group&&employee?.group) ||
                    (employee?.unit&&employee?.unit) ||
                    (employee?.division&&employee?.division)||"error finiding level"
                  }
                  
                  data={employee}
          />
          <Document  {...employee} removeAddDoc={false}/>
          </>
          :""  
      }
        
        </>
    )
}


export default LoggedInEmployeeDetails