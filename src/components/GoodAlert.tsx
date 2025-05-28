import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,Button
  } from '@chakra-ui/react';
import {useState,useRef} from 'react'
interface GoodAlertType{
title:string;
details:string;
closeText:string;
submitText:string;
onCloseFunc:()=>void;
onSubmitFunc:()=>void;
}


const GoodAlert:React.FC<GoodAlertType> = ({
    title,details,closeText,submitText,
    onCloseFunc,
    onSubmitFunc
})=>{

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<any>();


    return (
        <>
          <AlertDialog
           motionPreset='slideInBottom'
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {details}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={()=>{
                
                onCloseFunc()
                onClose()
              }}>
              {closeText}
              </Button>
              <Button colorScheme='red' onClick={()=>{
                  onSubmitFunc()
                  onClose()
                }} ml={3}>
                  {submitText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

        </>
    )
}


export default GoodAlert