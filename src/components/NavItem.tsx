import {
    Box,
    ListIcon,
    ListItem,
    Flex
  } from '@chakra-ui/react';
  import { NavLink } from 'react-router-dom';

const NavItem = ({
    to,
    icon,
    target,
    children,
    isDisable=false
  }: {
    to: string | object;
    icon: any;
    target?: string;
    children: React.ReactNode;
    isDisable?:boolean;
  }) => (
    <ListItem bg="transparent" py="1" color="primary">
      <NavLink
        to={to}
        target={target}
        activeStyle={{
          fontWeight: 'bold',
          backgroundColor: '#0B3178',
          color: '#FFF',
        }}
        style={{ padding: '5px', display: 'block', borderRadius: 5 }}
        exact
      
      >
        <Flex>
        <ListIcon as={icon} fontSize="xl" />
        <Box fontSize="sm" >
          {children}
        </Box>
        </Flex>
      </NavLink>
    </ListItem>
  );

  export default NavItem;