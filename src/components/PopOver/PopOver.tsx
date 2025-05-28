import { useEffect,useState } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    // PopoverAnchor,
    Box,
    Button,
    Portal,
    Text,
  } from '@chakra-ui/react'


type Prop = React.PropsWithChildren<{
    header?:string;
    footer?:string;
    triggericon?:React.ReactElement;
    triggerText?:string;
}>

const CustomPopOver = ({children,header,footer,triggerText,triggericon}:Prop):React.ReactElement=>{



    return (
        <Box>
            <Popover>
             {/* @ts-ignore */}
            <PopoverTrigger>
             {/* @ts-ignore */}
                <Button>
                    {triggericon} <Text> {triggerText}</Text>
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                <PopoverArrow />
                {header &&<PopoverHeader>{header}</PopoverHeader>}
                {/* <PopoverCloseButton /> */}
                <PopoverBody>
                    {children}
                </PopoverBody>
                {footer && <PopoverFooter>{footer}</PopoverFooter>}
                </PopoverContent>
            </Portal>
            </Popover>
        </Box>
    )
}
export default CustomPopOver