import { Badge, Box } from '@chakra-ui/react';
import {HiArrowDown, HiArrowUp} from 'react-icons/hi'

interface RateBadgeProps {
  children: React.ReactNode;
  isIncreased?: boolean;
  isDecreased?: boolean;
}
const RateBadge: React.FC<RateBadgeProps> = ({
  children,
  isIncreased,
  isDecreased,
}) => {
  if (isIncreased) {
    return <Badge display="flex" alignItems="center" px="2" py="0.5" fontSize="small" rounded="full" variant="subtle" bg="green.100" color="green.500"><HiArrowUp /><Box as="span" ml="3">{children}</Box>%</Badge>;
  } else if (isDecreased) {
    return <Badge display="flex" alignItems="center"  px="2" py="0.5"  fontSize="small" rounded="full" variant="subtle"  bg="red.100" color="red.500"><HiArrowDown /><Box as="span" ml="3">{children}</Box>%</Badge>;
  }
  return <Badge>{children}%</Badge>;
};

export default RateBadge;
