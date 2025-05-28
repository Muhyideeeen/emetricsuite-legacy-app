

import { Box } from '@chakra-ui/react'
import React from 'react'
import TenantManagementSidebar from './SideBar';

const TenantManageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div >
      <Box w="230px" position="fixed" overflow="hidden" top="0" left="0" px="4" pt="8" h="full" bg="secondary.100">
        <TenantManagementSidebar/>
      </Box>
      <Box ml="230px" px={5}>
        {children}
      </Box>
    </div>
  )
}

export default TenantManageLayout;
