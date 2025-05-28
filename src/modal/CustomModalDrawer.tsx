import {  Drawer,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
} from '@chakra-ui/react';


type ShowModalBtnVariant = 'default' | 'solid' | 'outline' | 'primary' | 'ghost';

export interface CustomModalDrawerProps{
    showModalBtnText: string;
    showModalBtnColor?: string;
    showModalBtnVariant?: ShowModalBtnVariant; 
    children: JSX.Element;
    leftIcon?: JSX.Element;
  }


//this Component helps to Open A Modal Easyliy
// const CustomModalDrawer:React.FC<CustomModalDrawerProps> = ({
//   children,
//   showModalBtnText,
//   showModalBtnColor,
//   showModalBtnVariant = 'default',
//   leftIcon,
// })=>{
//   const { isOpen, onOpen, onClose } = useDisclosure();



// }