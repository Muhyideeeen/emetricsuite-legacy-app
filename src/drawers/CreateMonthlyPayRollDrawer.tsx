import {useState,useEffect} from "react"
import {
  
  Button
 ,HStack,Checkbox,
  Heading,Select,
  Grid, useToast, IconButton, FormControl, FormLabel
} from "@chakra-ui/react";
import InputWithLabel from "../components/InputWithLabel";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import {MonthlyPayrollStructureType, employee_other_deductablesType, employee_receivablesType, employee_regulatory_deductablesType, employee_regulatory_recievablesType, createMonthlyPayrollStructure, employee_other_receivables } from "../redux/payroll/monthlyPayrollStructure/monthlyPayrollStructureApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppDispatch,useAppSelector } from "../redux/hooks";
import SelectAsyncPaginate from "../components/AsyncSelect";
import { useErrorHandler } from "react-error-boundary";
import { selectMontlyPayRollStructure, setMonthlyPayrollStructureStatusIdle } from "../redux/payroll/monthlyPayrollStructure/monthlyPayrollStructureSlice";
import { get_percent_by_amount } from "../services/extraFunctions";


const schema =yup.object().shape({
    structure_type:yup.string().default('monthly'),
    rate:yup.number().default(0.00),
    number_of_work:yup.number().default(0),
    gross_money:yup.number().required(),
    grade_level:yup.string().required(),
    "employee_receivables":yup.array().of(
        yup.object().shape({
            'fixed_receivables_element':yup.string().required(),
            'fixed_receivables_element_gross_percent':yup.number().required(),
            'regulatory_rates':yup.number().default(0)
        })),
    'employee_regulatory_recievables':yup.array().of(
        yup.object().shape({
            'regulatory_receivables':yup.string().required(),
            'regulatory_receivables_gross_percent':yup.number().required(),
            'regulatory_rates':yup.number().required()
        })),
    'employee_regulatory_deductables':yup.array().of(
        yup.object().shape({
            'regulatory_deductables':yup.string().required(),
            'regulatory_deductables_gross_percent':yup.number().required(),
            'regulatory_rates':yup.number().default(0)
        })),
    "employee_other_deductables":yup.array().of(
        yup.object().shape({
            'other_deductables':yup.string().required(),
            'other_deductables_gross_percent':yup.number().required(),
        })),
    "employee_other_receivables":yup.array().of(
        yup.object().shape({
            "other_receivables_element":yup.string().required(),
            "other_receivables_element_gross_percent":yup.number().required(),
        })
    )
})
const CreateMonthlyPayRollDrawer= ():React.ReactElement=>{
    const org_name = localStorage.getItem("current_organization_short_name");
    const toast = useToast()
    const [careerPaths,setCareerPaths]=useState<any>();
    //use Percent will allow the user enter the data in percent style instead of amount
    const [usePercent,setUsePercent] = useState(true)
    const [employee_other_reciveable_list,setEmployee_other_reciveable_list] = useState<employee_other_receivables[]>([
        {'other_receivables_element':"",'other_receivables_element_gross_percent':0.00},
    ])

    const handleEmployeeOtherReciveableAddNewInputRow=()=>setEmployee_other_reciveable_list([...employee_other_reciveable_list, {'other_receivables_element':"",'other_receivables_element_gross_percent':0.00}])
    const handleEmployeeOtherReciveableRemove=(index:number)=>{
        const newList = [...employee_other_reciveable_list]
        newList.splice(index,1)
        setEmployee_other_reciveable_list(newList)
    }


    const [employee_fixed_reciveable_list,setEmployee_fixed_reciveable_list]= useState<employee_receivablesType[]>([
        {fixed_receivables_element:'',fixed_receivables_element_gross_percent:0.00,regulatory_rates:0.00}
    ])
    const handleEmployeeFixedReciveableAddNewInputRow=()=>setEmployee_fixed_reciveable_list([...employee_fixed_reciveable_list,{fixed_receivables_element:'',fixed_receivables_element_gross_percent:0.00,regulatory_rates:0.00}])
    const handleEmployeeFixedReciveableRemove=(index:number)=>{
        const newList = [...employee_fixed_reciveable_list]
        newList.splice(index,1)
        setEmployee_fixed_reciveable_list(newList)
    }

    const [employee_regulatory_recievables_list,setEmployee_regulatory_recievables_list]= useState<employee_regulatory_recievablesType[]>([
        {regulatory_receivables:'',regulatory_receivables_gross_percent:0.00,regulatory_rates:0.00}
    ])

    const handleRegulatoryRecievablesAddNewInputRow=()=>setEmployee_regulatory_recievables_list([...employee_regulatory_recievables_list,{regulatory_receivables:'',regulatory_receivables_gross_percent:0.00,regulatory_rates:0.00}])
    const handleRegulatoryRecievablesRemove=(index:number)=>{
        const newList = [...employee_regulatory_recievables_list]
        newList.splice(index,1)
        setEmployee_regulatory_recievables_list(newList)
    }


    // "deductables"
    const [employee_regulatory_deductables_list,setEmployee_regulatory_deductables_list]= useState<employee_regulatory_deductablesType[]>([
        {regulatory_deductables:'',regulatory_deductables_gross_percent:0.00,regulatory_rates:0.00}
    ])

    const handleRegulatoryDeductablesAddNewInputRow=()=>setEmployee_regulatory_deductables_list([...employee_regulatory_deductables_list,{regulatory_deductables:'',regulatory_deductables_gross_percent:0.00,regulatory_rates:0.00}])
    const handleRegulatoryDeductablesRemove=(index:number)=>{
        const newList = [...employee_regulatory_deductables_list]
        newList.splice(index,1)
        setEmployee_regulatory_deductables_list(newList)
    }


    const [employee_other_deductables_list,setEmployee_other_deductables_list]= useState<employee_other_deductablesType[]>([
        {other_deductables:'',other_deductables_gross_percent:0.00,}
    ])

    const handleOtherDeductablesAddNewInputRow=()=>setEmployee_other_deductables_list([...employee_other_deductables_list,{other_deductables:'',other_deductables_gross_percent:0.00,}])
    const handleOtherDeductablesRemove=(index:number)=>{
        const newList = [...employee_other_deductables_list]
        newList.splice(index,1)
        setEmployee_other_deductables_list(newList);
    }
    const {
        register,setValue, 
        handleSubmit,control,
        formState: { errors },watch
      } = useForm<MonthlyPayrollStructureType>({ resolver: yupResolver(schema) });
    const dispatch = useAppDispatch();
    const handleError= useErrorHandler()
    const watchFields = watch(['structure_type','rate','number_of_work','gross_money'])
    const {status,errMessage} = useAppSelector(selectMontlyPayRollStructure);
    
    useEffect(()=>{
        if(status==='created'){
            dispatch(setMonthlyPayrollStructureStatusIdle({}))
            toast({
                title: 'Created',
                status: 'success',
                position: "top",
                duration: 3000,
                isClosable: true,
            })
        }
        if(status==='error'){
            dispatch(setMonthlyPayrollStructureStatusIdle({}))
            toast({
                title:errMessage,
                status: 'error',
                position: "top",
                duration: 3000,
                isClosable: true,
            })
        }
    },[status])

    useEffect(()=>{
        setValue('structure_type','monthly')
    },[])
    useEffect(()=>{
        //monthy dont need this so the data is not usefull
        if(watchFields[0]==='monthly'){
            //the code below is to avoid infinte loop
            if(watchFields[1]!== 1){
                setValue('number_of_work',1)
            }
            if(watchFields[2]!== 1){
                setValue('rate',1)
            }

        }
    },[watchFields])
    const onSubmit: SubmitHandler<MonthlyPayrollStructureType>=data=>{
        console.log(data,org_name)
        if(!org_name) return 
        console.log(data)
        dispatch(createMonthlyPayrollStructure({
            org_name,
            data,handleError
        }))
    }
    console.log(errors)
    return (
                <form   onSubmit={handleSubmit(onSubmit)}>
<Checkbox isChecked={usePercent} onChange={e=>setUsePercent(!usePercent)}>
Use Percentage
</Checkbox>
<br />
<br />
<Select placeholder='Select Structure Type' onChange={(e)=>{
        setValue('structure_type',e.target.value)
}}
defaultValue='monthly'
>
  <option value='monthly'>Monthly</option>
  <option value='daily'>Daily</option>
  <option value='hourly'>Hourly</option>
</Select>
<br/>

{
    watchFields[0]=='monthly'?
                    <HStack  mb="5">
                <InputWithLabel
                    id="Gross-Amount"
                    label="Gross Amount"
                    variant="filled"
                    bg="secondary.200"
                    name="gross_money"
                    register={register('gross_money')}
                    // formErrorMessage={errors.name?.message}
                    />

                    </HStack>:
              <Grid
              gridTemplateColumns="1fr 1fr  1fr"
              alignItems="end"
              columnGap="2"
              mb="3"
             >
                 <InputWithLabel
             id="rate"
             label={` ${watchFields[0]=='hourly'?'Hourly':'Daily'} Rate `}
             variant="filled"
             bg="secondary.200"
             name="rate"
             isRequired={true}
             register={register('rate')}
            //  formErrorMessage={errors.name?.message}
             />
             <InputWithLabel
             id="number_of_work"
             label={`Numbers of ${watchFields[0]=='hourly'?'Hour':'Days'}`}
             variant="filled"
             bg="secondary.200"
             name="number_of_work"
             type={'number'}
             isRequired={true}
            register={register('number_of_work',{
                onChange:(e)=>{
                    const rate = watchFields[1]
                    if(rate){
                        setValue('gross_money',e.target.value * rate )
                    }
                    return  e.target.value
                }
            })}

             // formErrorMessage={errors.name?.message}
             />
             <InputWithLabel
             id="gross_money"
             label={`Gross Money`}
             variant="filled"
             bg="secondary.200"
             name="gross_money"
             type={'number'}
             isReadOnly={true}
             disabled={true}
            register={register('gross_money')}
             // formErrorMessage={errors.name?.message}
             />
             

             </Grid>
}


<HStack mb="5" align="baseline">
            <FormControl mb="5">
              <FormLabel htmlFor="level_id" fontSize="xs"  fontWeight="semibold">
                Career Path Level
              </FormLabel>
              {/* /client/${org_name}/career-path */}
              <SelectAsyncPaginate 
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
              // key={currentlySelectedStructure}
              url={`/client/${org_name}/career-path?me=1`}
              value={careerPaths}
              onChange={(value)=>{
                setValue('grade_level',value?.career_path_id)
                setCareerPaths(value)
                 return value
              }}
              SelectLabel={(option:any)=>`${option.name},  Level:${option?.level}`}
              SelectValue={(option:any)=> {
                return `${option.level}`
              } }
              placeholder={""}
              
              />
              {/* <Text fontSize="sm" color="crimson">
                {errors.level_id?.message}
              </Text> */}
            </FormControl>
            
          </HStack>
                   
                    
                <Heading as='h3' size='md'>
                Receivables
                </Heading>
                    <br />
                    {
                        employee_fixed_reciveable_list.map((employee_fixed_reciveable,index)=>(

                    <Grid
                     key={index}
                     gridTemplateColumns={!usePercent?"1fr 1fr 1fr  40px":"1fr 1fr  40px"}
                     alignItems="end"
                     columnGap="2"
                     mb="3"
                    >
                        <InputWithLabel
                    id="Gross-Amount"
                    label="Employee Fixed Recievable Elements"
                    variant="filled"
                    bg="secondary.200"
                    name="name"
                    register={register(`employee_receivables.${index}.fixed_receivables_element`)}
                    // formErrorMessage={errors.name?.message}
                    />
                    {
                        //this input is for only the front end if the user is confortable using amount instead of percent
                     !usePercent?   
                     <InputWithLabel 
                     id='fixed_receivables_element_gross_amount'
                     label="Percentage of Gross(amount)"
                    variant="filled"
                    bg="secondary.200"
                    name="fixed_receivables_element_gross_amount"
                    type={'number'}
                    placeholder="should be in amount e.g 100"
                    onChange={(e)=>{
                        let value = e.target.value
                        
                        setValue(`employee_receivables.${index}.fixed_receivables_element_gross_percent`,get_percent_by_amount(parseInt(value),watchFields[3]))
                    }}
                     />:''
                    }
                    <InputWithLabel
                    id="fixed_receivables_element_gross_percent"
                    label="Percentage of Gross(%)"
                    variant="filled"
                    disabled={usePercent?false:true}
                    bg="secondary.200"
                    name="fixed_receivables_element_gross_percent"
                    type={'number'}
                    placeholder="%"
register={register(`employee_receivables.${index}.fixed_receivables_element_gross_percent`)}

                    // formErrorMessage={errors.name?.message}
                    />
                    
                     <IconButton
                  aria-label="Delete Employee Fixed Recievable Elements"
                  icon={<RiDeleteBinLine />}
                  onClick={() => handleEmployeeFixedReciveableRemove(index)}
                />

                    </Grid>

                        ))
                    }
                    <Button
                    leftIcon={<RiAddLine />}
                    mb="2"
                    bg="secondary.200"
                    variant="solid"
                    onClick={handleEmployeeFixedReciveableAddNewInputRow}
                >
                    Add More
                </Button>    
                <br />

                {
                    employee_regulatory_recievables_list.map((employee_regulatory_recievables,index)=>(
                        <Grid
                        key={index}
                        gridTemplateColumns={!usePercent?"1fr 1fr 1fr 1fr 40px":"1fr 1fr 1fr 40px"}
                        alignItems="end"
                        columnGap="2"
                        mb="3"
                       >
                           <InputWithLabel
                       id="regulatory_receivables"
                       label="Regulatory Receivables"
                       variant="filled"
                       bg="secondary.200"
                       name="regulatory_receivables"
                       register={register(`employee_regulatory_recievables.${index}.regulatory_receivables`)}
                       // formErrorMessage={errors.name?.message}
                       />


                       {
                        !usePercent?
                        <InputWithLabel
                        id="regulatory_receivables_gross_percent"
                        label="Regulatory Receivables Gross(amount)"
                        variant="filled"
                        bg="secondary.200"
                        name="regulatory_receivables_gross_percent"
                        type={'number'}
                        placeholder="in amount e.g 300"
                        onChange={(e)=>{
                            let value = e.target.value
                            
                            setValue(`employee_regulatory_recievables.${index}.regulatory_receivables_gross_percent`,get_percent_by_amount(parseInt(value),watchFields[3]))
                        }}
                        // register={register(`employee_regulatory_recievables.${index}.regulatory_receivables_gross_percent`)}
                        // formErrorMessage={errors.name?.message}
                        />
                        :
                        ''
                       }
                       <InputWithLabel
                       id="regulatory_receivables_gross_percent"
                       label="Regulatory Receivables Gross"
                       variant="filled"
                       bg="secondary.200"
                       name="regulatory_receivables_gross_percent"
                       type={'number'}
                       placeholder="%"
                    disabled={usePercent?false:true}

                       register={register(`employee_regulatory_recievables.${index}.regulatory_receivables_gross_percent`)}
                       // formErrorMessage={errors.name?.message}
                       />
                       <InputWithLabel
                       id="regulatory_rates"
                       label="Regulatory Rates"
                       variant="filled"
                       bg="secondary.200"
                       name="regulatory_rates"
                       type={'number'}
                       placeholder="state the rate amount"
                       register={register(`employee_regulatory_recievables.${index}.regulatory_rates`)}
                       // formErrorMessage={errors.name?.message}
                       />
                       
                        <IconButton
                     aria-label="Delete Employee Fixed Recievable Elements"
                     icon={<RiDeleteBinLine />}
                     onClick={() => handleRegulatoryRecievablesRemove(index)}
                   />
   
                       </Grid>
   
                    ))
                }
                  <Button
                    leftIcon={<RiAddLine />}
                    mb="2"
                    bg="secondary.200"
                    variant="solid"
                    onClick={handleRegulatoryRecievablesAddNewInputRow}
                >
                    Add More
                </Button>    
                <br />
                {
                 employee_other_reciveable_list.map((data,index:number)=>(
                    <Grid
                    key={index}
                    gridTemplateColumns={!usePercent?"1fr 1fr 1fr  40px":"1fr 1fr  40px"}
                    alignItems="end"
                    columnGap="2"
                    mb="3"
                   >
                       <InputWithLabel
                   id="other_receivables_element"
                   label="Other receivables element"
                   variant="filled"
                   bg="secondary.200"
                   name="name"
                   register={register(`employee_other_receivables.${index}.other_receivables_element`)}
                   // formErrorMessage={errors.name?.message}
                   />
    {
          !usePercent? 
<InputWithLabel
                   id="other_receivables_element_gross_amount"
                   label="Percentage of Gross(amount)"
                   variant="filled"
                   bg="secondary.200"
                   name="other_receivables_element_gross_amunt"
                   type={'number'}
                   placeholder="should be in amount e.g 100"
                   onChange={(e)=>{
                    let value = e.target.value
                    
                    setValue(`employee_other_receivables.${index}.other_receivables_element_gross_percent`,get_percent_by_amount(parseInt(value),watchFields[3]))
                }}
// register={register()}

                   // formErrorMessage={errors.name?.message}
                   />:''
    }


                   <InputWithLabel
                    disabled={usePercent?false:true}
                   id="other_receivables_element_gross_percent"
                   label="Percentage of Gross"
                   variant="filled"
                   bg="secondary.200"
                   name="other_receivables_element_gross_percent"
                   type={'number'}
                   placeholder="%"
register={register(`employee_other_receivables.${index}.other_receivables_element_gross_percent`)}

                   // formErrorMessage={errors.name?.message}
                   />
                   
                    <IconButton
                 aria-label="Delete Employee Fixed Recievable Elements"
                 icon={<RiDeleteBinLine />}
                 onClick={() => handleEmployeeOtherReciveableRemove(index)}
               />

                   </Grid>
                 ))   
                }
                 <Button
                    leftIcon={<RiAddLine />}
                    mb="2"
                    bg="secondary.200"
                    variant="solid"
                    onClick={handleEmployeeOtherReciveableAddNewInputRow}
                >
                    Add More
                </Button>  
                <br />

                <Heading as='h3' size='md'>
            Deductables
                </Heading>
                <br />
                {
                    employee_regulatory_deductables_list.map((employee_regulatory_recievables,index)=>(
                        <Grid
                        key={index}
                        gridTemplateColumns="1fr 1fr  40px"
                        alignItems="end"
                        columnGap="2"
                        mb="3"
                       >
                           <InputWithLabel
                       id="regulatory_deductables"
                       label="Regulatory Deductables"
                       variant="filled"
                       bg="secondary.200"
                       name="regulatory_deductables"
                       register={register(`employee_regulatory_deductables.${index}.regulatory_deductables`)}
                       // formErrorMessage={errors.name?.message}
                       />
                       <InputWithLabel
                       id="regulatory_deductables_gross_percent"
                       label="Regulatory Deductables Gross"
                       variant="filled"
                       bg="secondary.200"
                       name="regulatory_deductables_gross_percent"
                       type={'number'}
                       placeholder="%"
                       register={register(`employee_regulatory_deductables.${index}.regulatory_deductables_gross_percent`)}
                       // formErrorMessage={errors.name?.message}
                       />
                      
                       
                        <IconButton
                     aria-label="Delete Employee Fixed Recievable Elements"
                     icon={<RiDeleteBinLine />}
                     onClick={() => handleRegulatoryDeductablesRemove(index)}
                   />
   
                       </Grid>
   
                    ))
                }
                  <Button
                    leftIcon={<RiAddLine />}
                    mb="2"
                    bg="secondary.200"
                    variant="solid"
                    onClick={handleRegulatoryDeductablesAddNewInputRow}
                >
                    Add More
                </Button>    
                <br />


                {
                    employee_other_deductables_list.map((employee_regulatory_recievables,index)=>(
                        <Grid
                        key={index}
                        gridTemplateColumns="1fr 1fr  40px"
                        alignItems="end"
                        columnGap="2"
                        mb="3"
                       >
                           <InputWithLabel
                       id="other_deductables"
                       label="Other Deductables"
                       variant="filled"
                       bg="secondary.200"
                       name="other_deductables"
                       register={register(`employee_other_deductables.${index}.other_deductables`)}
                       // formErrorMessage={errors.name?.message}
                       />
                       <InputWithLabel
                       id="other_deductables_gross_percent"
                       label="Other Deductables Gross"
                       variant="filled"
                       bg="secondary.200"
                       name="other_deductables_gross_percent"
                       type={'number'}
                       placeholder="%"
                       register={register(`employee_other_deductables.${index}.other_deductables_gross_percent`)}
                       // formErrorMessage={errors.name?.message}
                       />
                    
                       
                        <IconButton
                     aria-label="Delete Employee Fixed Recievable Elements"
                     icon={<RiDeleteBinLine />}
                     onClick={() => handleOtherDeductablesRemove(index)}
                   />
   
                       </Grid>
   
                    ))
                }
                  <Button
                    leftIcon={<RiAddLine />}
                    mb="2"
                    bg="secondary.200"
                    variant="solid"
                    onClick={handleOtherDeductablesAddNewInputRow}
                >
                    Add More
                </Button>    
                <br />
                
                <br />
                <Button
                 type="submit"
                //  form="add-employee-form"
                 variant="primary"
                 w='md'
                 style={{margin:'0 auto','display':'block','textAlign':'center',}}
                 isLoading={status === "creating"}
                 loadingText="Creating..."
                >Create</Button>
                </form>  
    )
}

export default CreateMonthlyPayRollDrawer