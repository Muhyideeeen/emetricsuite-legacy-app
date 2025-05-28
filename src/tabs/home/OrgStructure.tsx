import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListIcon,
  Link,
  Grid,
  Divider,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCorporate } from "../../redux/corporate/corporateSlice";
import { selectDivision } from "../../redux/division/divisionSlice";
import { selectGroup } from "../../redux/group/groupSlice";
import { selectDepartment } from "../../redux/department/departmentSlice";
import { selectUnit } from "../../redux/unit/unitSlice";
import { getCorporates } from "../../redux/corporate/corporateAPI";
import { getDivisions } from "../../redux/division/divisionAPI";
import { getGroups } from "../../redux/group/groupAPI";
import { getDepartments } from "../../redux/department/departmentAPI";
import { getUnits } from "../../redux/unit/unitAPI";
import { getAllEmployees } from "../../redux/employees/employeesAPI";
import { selectEmployees } from "../../redux/employees/employeesSlice";
import { useErrorHandler } from "react-error-boundary";



const OrgStructure = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orgLevel, setOrgLevel] = useState(0);
  const { corporates } = useAppSelector(selectCorporate);
  const { divisions } = useAppSelector(selectDivision);
  const { groups } = useAppSelector(selectGroup);
  const { departments } = useAppSelector(selectDepartment);
  const { units } = useAppSelector(selectUnit);
  const { employees ,count:NumOfEmployees} = useAppSelector(selectEmployees);
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  console.log('did happend')
  useEffect(() => {
    async function getAllStructureLevels(org_name: string) {
      return Promise.all([
        dispatch(getCorporates({ORG_NAME:org_name,handleError})),
        dispatch(getDivisions({"ORG_NAME":org_name,handleError})),
        dispatch(getGroups({"ORG_NAME":org_name,handleError})),
        dispatch(getDepartments({"ORG_NAME":org_name,handleError})),
        dispatch(getUnits(org_name)),
        dispatch(getAllEmployees({org_name,handleError})),
      ])
        .then((data) => {
          console.log("I found this data", data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          throw err;
        });
    }
    // get organization name first
    const org_name = localStorage.getItem("current_organization_short_name");
    if (org_name) {
      getAllStructureLevels(org_name);
    }
  }, []);
  return (
    <Box>
      <List spacing={4} px="10">
        <ListItem mt="4" display="flex" alignItems="center">
          <ListIcon
            as={RiCheckboxBlankCircleFill}
            boxSize={3}
            color="black.500"
          />
          <Link
            as={ReactLink}
            // /organization-structure/corporates
            to="/admin/organization-structure/corporates"
            // to="/admin/organization-structure/corporate-levels"
            flex="1"
            _hover={{ textDecoration: "none" }}
          >
            <Grid flex="1" gridTemplateColumns="1fr 1fr auto">
              <Box as="h5" color="black.500" fontWeight="semibold">
                Corporate Levels
              </Box>
              <Box as="p" fontWeight="semibold" color="gray.500">
                {corporates?.length?corporates.length:0} {corporates?.length > 1 ? "Corporates" : "Corporate"}
              </Box>
              <IoIosArrowForward size="20" />
            </Grid>
          </Link>
        </ListItem>
        <Divider mb="10" />
        <ListItem display="flex" alignItems="center">
          <ListIcon
            as={RiCheckboxBlankCircleFill}
            boxSize={3}
            color="yellow.500"
          />
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
                {divisions?.length?divisions.length:0} {divisions?.length > 1 ? "Divisions" : "Division"}
              </Box>
              <IoIosArrowForward size="20" />
            </Grid>
          </Link>
        </ListItem>
        <Divider mb="10" />
        <ListItem display="flex" alignItems="center">
          <ListIcon
            as={RiCheckboxBlankCircleFill}
            boxSize={3}
            color="green.500"
          />
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
                {groups?.length?groups?.length:0} {groups?.length > 1 ? "Groups" : "Group"}
              </Box>
              <IoIosArrowForward size="20" />
            </Grid>
          </Link>
        </ListItem>
        <Divider mb="10" />
        <ListItem display="flex" alignItems="center">
          <ListIcon
            as={RiCheckboxBlankCircleFill}
            boxSize={3}
            color="rosybrown"
          />
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
                {departments?.length?departments?.length:0}{" "}
                {departments?.length > 1 ? "Departments" : "Department"}
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
                {units?.length?units?.length:0} {units?.length > 1 ? "Units" : "Unit"}
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
                {NumOfEmployees}{" "}
                {employees.length > 1 ? "Employees" : "Employee"}
              </Box>
              <IoIosArrowForward size="20" />
            </Grid>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default OrgStructure;
