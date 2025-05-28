import { Button, Grid } from "@chakra-ui/react"
import InputWithLabel from "../InputWithLabel"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { TenantDataType, UpdateTenatsApi } from "../../redux/TenantAdminManager/TenantAdminManagerApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useErrorHandler } from "react-error-boundary";
import { selectTenant_admin_management } from "../../redux/TenantAdminManager/TenantAdminManagerSlice";
import Preloader from "../Preloader";



export type TenantUpdateFormType = {
    "name_of_account_manager": null|string,
    "tel_of_account_manager": null|string,
    "email_of_account_manager": null|string,
    "name_of_account_HRmanager": null|string,
    "tel_of_account_HRmanager": null|string,
    "email_of_account_HRmanager": null|string
    "poc": number,
    'company_short_name':string;
    "employee_limit":number,
}
type Prop = {
    data:TenantDataType
}


const schema = yup.object({
    "name_of_account_manager": yup.string(),
    "tel_of_account_manager":yup.string(),
    "email_of_account_manager": yup.string(),
    "name_of_account_HRmanager":yup.string(),
    "tel_of_account_HRmanager": yup.string(),
    "email_of_account_HRmanager": yup.string(),
    "poc": yup.string().required(),
    "employee_limit": yup.string().required(),
    'company_short_name':yup.string(),
})

const TenantUpdateManage = ({data}:Prop)=>{
    const dispatch = useAppDispatch()
    const { status } = useAppSelector(selectTenant_admin_management)
    const handleError = useErrorHandler()
    const { setValue,register, handleSubmit, formState: { errors } } = useForm<TenantUpdateFormType>({
        resolver: yupResolver(schema)
      });

      useEffect(()=>{
            setValue('poc',data.poc)
            setValue('name_of_account_manager',data.name_of_account_manager?data.name_of_account_manager:'')
            setValue('tel_of_account_manager',data.tel_of_account_manager?data.tel_of_account_manager:'')
            setValue('email_of_account_manager',data.email_of_account_manager?data.email_of_account_manager:'')
            setValue('name_of_account_HRmanager',data.name_of_account_HRmanager?data.name_of_account_HRmanager:'')
            setValue('tel_of_account_HRmanager',data.tel_of_account_HRmanager?data.tel_of_account_HRmanager:'')
            setValue('email_of_account_HRmanager',data.email_of_account_HRmanager?data.email_of_account_HRmanager:'')
            setValue('poc',data.poc)
            setValue('employee_limit',data.employee_limit)
            setValue('company_short_name',data.company_short_name)
      },[])

      const onSubmit = (form_data: TenantUpdateFormType) => {


        // console.log({completedData})
        dispatch(UpdateTenatsApi({'data':form_data,handleError}))
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {status=='loading'&&<Preloader/>}
            <InputWithLabel label="Poc" id='poc'
            register={register('poc')}
            formErrorMessage={errors.poc?.message}
            />
            <InputWithLabel
            register={register('name_of_account_manager')}
            formErrorMessage={errors.name_of_account_manager?.message}
            label="Account Manager Name" id='acct_name'/>
            <InputWithLabel label="Account Manager Tel" 
            register={register('tel_of_account_manager')}
            formErrorMessage={errors.tel_of_account_manager?.message}
            id='acct_tel'/>

            <InputWithLabel 
                        register={register('email_of_account_manager')}
                        formErrorMessage={errors.email_of_account_manager?.message}
                        type={'email'}
            label="Account Manager Email"
            id='acct_email'/>


            <InputWithLabel 
                        register={register('employee_limit')}
                        formErrorMessage={errors.employee_limit?.message}
                        type='number'
            label="Number of Users" id='acct_users'/>

            <InputWithLabel 
            register={register('name_of_account_HRmanager')}
            formErrorMessage={errors.name_of_account_HRmanager?.message}
            label="Hr Manager Name" id='hr_name'/>

            <InputWithLabel 
                        register={register('tel_of_account_HRmanager')}
                        formErrorMessage={errors.tel_of_account_HRmanager?.message}
            label="Hr Manager Tel" id='hr_tel'/>
            <InputWithLabel label="Hr Manager Email" 
            register={register('email_of_account_HRmanager')}
            formErrorMessage={errors.email_of_account_HRmanager?.message}
            id='hr_email'/>
    <br />
    <br />

            <Button
             type="submit"
             variant="primary"
             fontWeight="bold"
             isLoading={status=='loading'}
             loadingText="Please Wait"
             size="lg"
            >
                Submit
            </Button>


    </form>
    )
}


export default TenantUpdateManage