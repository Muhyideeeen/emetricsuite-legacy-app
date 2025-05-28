import {
    Grid,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
    Text,Flex,
    Button,useDisclosure, useToast
  } from '@chakra-ui/react';
  import CardList from '../../components/CardList';
import {RiSendPlaneFill,RiDeleteBinLine,} from 'react-icons/ri';
import SubmitTaskModal from '../../modal/task/submitTaskModal';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
  import {selectTaskSubmission} from "../../redux/TaskSubmission/TaskSubmissionSlice"
import {getTaskSubmission} from "../../redux/TaskSubmission/TaskSubmissionApi"
import { useErrorHandler } from "react-error-boundary";
import moment from 'moment';
import { createDanloadAbleFile } from '../../services/extraFunctions';
import Preloader from '../../components/Preloader';
const cardDetails = [
    {
      title: 'Overall Individual performance',
      value: 10,
      rate: 4,
    },
    {
      title: 'Individual performance Score',
      value: 15,
      rate: -12,
    },
    {
      title: 'Individual Contribution Score',
      value: 10,
      rate: 4,
    },
    {
      title: 'Individual Task Turn-around Time',
      value: 10,
      rate: 4,
    },
  ];
  /*
  
  if we dont have any task submmision when we get back the list


  we get the data on load of the page once we get the status succeeded and it still empty
  all we do is show the Modal Submit a task with the name
  */
  const SubmitMyTaskTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {is_taskowner, task_id ,rework_limit, task_type,task_name } = useParams<{is_taskowner:'true'|'false',task_id:string;task_type:string;task_name:string;rework_limit:string;}>();
  const [taskType,setTaskType] = useState<string>(task_type)
  const [taskId,setTaskId] = useState<string>(task_id)
   const handleError = useErrorHandler()
   console.log({is_taskowner})
    const toast = useToast()
  const dispatch=useAppDispatch();

    const  {
      status,tasksSubmmission,errorMessage

    } = useAppSelector(selectTaskSubmission)

    
    useEffect(()=>{

      let org_name = localStorage.getItem('current_organization_short_name')
      if(org_name){
        
        dispatch(getTaskSubmission({org_name,handleError,"task_id":taskId}))
      }
      
 
      
    },[])


    useEffect(()=>{
      // if(status==="succeeded" && tasksSubmmission.length==0){
      //   onOpen()

      //   console.log("Hey i got this if statement")

      // }

      // if(status==="succeeded" && tasksSubmmission.length==0){
      //   toast({
      //     title: "You have not submmited any task!",
      //     status: "success",
      //     position: "top",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }

    if(status==="succeeded"){
        toast({
          title: "Successs",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      }


      if(status=="failed"){
        if(errorMessage){
          if(errorMessage instanceof Array){
            for(let i of errorMessage){
              toast({
                description: i?.message,
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
              });
             }
          }
          else{
            
              toast({
                description:errorMessage,
                status: "error",
                position: "top",
                duration: 5000,
                isClosable: true,
              });
             
          }
        
             
        }
       
      }
    },[status])
    return (
      <>
        {/* <Grid gap="4" mb="6" templateColumns="repeat(4, 1fr)">
          <CardList cardDetails={cardDetails} />
        </Grid>
   */}
        <Box as="section">
          {/* <button onClick={(e)=>onOpen()}>Hello world</button> */}

{status==="loading"?<Preloader />:""}

          <Flex justifyContent="right" alignItems="center" mb="4">
            {/* if this is the owner of the task he can submit else he cant*/}
            {
              is_taskowner==='true'?
              <Button size="sm"
              onClick={onOpen}
              leftIcon={<RiSendPlaneFill />}
              variant="primary"
              // disabled={item?.used_submission?false:true}
              >
              Submit Task
      </Button>:''
            }

          <SubmitTaskModal
          
              isOpen={isOpen} 
              onOpen={onOpen}
              onClose={onClose}

              task_id ={taskId}
                task_type={taskType}
              />
            </Flex>
          <Table variant="striped" borderRadius="lg" d="block" overflowX="auto">
     {/* <Button onClick={onOpen}>submit task</Button> */}

            <Thead bg="gray.200">
              <Tr style={{"textTransform":"capitalize"}}>
                <Th fontWeight="bold" px="3">
                  Task Name(Subbmission) 
                </Th>
                <Th fontWeight="bold" px="3">
                  Task Type
                </Th>
                <Th fontWeight="bold" px="3">
                  Rework Limits
                </Th>
                <Th fontWeight="bold" px="3">
                 View Uploaded Report
                </Th>
                
                  {/* Enter Qty Achieved */}
                {
                  ((taskType=='quantitative') || (taskType=='quantitative_and_qualitative'))? <Th fontWeight="bold" px="3">Qty Achieved </Th>:""
                }
                  {/* taskType */}
               
                <Th fontWeight="bold" px="3">
                  Submission Time Track
                </Th>
                {/* <Th fontWeight="bold" px="3">
                  Remark
                </Th> */}
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasksSubmmission.map((item, index) => (
                <Tr key={index} style={{"textTransform":"capitalize"}}>
                  <Td px="3">
                    <Text fontSize="sm" mb="2">
                      {task_name}
                    </Text>
                  </Td>
                  <Td fontSize="sm" px="3">
                    <Tag size="sm" fontWeight="semibold" color="primary">
                     {taskType}
                    </Tag>
                  </Td>
                  <Td fontSize="sm" px="3">
                    {rework_limit}
                  </Td>
                  <Td fontSize="sm" px="3">
                   <a 
                   href={item.submission?item.submission:"#"}
                   style={{
                     "color":item.submission?"blue":"gray",
                     cursor:"pointer"
                   }}
                   rel="nofollow noreferrer" download
                   target={'_blank'}
                   >
                    View Report
                    <br />

                    {/* {item.submission} */}
                   </a>
                    {/* Upload Report */}
                  </Td>
                  {
                     ((taskType=='quantitative') || (taskType=='quantitative_and_qualitative'))?
                  <Td fontSize="sm" px="3">
                      {item.quantity_target_unit_achieved}
                  </Td>:""
                  }

                  <Td fontSize="sm" px="3">
                    <Text>{
                    moment(item.created).format("YYYY-MM-DD")
                    }</Text>
                    {/* <Text>12:00</Text> */}
                  </Td>
                  {/* <Td fontSize="sm" px="3">
                    <Button textDecoration="underline" size="sm" variant="ghost">Input Remark</Button>
                  </Td> */}
                  {/* <Td fontSize="sm" px="3">
                    ...
                  </Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </>
    );
  };
  
  export default SubmitMyTaskTable;
  