import InputWithLabel from "../../components/InputWithLabel"

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import SelectAsyncPaginate from "../../components/AsyncSelect";
import { Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import axios from "../../services/api";



type Prop = {
    employee_leave_application_id:number
}

type Input ={
    employee_uuid:number;
    employee_leave_application_id:number;
    hand_over_file:any;
}

const AssignDeputisingOffice = ({ employee_leave_application_id}:Prop):React.ReactElement=>{
    const [selectedDeputizingOfficer,setSelectedDeputizingOfficer] = useState<any>(null)
    const org_name=  localStorage.getItem('current_organization_short_name')
    const toast = useToast()
    const [isLoading,setIsLoading] = useState(false)
    const { setValue,register, handleSubmit, watch, formState: { errors } } = useForm<Input>();
    
    const onSubmit: SubmitHandler<Input> = async ( data )=>{
        console.log({'submmited':data});

        const form = new FormData()
        form.append('employee_uuid',data.employee_uuid.toString())
        form.append('employee_leave_application_id',employee_leave_application_id.toString())
        form.append('hand_over_file',data.hand_over_file[0])
        setIsLoading(true)
        try {   
            const resp:any = await axios.post(`client/${org_name}/leave-management/leave-application/assign_handover/`,form)

            if(resp.data.status===201){
        setIsLoading(false)
                toast({
                    title: 'Created Successfully hold on.',
                    status: 'success',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                })
                setTimeout(()=>{
                    window.location.reload()
                },2000)
            }
        } catch (err:any) {
        setIsLoading(false)
            const data =err.response.data
            if(data.error.employee_leave_application_id){
                toast({
                    title: 'Employee Handover Application Already Exist',
                    status: 'error',
                    position: "top",
                    duration: 3000,
                    isClosable: true,
                })
            }
            console.log({err})
            
        }

    }

    useEffect(()=>{
        setValue('employee_leave_application_id',employee_leave_application_id)
    },[])
    console.log({errors})
    return (
        <form onSubmit={handleSubmit(onSubmit)}>  
        <FormControl mb='4'>
        <FormLabel fontSize="xs" htmlFor="level_id" fontWeight="semibold">
        Deputizing officer 
        </FormLabel>
        {/* /client/${org_name}/career-path */}
        <SelectAsyncPaginate
        //?me=1 added this dummy params so i can tag on &page=1 dynamically
        // key={currentlySelectedStructure}
        url={`/client/${org_name}/employee/?me=2`}
        value={selectedDeputizingOfficer}
        onChange={(value)=>{
        setValue("employee_uuid",value.uuid)
        setSelectedDeputizingOfficer(value)
        return value
        }}
        SelectLabel={(option:any)=>`${option.user.first_name}  ${option.user.last_name}`}
        SelectValue={(option:any)=> {
        return `${option.user.email}`
        } }
        placeholder={""}
        />
        </FormControl>  
<br />
  {/* <InputWithLabel
        id='notes'
          label={'Handover Note'}
          type={'file'}
          register={register('hand_over_file')}
        /> */}
        <FormControl mb='4'>
            <FormLabel fontSize="xs" htmlFor="level_id" fontWeight="semibold">
            Handover Note
            </FormLabel>
            <input type="file" {...register('hand_over_file')}/>
        </FormControl>  

        <br />

        <Button
                type="submit"
                variant="primary"
                w="full"
                isLoading={isLoading}
                // accept="application/pdf" 
                loadingText="Applying for Leave..."
                style={{'width':'40%','margin':'0 auto','display':'block'}}
                >
                    Submit 
                </Button>
      </form>
    )
}


export default AssignDeputisingOffice