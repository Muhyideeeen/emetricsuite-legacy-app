import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import moment from 'moment'
import {
    DrawerBody,
    Flex,
    Text,DrawerHeader,
    Box,FormLabel,FormControl,Input,
    DrawerCloseButton,
    Button,
    useToast,
    Select
  } from "@chakra-ui/react";

import {CalendarInputWithoutPast,ExcludeDaysInCalendar} from "../components/DateInput";
import { HiOutlineChevronLeft } from "react-icons/hi";
import axios from "../services/api";
import { useEffect, useState } from "react";
import Preloader from "../components/Preloader";
import InputWithLabel from "../components/InputWithLabel";

type CreateTenantLicence ={
  'duration':string;
  start_date:string;
  duration_number:number;
  end_time:string;
  start_time:string;
}



const schema = yup.object({
  duration:yup.string().required(),
  start_date:yup.string().required(),
  duration_number:yup.number().required(),
  start_time:yup.string().required(),
})
type Prop ={
  company_short_name:string
}
const CreateTenantLicence = ({company_short_name}:Prop):React.ReactElement=>{
  const toast = useToast()
  const [isLoading,setIsloading]= useState(false)
  const  [isDeleteing,setIsDeleteing] = useState(false)
    const {
        register,
        handleSubmit,control,setValue,
        formState: { errors },reset,watch
      } = useForm<CreateTenantLicence>({ resolver: yupResolver(schema) });
      const watchFields =watch(['duration']);
      const currentDuration = watchFields[0];

      const onSubmit = async (data: CreateTenantLicence) => {



        let formateddata:any ={
          'start_date':moment(data.start_date).format('YYYY-MM-DD'),
          'end_time':'22:00',
          'start_time':data.start_time
        }

        if(data.duration === 'daily'){
          formateddata['end_date']=moment(data.start_date).add('days', data.duration_number).format('YYYY-MM-DD')
        }
        if(data.duration === 'monthly'){
          formateddata['end_date']=moment(data.start_date).add('days', data.duration_number).format('YYYY-MM-DD')
        }
        if(data.duration === 'quarterly'){
          formateddata['end_date']=moment(data.start_date).add('months', 3).format('YYYY-MM-DD')
        }
        setIsloading(true)
        try {
            const resp = await axios.post(`/client-management/manager/${company_short_name}/handle_lincene/`,formateddata)
            setIsloading(false)
            if(resp.data.status===201){
              toast({
                title: 'Activation Set!',
                status: 'success',
                position: "top",
                duration: 5000,
                isClosable: true,
              })
            }
            if(resp.data.status===200){
              toast({
                title: 'This Client is currently Activate you have to wait till this activation Expires !',
                status: 'error',
                position: "top",
                duration: 5000,
                isClosable: true,
              })
            }

            console.log({resp})
        } catch (err:any) {
          setIsloading(false)
          console.log({err})
            toast({
              title: 'Something went wrong refresh and try again or re-login',
              status: 'error',
              position: "top",
              duration: 5000,
              isClosable: true,
            })
        }
      };

      const formatQuetion = ():string=>{
        if(currentDuration ==='daily') return 'How many days do you want it to last'
        if(currentDuration ==='monthly') return 'How many month do you want it to last'
        return ''
        // if(currentDuration ==='monthly') return ''
      }












      useEffect(()=>{
        if(watchFields[0]==='quarterly'){
          setValue('duration_number',3)
        }
        if(watchFields[0]==='monthly'){
          setValue('duration_number',30)
        }
      },[watchFields])
     console.log(errors)
    return (
           
          <form style={{'padding':'1rem'}}  onSubmit={handleSubmit(onSubmit)}>
            {isLoading&&<Preloader/>}
            <FormControl >
                    <FormLabel fontSize="xs" htmlFor={'End Date'} fontWeight="semibold">
                    Start Date
                    </FormLabel>

                    <CalendarInputWithoutPast
                    name='start_date'
                    dateFormat ="yyyy/MM/dd"
                    control={control}
                    />
            </FormControl>

<br/>
            <FormControl >
                    <FormLabel fontSize="xs" htmlFor={'End Date'} fontWeight="semibold">
                    Start Time
                    </FormLabel>

                    <Input type='time' {...register('start_time')}/>
            </FormControl>
      <br />
            <Select placeholder='Duration' {...register('duration')}>
            <option value='daily'>Daily</option>
            <option value='monthly'>Monthly</option>
            <option value='quarterly'>Quarterly</option>
          </Select>
      <br />
          {
            currentDuration?
           currentDuration!=='quarterly'?
            <InputWithLabel
            id='duration_number' 
            label={formatQuetion()}
            register={register('duration_number')}
            />:''
            :''
          }


            <br /><br />
            <Button
               type="submit"
               variant="primary"
               fontWeight="bold"
            //    isLoading={status=='loading'}
               loadingText="Please Wait"
               size="lg"
            >Create Licence</Button>



          </form>

            
    )
}

export default CreateTenantLicence



