import { Box, Button, Editable, Heading, List, ListIcon,ListItem } from "@chakra-ui/react"
import { useState } from "react"
import { AiFillEdit, AiOutlineCloseCircle } from "react-icons/ai"
import { MdCheckCircle } from "react-icons/md"
import { EditEmployee, EmployeeData } from "../redux/employees/employeesAPI"
import { Radio, RadioGroup ,Stack} from '@chakra-ui/react'
import { useErrorHandler } from "react-error-boundary"
import { AddEmployeeInputs } from "../drawers/AddEmployee"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { selectEmployees } from "../redux/employees/employeesSlice"
import Preloader from "../components/Preloader"


const iconStyle:any ={'display':'inline-block','margin':'0 10px','cursor':'pointer'}
const EmployeeStatus =(data:EmployeeData):React.ReactElement=>{
    const [isEdit,setIsEdit] = useState(false);
    const {status} = useAppSelector(selectEmployees)
    const [value,setValue] = useState<string>(data.employee_employment_information.status?data.employee_employment_information.status:'active');
    const handleError = useErrorHandler()
    const org_name = localStorage.getItem("current_organization_short_name");
    const  dispatch = useAppDispatch()
    const handleSubmit =()=>{
        let final_value:string ='active';
        if(isEdit){
            //submit edited info
            final_value = value
        }
        else{
            if(data.employee_employment_information.status){
                final_value=data.employee_employment_information.status
            }
        }


        if(org_name){
            const structure:any =(data?.corporate_level&&data?.corporate_level) ||
            (data?.group&&data?.group) ||
            (data?.unit&&data?.unit) ||
            (data?.division&&data?.division)||(data?.department&&data?.department)
            
            if(!structure)return 
            
            let level_name = ''
            if(data.corporate_level){
                level_name='corporate_level'
            }
            if(data.group){
                level_name='group'
            }
            if(data.department){
                level_name='department'
            }
            if(data.unit){
                level_name='unit'
            }
            if(data.division){
                level_name='division'
            }
            if(data.department){
                level_name='department'
            }
            const final_data:AddEmployeeInputs={
                first_name:data.user.first_name,
                last_name:data.user.last_name,
                email:data.user.email,
                phone_number:data.user.phone_number,
                role:data.user.user_role,
                date_of_birth:data.employee_basic_information.date_of_birth,
                brief_description:data.employee_basic_information.brief_description,
                personal_email:data.employee_contact_information.personal_email,
                address:data.employee_contact_information.address,
                guarantor_one_first_name: data.employee_contact_information.guarantor_one_first_name,
                guarantor_one_last_name: data.employee_contact_information.guarantor_one_last_name,
                guarantor_one_address: data.employee_contact_information.guarantor_one_address,
                guarantor_one_occupation:data.employee_contact_information.guarantor_one_occupation,
                guarantor_one_age:+data.employee_contact_information.guarantor_one_age,
                "guarantor_one_id_card":null,
                "guarantor_one_passport":null,
                
                guarantor_two_first_name:data.employee_contact_information.guarantor_two_first_name,
                guarantor_two_last_name: data.employee_contact_information.guarantor_two_last_name,
                guarantor_two_address:data.employee_contact_information.guarantor_two_address,
                guarantor_two_occupation:data.employee_contact_information.guarantor_two_occupation,
                guarantor_two_age:+data.employee_contact_information.guarantor_two_age,
                "guarantor_two_id_card":null,
                "guarantor_two_passport":null,
                date_employed: data.employee_employment_information.date_employed?data.employee_employment_information.date_employed:'',
                level:level_name,
                level_id:structure.uuid,
                designation_name:data.employee_basic_information.designation.name,
                career_path_level:data.career_path?data.career_path.level.toString():'',
                education_details:data.employee_basic_information.education_details,
                employee_uuid:data.uuid,
                status:final_value
            }
            console.log({final_data})
            dispatch(EditEmployee({data:final_data,org_name,handleError}))
        }
        
    }
        console.log(status)
    return (
        <Box>
            {status==='updating'&&<Preloader/>}
{
    isEdit?
<Box>
<RadioGroup onChange={setValue} value={value}>
         <Heading as='h4' size='md'>
                Please Pick Status
                <Box onClick={(e)=>setIsEdit(!isEdit)} style={iconStyle}>
                    {isEdit?
                    <AiOutlineCloseCircle  />
                    :
                    <AiFillEdit />
                    }
            </Box>
            </Heading> 
            <br />
    <Stack>
        <Radio value='active'>Active</Radio>
        <Radio value='on_leave'>On Leave</Radio>
        <Radio value='suspended'>Suspended</Radio>
        <Radio value='absent'>Absent</Radio>
        <Radio value='dismissed'>Dismissed</Radio>
        <Radio value='resigned'>Resigned</Radio>
    </Stack>
</RadioGroup>
    <Button variant={'primary'}
    loadingText='updating...'
    isLoading={status==='updating'}
    onClick={(e)=>{
        e.preventDefault()
        console.log('ddd')
        handleSubmit()
    }}>Submit</Button>


</Box>
:

            <List spacing={3}>
            <Heading as='h4' size='md'>
                Current Status
                <Box onClick={(e)=>setIsEdit(!isEdit)} style={iconStyle}>
                    {isEdit?
                    <AiOutlineCloseCircle  />
                    :
                    <AiFillEdit />
                    }
            </Box>
            </Heading> 
                <ListItem >
                    <ListIcon as={MdCheckCircle} color={'green.500'} />
                    {data.employee_employment_information.status}
                </ListItem>
                   
            </List>
}
            <br />

           


        </Box>
    )
}


export default EmployeeStatus