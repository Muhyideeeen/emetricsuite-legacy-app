import { Box } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div >
      <Box w="230px" position="fixed" overflow="hidden" top="0" left="0" px="4" pt="8" h="full" bg="secondary.100">
        <Sidebar />
      </Box>
      <Box ml="230px" px={5}>
        {children}
      </Box>
    </div>
  )
}

export default Layout
