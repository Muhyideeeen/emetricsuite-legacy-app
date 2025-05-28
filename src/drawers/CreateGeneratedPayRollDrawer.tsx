import {
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
    Button,
    Select, 
    FormLabel,
    useToast
  } from "@chakra-ui/react";
import { useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import InputWithLabel from "../components/InputWithLabel";
import axios from "../services/api";
import moment from 'moment'
import Preloader from "../components/Preloader";
import { structureType } from "../tabs/home/payroll/monthlyStructure";


// {
//     "status": 201,
//     "message": "Generated Successfull",
//     "data": [
//         {
//             "generated_for": "2022-09-12"
//         }
//     ]
// }

// {
//     "status": 400,
//     "message": "validation error",
//     "error": {
//         "generated_for": "already created data for this month"
//     }
// }

const CreateGeneratedPayRollDrawer = ():React.ReactElement=>{
    const [payrollType,setPayrollType] = useState<structureType|null>(null);
    const [generated_for,setGenerated_for]=useState<any>();

    const toast = useToast();
    const org_name  = localStorage.getItem("current_organization_short_name"); 
    const [isLoading,setIsLoading] = useState(false)
    const handleError= useErrorHandler()

    const onSubmit = async () =>{
        if(!payrollType) {
            toast({
                title: `Pick Template is required`,
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
            })
            return
        }
        if(!generated_for) {
            toast({
                title: `Pick Date is required`,
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
            })
            return
        }
        if(!org_name) return 
        if(!payrollType ){
            toast({
                title: `Please Pick a payroll template`,
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
            })
            return 
        }

        try{
            setIsLoading(true)
            const resp = await axios.post(`/client/${org_name}/payroll/monthly_generate/`,{'generated_for':moment(generated_for).format("YYYY-MM-DD"),'structure_type':payrollType})
            if(resp.data.status === 201){
                toast({
                    title: `Generated Successfully`,
                    status: 'success',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                })
            }
            setIsLoading(false)

        }catch(err:any){
            setIsLoading(false)

            if(err.response.status===401){
                handleError(err)
              }
              if(err.response.status===400){
                toast({
                    title: `already created data for this month! ${generated_for}`,
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                })
              }

        }
        setIsLoading(false)

    }
    return (
        <div>
              <DrawerCloseButton />
      <DrawerHeader fontSize="md">Generate PayRoll</DrawerHeader>
      <DrawerBody>
        {/* {isLoading&&<Preloader/>} */}
            <br />
            <br />
            <FormLabel fontSize="xs" htmlFor={'xcs'} fontWeight="semibold">
            Pick Template
        </FormLabel>
            <Select placeholder='Pick Template' required  onChange={(e)=>{
                const data = e.target.value
                if(data){
                    setPayrollType(data as structureType)
                }
                }}>
                <option value='monthly'>Monthly</option>
                <option value='daily'>Daily </option>
                <option value='hourly'>Hourly</option>
            </Select>
            <br />            <br />
            <InputWithLabel id='date' type="date" isRequired={true} label="Pick Date" onChange={(e)=>setGenerated_for(e.target.value)}/>
            <br />            <br />
      </DrawerBody>
      <DrawerFooter>
      <Button
          type="submit"
          form="add-designation-form"
          variant="primary"
          w="full"
          isLoading={isLoading}
          loadingText="generating..."
          onClick={(e)=>onSubmit()}
        >
        Generate Payroll
        </Button>
      </DrawerFooter>
        </div>
    )
}

export default CreateGeneratedPayRollDrawer