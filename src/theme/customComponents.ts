import { darken } from '@chakra-ui/theme-tools';
export const ButtonStyles = {
  baseStyle: {},
  sizes: {},
  variants: {
    primary: {
      bg: '#0B3178',
      color: '#FFFFFF',
      _hover: {
        bg: darken('#0B3178', 5),
      },
    },
    secondary: {
      bg: 'rgba(11, 49, 120, 0.05)',
      color: '#0B3178',
    },
    default: {
      bg: '#F2F2F2',
      color: '#0B3178',
      _hover: {
        bg: darken('#F2F2F2', 3),
      },
    },
  },
  defaultProps: {
    variant: 'default',
  },
};
