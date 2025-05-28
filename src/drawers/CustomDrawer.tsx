import { useRef } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

type ShowModalBtnVariant = 'default' | 'solid' | 'outline' | 'primary' | 'ghost';
interface CustomDrawerProps {
  showModalBtnText: string;
  showModalBtnColor?: string;
  showModalBtnVariant?: ShowModalBtnVariant; 
  children: JSX.Element;
  leftIcon?: JSX.Element;
  drawerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  disabled?:boolean
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  children,
  showModalBtnText,
  showModalBtnColor,
  showModalBtnVariant = 'default',
  leftIcon,
  drawerSize = "md",
  disabled=false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef: any = useRef();
  return (
    <>
      <Button
      leftIcon={leftIcon}
        color={showModalBtnColor}
        variant={showModalBtnVariant}
        ref={btnRef}
        mr="2"
        onClick={onOpen}
        size="sm"
        fontWeight="semibold"
        disabled={disabled}
      >
        {showModalBtnText}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={drawerSize}
      >
        <DrawerOverlay>
          <DrawerContent ml={-10}>{children}</DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
