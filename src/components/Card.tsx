import { Box, HStack, Spacer, Text } from '@chakra-ui/layout';
import RateBadge from './RateBadge';
import GaugeChart from 'react-gauge-chart';


export interface CardProps {
  title:string;
  value:number;
  rate: number;
  width?:string;
  allow_percent?:boolean;
}

const Card:React.FC<CardProps> = ({title, value, rate,width="50%",allow_percent=true}) => {
  let rateBadge;
  if (rate > 0) {
    rateBadge =  <RateBadge isIncreased>{rate}</RateBadge>
  } else {
    rateBadge = <RateBadge isDecreased>{rate}</RateBadge>
  }
  return (
    <Box as="article" display="flex" flexDirection="column" justifyContent="space-between" border="1px solid" borderColor="gray.300" rounded="md" px="3" py="2" shadow="sm">
      <Text mb="2" fontWeight="semibold" fontSize="small" isTruncated>{title}</Text>
      <Spacer />
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" color="primary">{value?value:"0"} {(allow_percent)?"%":""} </Text>
        <Spacer />
       {/* {rateBadge} */}
       <Box style={{"width":width}}>
       <GaugeChart id="gauge-chart2" 
  nrOfLevels={20} 
  percent={value?(value/100):0} 
  arcWidth={0.2} 
/>
       </Box>
      </HStack>
    </Box>
  );
};

export default Card;
