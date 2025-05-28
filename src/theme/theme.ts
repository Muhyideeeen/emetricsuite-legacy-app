// theme.js
import { extendTheme } from '@chakra-ui/react';
import { ButtonStyles as Button } from './customComponents';

const theme = {
  colors: {
    primary: '#0B3178',
    lightblue: 'rgba(11, 49, 120, 0.05)',
    secondary: {
      100: '#FAFAFA',
      200: '#F2F2F2',
      500: '#9CA3AF',
      900: '#4B5563',
    },
  },
  styles: {
    global: {
      body: {
        fontFamily: 'Open Sans, sans-serif',
        heading: 'Open Sans, sans-serif',
        body: 'Open Sans, sans-serif',
        // fontW
      },
    },
  },
  components: {
    Button,
  },
};

export default extendTheme(theme);
