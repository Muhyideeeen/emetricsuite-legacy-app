import {
    Box,
    Text,
    Center,
    Button,
    Flex,
    Image,
    Modal,HStack,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,FormControl,
    ModalOverlay,Input,
    useDisclosure,FormLabel,MenuItem,Skeleton,
    useToast,Textarea ,Checkbox, Tooltip, Select
  } from "@chakra-ui/react";
import { useState } from "react";

  import bagIcon from "../../assets/icons/bag-frame.svg";
import SelectWithLabel from "../../components/selectWithLabels";
import axios from "../../services/api";
import TypeVerifierUserChecker from "../../utils/UserScreenAuthentication";


type SubmitReviewModalProp = {
    leave_application_id:number;
}
const SubmitReviewModal = ({ leave_application_id }:SubmitReviewModalProp):React.ReactElement=>{
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [value,setValue] = useState('');
    const [remark,setRemark] = useState('')
    const toast = useToast();
    const org_name = localStorage.getItem("current_organization_short_name");
    const [loading,setLoading] =useState(false)
    const onSubmit =async ()=>{
        if(!value){
            toast({
                title:"Please Pick option below",
                // description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
                  status: "error",
                  position: "top",
                  duration: 5000,
                  isClosable: true,
              })
            return 
        }
        if(!remark){
            toast({
                title:"you need to enter your remark",
                // description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
                  status: "error",
                  position: "top",
                  duration: 5000,
                  isClosable: true,
              })
            return 
        }
        const data:any ={
            // "team_lead_approve_status":value,
            "leave_application_id":leave_application_id,
            'remark':remark
        }
        
        let url:string=`client/${org_name}/`

        if(TypeVerifierUserChecker(['team_lead'],'client_tokens')){
            data['team_lead_approve_status']=value
            url =url+'leave-management/team-lead-review-leave-application/'
        }else{
            data['hr_admin_approve_status']=value
            url =url+'leave-management/hr-leave-management/hr_review_applications/'
        }
        setLoading(true)
        try {
            const resp = await axios.post(url,data)
            console.log({resp})
            if (resp.data.status===200){
                toast({
                    title:"Application Has been Reviewed Successfully",
                    // description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
                      status: "success",
                      position: "top",
                      duration: 5000,
                      isClosable: true,
                    })
                    setLoading(false)
                  setTimeout(()=>{
                    window.location.reload()
                  },2000)
            }

        } catch (err:any) {
            console.log({err})
            setLoading(false)

            toast({
                title:"Some Error Occured, please login again",
                // description:"Your File Size should be mininum of 500kb and maximun should be 600kb",
                  status: "error",
                  position: "top",
                  duration: 5000,
                  isClosable: true,
              })
        }
    }
    
    return (
        <div>   

<MenuItem 

isDisabled={
    //we onky allow team leand and admin_hr to access this modal
    TypeVerifierUserChecker(['admin_hr','team_lead'],'client_tokens')?false:true
}
      onClick={onOpen}>Review Leave Application</MenuItem>
            

            <Modal onClose={onClose} size="sm" isOpen={isOpen} isCentered>
                <Text fontWeight="semibold" color="secondary.900" mb="4">
                Review Leave Application
                </Text>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>
                <Flex my="3" ml="0">
                <Image src={bagIcon} ml={2} />
                <Box ml={2}>
                <Text as="h1" fontWeight="bold">
                Review Leave Application
                </Text>
                <Text as="h2" fontSize="md" color="gray.600">
                {/* Start to su up your organisation structure here */}
                </Text>
                </Box>
                </Flex>
                </ModalHeader>
          <ModalCloseButton size="xs" />


          <ModalBody>
            <form  id="submit-review"
            //  onSubmit={onSubmit}
            >

                <FormLabel  mb="3" fontSize="xs" htmlFor={'leave_type'} fontWeight="semibold">
                Leave Status
                </FormLabel>
                    <Select  mb="3" placeholder='Leave Type'
                    // {...register('leave_choice')}
                    onChange={(e)=>setValue(e.target.value)}
                    >
                        <option value='approved'>approved</option>
                        <option value='disapproved'>disapproved</option>
                        <option value='request_a_new_date'>request a new date</option>
                    </Select>

                    <br />
                    <Textarea value={remark} onChange={(e)=>setRemark(e.target.value)} placeholder='Enter your remark'>

                    </Textarea>

            </form>
          </ModalBody>
            <ModalFooter>
                <Flex width={"100%"}  justifyContent={"space-between"}>
                    <Button
                    type="submit"
                    // form="rate-task"
                    variant="primary"
                    w="full"
                    isLoading={loading}
                    loadingText="Submitting"
                    marginRight={"10px"}
                    onClick={(e)=>onSubmit()}
                    >
                    Submit
                    </Button>
                </Flex>
            </ModalFooter>
         </ModalContent>

            </Modal>
        </div>
    )
}


export default SubmitReviewModal