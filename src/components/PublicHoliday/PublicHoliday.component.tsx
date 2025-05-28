import { Box, Button, Flex,Heading, Input,Text, InputGroup, InputLeftElement, InputRightElement, Stack , Grid, GridItem, useToast} from "@chakra-ui/react"
import { BsFillHouseDoorFill } from "react-icons/bs"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import {MdDateRange, MdDelete} from 'react-icons/md'
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPublicHoliday, deletePublicHoliday, getPublicHoliday, PublicHolidayType } from "../../redux/PublicHoliday/PublicHolidayApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPublicholiday, setPublicHolidayToIdle } from "../../redux/PublicHoliday/PublicHolidaySlice";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import moment from "moment";
import FilterTableData from "../FilterTableData";
import Preloader from "../Preloader";


const schema  =  yup.object().shape({
    name:yup.string().required('Please Enter Name'),
    date:yup.string().required('Please dont enter past date'),
})
const PublicHoliday = ():React.ReactElement=>{
    const formRef = useRef<any>();
    const { data ,status,errorMessage} = useAppSelector(selectPublicholiday)
    const dispatch = useAppDispatch()
  const handleError = useErrorHandler();
  const [start_date_after,setStart_date_after] = useState<string>('');
  const [start_date_before,setStart_date_before] = useState<string>('');

  const toast = useToast()

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<PublicHolidayType>({ resolver: yupResolver(schema) });


      const onSubmit =(data:PublicHolidayType)=>{
            console.log({'subbmited data':data})

            dispatch(createPublicHoliday({data,handleError}))
        }

        const handleGetHoliday = ()=>{
          //
          dispatch(getPublicHoliday({}))
        }



        useEffect(()=>{
          if(status==='created'){
            toast({
              title: 'Created Successfully',
              status: "success",
              position: "top",
              duration: 3000,
              isClosable: true,
            })
            dispatch(setPublicHolidayToIdle({}))
          }
          if(status==='error'){
            if(errorMessage){
              toast({
                title: errorMessage,
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
              })
              dispatch(setPublicHolidayToIdle({}))
            }

          }

          if(status === 'deleted'){
            toast({
              title: 'Deleted Successfully',
              status: "success",
              position: "top",
              duration: 3000,
              isClosable: true,
            })
            dispatch(setPublicHolidayToIdle({}))

          }
        },[status])


        useEffect(()=>{
          handleGetHoliday()
        },[])
    return (
        <Box style={{'width':'900px','margin':'0 auto'}}>
            {/* <form   ref={formRef} > */}
            {/* <FilterTableData
            getDataFunction={handleGetHoliday}
            start_date_before={start_date_before}
            setStart_date_before={setStart_date_before}
            start_date_after={start_date_after}
            setStart_date_after={setStart_date_after}
            />  */}
            {/* <br /><br /><br /> */}
           
            {
              (status==='pending'||status ==='deleting')?
              <Preloader/>:
              <>
              <Flex justifyContent={'space-between'}>
  <InputGroup width={'40%'}>
    <InputLeftElement
      pointerEvents='none'
      
      children={<BsFillHouseDoorFill color='gray.300' />}
    />
    <Input type='text' placeholder='Public Holiday Name' {...register('name')} />
    <p style={{'color':'crimson'}}>{errors.name?.message}</p>

  </InputGroup>

  <InputGroup width={'40%'}>
   
    <Input type='date'  {...register('date')} />
    <InputRightElement children={<MdDateRange color='green.500' />}  />
    <p style={{'color':'crimson'}}>{errors.date?.message}</p>
  </InputGroup>

  <Button 
    variant="primary"
    // type="submit"
    loadingText="Creating"
    isLoading={status==='creating'}
    onClick={handleSubmit((onSubmit))}
  >Create</Button>
            </Flex> 
            {/* </form> */}
           
            <br /><br /><br />
            <Grid templateColumns='repeat(5, 1fr)' 
            gap={6}
            mb="10"
            >

                {
                    data.length===0?'':
                    data.map((data,index)=>(
                    <Box
                    // maxW='md'
                    width={'150px'}
                    textAlign='center'
                     borderWidth='1px' borderRadius='lg' 
                    padding={'1rem'}
                    boxShadow='xl' 
                    key={index}
                    style={{'position':'relative'}}
                    >
                    <Heading fontSize='small'>{data.name}</Heading>
                    <Text >
                        <br />
                       {data.date}
                    </Text>
                    <Text>
                      <MdDelete style={{'position':'absolute','top':'0','right':'0','cursor':'pointer'}}
                        onClick={(e)=>{
                          dispatch(deletePublicHoliday(data.date))
                        }}
                      />
                    </Text>
                    </Box>
                    ))
                }

                   

            </Grid>
              </>
            }
            

        </Box>
    )
}

export default PublicHoliday