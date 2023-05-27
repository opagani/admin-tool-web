import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemeConstellation } from '@zillow/constellation';
import { registerBrowserRoutes, RouteList } from '@zg-rentals/route-list';
import pathsManifest from './utils/pathsManifest';
import App from './components/App';
import tracer from './utils/tracer';

tracer.init();

// Create a Query Client
const queryClient = new QueryClient();

if (__DEV__) {
  registerBrowserRoutes(pathsManifest);
}

ReactDOM.render(
  <React.StrictMode>
    <SCThemeProvider theme={ThemeConstellation}>
      <QueryClientProvider client={queryClient}>
        <App />
        {__DEV__ && <RouteList />}
      </QueryClientProvider>
    </SCThemeProvider>
  </React.StrictMode>,
  document.getElementById('app'),
);
