import { api } from '../utils/api';
import { BrowserOktaAuth } from '@zg-rentals/auth-datarouter';
import { BrowserRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import AppRouter from './AppRouter';

const App = () => {
  return (
    <BrowserRouter basename={__APP_URL_PREFIX__}>
      <BrowserOktaAuth
        authUrl={api.auth.check}
        signInUrl={api.auth.redirect(window.location.href)}
        oneOfRequiredRoles={['admin', 'customerCareAdmin', 'customerCareReadOnly']}
      >
        <AppRouter />
      </BrowserOktaAuth>
    </BrowserRouter>
  );
};

export default hot(App);
