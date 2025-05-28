import {
    Box, FormControl, FormLabel, Select
  } from "@chakra-ui/react";
import { useState } from "react";
import SelectAsyncPaginate from "../../components/AsyncSelect";


type levelType = 'corporate-level'|'divisional-level'|'group-level'|'departmental-level'|'unit-level'
type StructurePickType = {
    handleStructureLevelChange: (level:string)=>void;
    handleLevelChange: (level_info:any,selectedLevel?:string)=>void;
}
const StructurePick=({handleStructureLevelChange,handleLevelChange}:StructurePickType):React.ReactElement=>{
    //this is a custom component that allows picking structure /filtering sturture easy
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const org_name = localStorage.getItem("current_organization_short_name"); 
    const [currentCoprate,setCurrentCoprate]= useState<{ name: string; uuid: string }>();


    return(
        <Box>
            <FormControl mb="5">
            <FormLabel htmlFor="structure_level" fontSize="xs" fontWeight="semibold">
              Pick a Structure Level
            </FormLabel>
            <Select
              placeholder="Select Structure Level"
              variant="filled"
              bg="secondary.200"
              color="gray.400"
              id="structure_level"
              // value={}
              // {...register('level')}
              onChange={(e) => {
              setSelectedLevel(e.target.value)
              handleStructureLevelChange(e.target.value)
              }}
            >
              <option value="corporate-level">Corporate</option>
              <option value="divisional-level">Division</option>
              <option value="group-level">Group</option>
              <option value="departmental-level">Department</option>
              <option value="unit-level">Unit</option>
            </Select>
          </FormControl>
          <FormControl mb="5">
            <FormLabel htmlFor="level_id" fontSize="xs" fontWeight="semibold">
              Level Name
            </FormLabel>
            <SelectAsyncPaginate
              //?me=1 added this dummy params so i can tag on &page=1 dynamically
          key={selectedLevel}
          url={`/organization/setup/${selectedLevel}/list/${org_name}/?me=1`}
          value={currentCoprate}
          onChange={(value:any)=>{
            
            handleLevelChange(value,selectedLevel)
          return   setCurrentCoprate(value)
          
          }}
          SelectLabel={(option:any)=>`${option.name}`}
          SelectValue={(option:any)=> {
            return `${option.uuid}`
          } }
          placeholder={""}
              
              />
          </FormControl>

        </Box>
    )
}


export default StructurePick