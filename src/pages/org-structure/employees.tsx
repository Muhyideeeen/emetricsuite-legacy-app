import Employees from "../../tabs/home/Employees"
import AppBar from "../../components/AppBar";

//we dont need to re wight the code cus we would re use a Component like code
const OrStructureEmployeesPage = () => {
    return (

        <>
       <AppBar
        heading="Employees"
        avatar="/logo192.png"
        imgAlt="Employees"
      />
       <Employees showAddAndUploadButton={true} />
        </>
    )
}

export default OrStructureEmployeesPage
