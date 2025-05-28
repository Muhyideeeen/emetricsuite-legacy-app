import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Stack,
} from "@chakra-ui/react";

import { HiOutlinePlus } from "react-icons/hi";
import CustomDrawer from "../../drawers/CustomDrawer";
import AddJD from "../../drawers/AddJD";
import axios from "../../services/api";
import { Designation } from "../../redux/designation/DesignationAPI";

const JobDescription = () => {
  const [isLoading, setIsLoading] = useState(false);
  interface JobDescription {
    description: string;
    job_description_id: string;
    designation: Designation;
    upline: {
      user_id: string;
      email: string;
    } | null;
    target_point: string;
    staff_count: 0;
  }
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  const getJobDescriptionList = async () => {
    setIsLoading(true);
    const ORG_NAME = localStorage.getItem("current_organization_short_name");
    try {
      // fetch the job descriptions
      const response = await axios.get(`/client/${ORG_NAME}/job-description/`);
      console.log("JD", response.data);
      setJobDescriptions(response.data.data);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    // getJobDescriptionList()
  }, []);
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text
          as="small"
          display="inline-block"
          fontWeight="semibold"
          alignSelf="flex-end"
        >
          Showing 10 of 40 Job Descriptions
        </Text>

        <Stack direction="row" spacing={4}>
          <CustomDrawer
            showModalBtnText="Add Job Description"
            showModalBtnVariant="primary"
            showModalBtnColor="white"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <AddJD />
          </CustomDrawer>
          <CustomDrawer
            showModalBtnText="Upload Job Description"
            showModalBtnVariant="outline"
            showModalBtnColor="primary"
            leftIcon={<HiOutlinePlus />}
            drawerSize="sm"
          >
            <h1>hELLO</h1>
          </CustomDrawer>
        </Stack>
      </Flex>

      <Table size="sm" variant="striped" borderRadius="lg" overflow="hidden">
        <Thead bg="gray.200">
          <Tr style={{"textTransform":"capitalize"}}>
            <Th py="4">Job Description</Th>
            <Th>Designation</Th>
            <Th>Team</Th>
            <Th>Level</Th>
            <Th>Upline</Th>
            <Th>Staff Count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* if it's fetching show loading icon */}
          {/* else if no description has been created show text */}
          {isLoading ? (
            <Tr>
              <Td>
                <Text>Loading...</Text>
              </Td>
            </Tr>
          ) : [1, 2, 3, 4, 5].length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <Text as="h1" textAlign="center">
                  No Job Descriptions available. Create a Job Description
                </Text>
              </Td>
            </Tr>
          ) : (
            [1, 2, 3, 4, 5].map((jobDescription, index) => (
              <Tr key={index}>
                <Td>
                  <Text mb="2" fontSize="sm">
                    Sell 2 plots of land
                  </Text>
                </Td>
                <Td fontSize="sm">Estate Agent</Td>
                <Td fontSize="sm">Valuation</Td>
                <Td fontSize="sm">5</Td>
                <Td fontSize="sm">johndoe@gmail.com</Td>
                <Td fontSize="sm">15</Td>
                {/* <Td>
                  <Text mb="2" fontSize="sm">
                    {jobDescription.description}
                  </Text>
                </Td>
                <Td fontSize="sm">{jobDescription.designation.name}</Td>
                <Td fontSize="sm">{jobDescription.team.name}</Td>
                <Td fontSize="sm">{jobDescription.grade_level.map(level => level.level_value + ',')}</Td>
                <Td fontSize="sm">{jobDescription.upline?.email || "-"}</Td>
                <Td fontSize="sm">{jobDescription.target_point}</Td> */}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default JobDescription;
