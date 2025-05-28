import { useState, useEffect } from "react";
import axios from "../../services/api";
import {
  Box,
  Text,
  Button,
  Icon,
  Image,
  Center,
  Link,
  List,
  ListItem,
  ListIcon,
  Grid,
  Divider,
  Select,
  Tabs,TabList,Tab,TabPanel,TabPanels
} from "@chakra-ui/react";
import { Link as ReactLink} from "react-router-dom";
import { useErrorHandler } from "react-error-boundary";
import orgSetupIllustration from "../../assets/images/org-setup.svg";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import AppBar from "../../components/AppBar";

import OrganisationSetupFormModal from "../../components/serviceAccount/OrganisationSetupFormModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getDivisions } from "../../redux/division/divisionAPI";
import { selectDivision } from "../../redux/division/divisionSlice";
import { getGroups } from "../../redux/group/groupAPI";
import { selectGroup } from "../../redux/group/groupSlice";
import { getDepartments } from "../../redux/department/departmentAPI";
import { selectDepartment } from "../../redux/department/departmentSlice";
import { selectCorporate } from "../../redux/corporate/corporateSlice";
import { getCorporates } from "../../redux/corporate/corporateAPI";
import { getUnits } from "../../redux/unit/unitAPI";
import { selectUnit } from "../../redux/unit/unitSlice";
import { getAllEmployees } from "../../redux/employees/employeesAPI";
import CustomDrawer from "../../drawers/CustomDrawer";
import { HiOutlinePlus } from "react-icons/hi";
import UploadOrganizsationSetup from "../../drawers/UploadOrganisation";

const OrgStructure = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orgLevel, setOrgLevel] = useState(0);
  const { corporates} = useAppSelector(selectCorporate);
  const { divisions } = useAppSelector(selectDivision);
  const { groups } = useAppSelector(selectGroup);
  const { departments } = useAppSelector(selectDepartment);
  const { units } = useAppSelector(selectUnit)
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  useEffect(() => {
    async function getAllStructureLevels(org_name:string) {
      return Promise.all([
        dispatch(getCorporates({"ORG_NAME":org_name,handleError})),
        dispatch(getDivisions({"ORG_NAME":org_name,handleError})),
        dispatch(getGroups({"ORG_NAME":org_name,handleError})),
        dispatch(getDepartments({"ORG_NAME":org_name,handleError})),
        dispatch(getUnits(org_name))
        // dispatch(getAllEmployees(org_name))

      ]).then(data => {
        console.log("I found this data", data)
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
        throw err;
      })
    }
    // get organization name first
    const org_name_short = localStorage.getItem("current_organization_short_name");
    if (org_name_short) {
      console.log("Get allStructure",getAllStructureLevels(org_name_short));

    }
  }, []);


 
  return (
    <>
      <AppBar heading="Home" avatar="/logo192.png" imgAlt="Jane Doe's avatar" />


{
  isLoading?<h1>Loading</h1>
  :
<Tabs>
  <TabList>
    <Tab>Setup Organisation</Tab>
    <Tab>View all Structures</Tab>
    {/* <Tab>Three</Tab> */}
  </TabList>

  <TabPanels>
    <TabPanel>
    <Center h="full">
          <Box mt="8" textAlign="center">
            
{/* 
            {
              corporates.length==0?
              <> */}
                    <Image src={orgSetupIllustration} alt="" mb="4" />
                      <Text fontWeight="semibold" color="secondary.900" mb="4">
                    Welcome, click
                    <Link
                      as={ReactLink}
                      color="white"
                      px="2"
                      py="1"
                      borderRadius="md"
                      bgColor="primary"
                      to="/admin/corporate-level"
                    >
                      here
                    </Link>{" "}
                    to Setup your Corporate Level to <br /> Begin
                  </Text>
            {/* </>
            :""
            } */}
            {""}
            {""}
            {/* Record 1:
Name/host: *
Type: MX
Content/points to: mx.ipage.com
TTL: 1 hour (3600)
Priority: 10

Record 2:
Name/host: @
Type: MX
Content/points to: mx.ipage.com
TTL: 1 hour (3600)
Priority: 10 */}


            <CustomDrawer
            showModalBtnText="Upload Organisation Structure"
            showModalBtnVariant="outline"
            // showModalBtnColor="white"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
            >
             <UploadOrganizsationSetup/>

            </CustomDrawer>


<OrganisationSetupFormModal orgLevel={5} />
            {/* <Box mb="5">
              <Select
                placeholder="Select structure type"
                variant="filled"
                bg="secondary.200"
                color="gray.400"
                size="lg"
                onChange={(e) => setOrgLevel(Number(e.target.value))}
              >for now all this wont be avalable
                <option value={5}>Division</option>
               
                <option value={4}>Group</option>
                <option value={3}>Department</option>
                <option value={2}>Unit</option>
              </Select>
            </Box>
            {orgLevel > 0 && <OrganisationSetupFormModal orgLevel={orgLevel} />} */}
          </Box>
        </Center>
    </TabPanel>
    <TabPanel>
    <Box>
          {/* <Link href='/admin/login' >Take me Back</Link> */}
          <List spacing={4} px="10">
            <ListItem mt="4" display="flex" alignItems="center">
              <ListIcon
                as={RiCheckboxBlankCircleFill}
                boxSize={3}
                color="black.500"
              />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/corporates"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="black.500" fontWeight="semibold">
                    Corporate Levels
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                  {corporates.length}{" "}
                      {corporates.length > 1 ? "Levels" : "Level"}
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
            <Divider mb="10" />
            <ListItem display="flex" alignItems="center">
              <ListIcon as={RiCheckboxBlankCircleFill} boxSize={3} color="yellow.500" />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/divisions"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="yellow.500" fontWeight="semibold">
                    Divisions
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                  {divisions.length}{" "}
                      {divisions.length > 1 ? "Levels" : "Level"}
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
            <Divider mb="10" />
            <ListItem display="flex" alignItems="center">
              <ListIcon as={RiCheckboxBlankCircleFill} boxSize={3} color="green.500" />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/groups"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="green.500" fontWeight="semibold">
                    Groups
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                  {groups.length}{" "}
                      {groups.length > 1 ? "Groups" : "Group"}
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
            <Divider mb="10" />
            <ListItem display="flex" alignItems="center">
              <ListIcon as={RiCheckboxBlankCircleFill} boxSize={3} color="rosybrown" />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/departments"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="rosybrown" fontWeight="semibold">
                    Departments
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                    {departments.length} {departments.length > 1 ? "Departments" : "Department"}
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
            <Divider mb="10" />
            <ListItem display="flex" alignItems="center">
              <ListIcon as={RiCheckboxBlankCircleFill} boxSize={3} color="grey" />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/units"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="grey" fontWeight="semibold">
                    Units
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                    {
                      units?
                      <>
                  {units.length} {units.length > 1 ? "Units" : "Unit"}
                      </>:
                      <>
                      0 Unit
                      </>
                    }
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
            <Divider mb="10" />
            <ListItem display="flex" alignItems="center">
              <ListIcon as={RiCheckboxBlankCircleFill} boxSize={3} color="tomato" />
              <Link
                as={ReactLink}
                to="/admin/organization-structure/employees"
                flex="1"
                _hover={{ textDecoration: "none" }}
              >
                <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
                  <Box as="h5" color="tomato" fontWeight="semibold">
                    Employees
                  </Box>
                  <Box as="p" fontWeight="semibold" color="gray.500">
                    0 Employees
                  </Box>
                  <IoIosArrowForward size="20" />
                </Grid>
              </Link>
            </ListItem>
          </List>
        </Box>
    </TabPanel>
 
  </TabPanels>
</Tabs>
}











    
    </>
  );
};

export default OrgStructure;
