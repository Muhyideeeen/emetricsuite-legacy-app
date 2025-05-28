import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tag,
    Box,
    Text,
    Grid,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    IconButton,Stack,Flex, useToast,
  } from '@chakra-ui/react';
  import CardList from '../../components/CardList';
  import { HiDotsHorizontal } from 'react-icons/hi';
  import { Link as ReactRouterLink } from 'react-router-dom';
  import SelectAsyncPaginate from "../../components/AsyncSelect";
  import { getLoggedin_userEmail } from '../../services/auth.service';
import {useState,useEffect} from "react"
import TaskListTable from './TaskComponent/TaskListTable';
import axios from '../../services/api';

  const cardDetails = [
    {
      title: 'Team Pending Task',
      value: 10,
      rate: 4,
    },
    {
      title: 'Team Overdue Task',
      value: 15,
      rate: -12,
    },
    {
      title: 'Team Completed Task',
      value: 10,
      rate: 4,
    },
    {
      title: 'Team Work In Progress Task',
      value: 10,
      rate: 4,
    },
  ];
  
  const TeamTask = () => {
      const org_name=localStorage.getItem('current_organization_short_name')
      const [team_member,setTeam_member] = useState<any>(null);
      const toast = useToast();
      const [loggedInEmployee,setLoggedInEmployee] = useState<any>(null)

      const get_employee_careerpath = async( )=>{
        //
        let loggedInuserEmail = getLoggedin_userEmail('client_tokens')

        try{
          const resp:any= await axios.get(`client/${org_name}/employee/?user__email=${loggedInuserEmail}`)

          if(resp.data.data){
            const employee  =resp.data.data[0]
            if(employee){
              let data:any ={'my_level_id':employee.career_path?employee.career_path.level:null,}
              if(employee.corporate_level){
                data['team_id_filter']=`corporate_level__uuid=${employee.corporate_level.uuid}`
              }
              if(employee.department){
                data['team_id_filter']=`department__uuid=${employee.department.uuid}`
              }
              if(employee.division){
                data['team_id_filter']=`division__uuid=${employee.division.uuid}`
              }
              if(employee.group){
                data['team_id_filter']=`group__uuid=${employee.group.uuid}`
              }
              if(employee.unit){
                data['team_id_filter']=`unit__uuid=${employee.unit.uuid}`

              }
              setLoggedInEmployee(data)
              localStorage.setItem('my_level_id_and_employee_id',JSON.stringify(data))
            }
            else{
              setLoggedInEmployee(null)
              toast({
                title:"Please ask your admin HR to asssign career path to you",
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
              }) 
            }
          }
        }
        catch(err:any){
          //
          toast({
            title:"Please relogin we could not proccess your info",
            status: "error",
            position: "top",
            duration: 3000,
            isClosable: true,
          }) 

        }
      }



      useEffect(()=>{
        const my_level_id_and_employee_id:any= localStorage.getItem('my_level_id_and_employee_id') 
        if(my_level_id_and_employee_id){
          setLoggedInEmployee(JSON.parse(my_level_id_and_employee_id))
        }else{
          get_employee_careerpath()
        }
      },[])
    return (
      <Box>


{/* <Grid gap="2" mb="6" templateColumns="repeat(4, 1fr)">
          <CardList cardDetails={cardDetails} />
        </Grid> */}
        <Flex justifyContent="space-between" alignItems="center" mb="4">

        <Text as="small" display="inline-block" fontWeight="semibold" mb="2">
          {/* Showing 10 of 40 Team Taskss */}
        </Text>
  





        <Stack direction="row" spacing={4}>
                    {/* <CustomDrawer
                      showModalBtnText="Add Task"
                      showModalBtnVariant="primary"
                      showModalBtnColor="white"
                      leftIcon={<HiOutlinePlus />}
                      drawerSize="sm"
                    >
                      <AddTask />
                    </CustomDrawer> */} 
                    {org_name!==null?
                    <SelectAsyncPaginate
                    url={`/client/${org_name}/employee/?upline__email=${getLoggedin_userEmail()}`}
                    value={team_member}
                    onChange={(value)=>{
                      // console.log(value.user.email,">>>>>")
                      setLoggedInEmployee(null)
                    return   setTeam_member(value)
                    
                    }}
                    SelectLabel={(option:any)=>`${option.user.first_name} ${option.user.last_name}`}
                    SelectValue={(option:any)=> {
                      return `${option.user.email}`
                    } }
                    placeholder={"Get Your Team Member Task"}
                    />
                    :<p>You need to refresh or relogin into this page</p>
                    }
                  </Stack>
                    
                 
                    


        </Flex>

        <Box>
                    {
                loggedInEmployee&&
                <TaskListTable 
                owner_email={''}
                admin_lookUp={`&${loggedInEmployee.team_id_filter}`}
                useLookup={true}
                />
              }

{
                team_member&&
                <TaskListTable 
                owner_email={team_member.user.email}
                // admin_lookUp={`&${team_member.us}`}
                useLookup={false}
                />
              }
                    </Box>


      </Box>
    );
  };
  
  export default TeamTask;

  


const marko= `

<Table variant="unstyled" borderRadius="lg" d="block" overflowX="auto">
<Thead bg="secondary.200">
  <Tr>
    <Th fontWeight="bold" px="3">
      Task Name
    </Th>
    <Th fontWeight="bold" px="3">
      TAT Target End Time
    </Th>
    <Th fontWeight="bold" px="3">
      TAT Target Points
    </Th>
    <Th fontWeight="bold" px="3">
      Qly Target Brief
    </Th>
    <Th fontWeight="bold" px="3">
      Qly Target Points
    </Th>
    <Th fontWeight="bold" px="3">
      Qty Target Units
    </Th>
    <Th fontWeight="bold" px="3">
      Qty Target Points
    </Th>
    <Th fontWeight="bold" px="3">
      Total Target
    </Th>
    <Th fontWeight="bold" px="3">
      My Cont Target
    </Th>
    <Th fontWeight="bold" px="3">
      Team Cont Target
    </Th>
    <Th fontWeight="bold" px="3">
      Task Status
    </Th>
    <Th></Th>
  </Tr>
</Thead>
<Tbody>
  {[...new Array(3)].map((item, index) => (
    <Tr key={index}>
      <Td px="3">
        <Text fontSize="sm" mb="2">
          Social Media Platform Content - SBU 1
        </Text>
      </Td>
      <Td fontSize="sm" px="3">
        <Text>05/05/21</Text>
        <Text>12:00</Text>
      </Td>
      <Td fontSize="sm" px="3">
        25
      </Td>
      <Td fontSize="sm" px="3">
        Download Brief
      </Td>
      <Td fontSize="sm" px="3">
        1
      </Td>
      <Td fontSize="sm" px="3">
        1.00
      </Td>
      <Td fontSize="sm" px="3">
        2
      </Td>
      <Td fontSize="sm" px="3">
        1
      </Td>
      <Td fontSize="sm" px="3">
        6
      </Td>
      <Td fontSize="sm" px="3">
        25
      </Td>
      <Td fontSize="sm" px="3">
        <Tag
          colorScheme="yellow"
          color="yellow.700"
          size="sm"
          fontWeight="semibold"
        >
          Pending
        </Tag>
      </Td>
      <Td cursor="pointer" px="3">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HiDotsHorizontal />}
            variant="outline"
          />
          <MenuList>
            <MenuItem>View</MenuItem>
            <MenuItem isDisabled>Submit</MenuItem>
            <MenuItem to="/dashboard/rate-task" as={ReactRouterLink}>
              Rate
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  ))}
</Tbody>
</Table>
`