import {useState,useCallback, useEffect} from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './CropEasy'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Lorem,Button, useToast, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, FormLabel, Flex
  } from '@chakra-ui/react'
// const dogImg =
//   'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'


  const CropImage = ({setValue,fieldName}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null) 
    const [Imageurl,setImageurl] =useState(null);
    const toast = useToast()
    // const [dogImg,]
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
    }, [])
    const [isOpen,setIsOpen] = useState(false)
  
    const showCroppedImage = useCallback(async () => {
        if(!Imageurl) return
      try {
        const croppedImage = await getCroppedImg(
            Imageurl,
          croppedAreaPixels,
          rotation
        )
        if(setValue){
        console.log('donee',croppedImage.file)

            setValue(fieldName,croppedImage.file)
            toast({
                title: 'Image Cropped',
                status: "success",
                position: "top",
                duration: 3000,
                isClosable: true,
              });
        }

        setCroppedImage(croppedImage)
      } catch (e) {
        console.error(e)
      }
    }, [croppedAreaPixels, rotation])
  
    const onClose = useCallback(() => {
    //   setCroppedImage(null)
      setIsOpen(false)
    }, [])
    
    // useEffect(()=>{

    // },[Imageurl])

    const handleChange  =(e)=>{
        
        const file = e.target.files[0];
        if(file){
            // set
            setIsOpen(true)
            setImageurl(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage= (e)=>{
        setImageurl(false)
        setIsOpen(false)

    }
    return (
     <>

<Modal isOpen={isOpen} onClose={onClose} 

>
        <ModalOverlay />
        <ModalContent style={{'height':'500px'}}>
          <ModalHeader>Crop Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody  style={{'position':'relative','width':'100%',}}>

          {Imageurl && 
        
        <div>
        <div 
        // className={classes.cropContainer}
        style={{
            'width':'400px',
            'height':'300px','position':'absolute'
        }}
        >
          <Cropper
            image={Imageurl}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            
          />
        </div>
        
        <br />
        <br />
        <div 
        // className={classes.controls}
        >
          <div
        //    className={classes.sliderContainer}
           >
            <h5
    
            >
              Zoom
            </h5>
            <input
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              type={'number'}
            //   aria-labelledby="Zoom"
            //   classes={{ root: classes.slider }}
              onChange={(e, zoom) => {
                console.log(e.target.value)
                setZoom(e.target.value)
              }}
            />
          </div>
          <div 
        //   className={classes.sliderContainer}
          >
            
            <h5>
            Rotation
            </h5>
            {/* <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              classes={{ root: classes.slider }}
              onChange={(e, rotation) => setRotation(rotation)}
            /> */}
            <input type={'number'}
            
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            // classes={{ root: classes.slider }}
            onChange={(e, rotation) => setRotation(rotation)}
            />
          </div>

        </div>
        {/* <ImgDialog  onClose={onClose} /> */}

      </div>
        }




          </ModalBody>

          <ModalFooter style={{'display':'flex','flexDirection':'column'}}>

<Box  style={{'width':'50%','textAlign':'center'}}>
<FormLabel fontSize="xs"fontWeight="semibold">
 Zoom
</FormLabel>
<Slider aria-label='slider-ex-1'
 defaultValue={1}
 min={1}
value={zoom}
// step={1}
onChange={(value)=>{
    setZoom(value)
  }}
 >
  <SliderTrack >
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
</Box>
<br /><br />
<Flex justifyContent={'space-between'} width={'80%'}>
<Button colorScheme='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='blue'
            onClick={showCroppedImage}
            >Save</Button>
</Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>







        {
            Imageurl?
            <Button 
            style={{'fontSize':'1rem','fontWeight':'normal'}}
            onClick={handleRemoveImage}
            >
               cancel upload 
            </Button>
            
            :
            <input type={'file'} onChange={handleChange} />
        }

       
     </>
    )
  }

  export default CropImage