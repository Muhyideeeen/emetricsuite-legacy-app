import { ColorModeScript } from '@chakra-ui/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme/theme';
import setupInterceptors from './services/setupInterceptors'
import * as serviceWorker from './serviceWorker';

import '@fontsource/inter/400.css';
import '@fontsource/inter/900.css';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://881b8222d37948ee9735f70233b7359d@o930234.ingest.sentry.io/6170333",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <Router>
          <App />
        </Router>
      </ChakraProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

setupInterceptors(store);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
