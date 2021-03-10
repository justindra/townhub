import React from 'react';
import {
  AppState,
  Auth0Provider,
  withAuthenticationRequired,
} from '@auth0/auth0-react';
import {
  Route,
  RouteProps,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { LoadingPage } from '../../components';
import { AdminPageLayout } from './layout';
import { Town } from '@townhub-libs/towns';
import { VendorListPage } from './vendor-list';

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || '';
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || '';

const ProtectedRoute: React.FC<RouteProps> = ({ component, ...args }) => (
  <Route
    component={
      component &&
      withAuthenticationRequired(component, {
        onRedirecting: () => <LoadingPage />,
      })
    }
    {...args}
  />
);

const AdminRoot: React.FC<{ town: Town }> = ({ town }) => {
  const history = useHistory();
  const { path } = useRouteMatch();

  const onRedirectCallback = (appState: AppState) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || `${path}/login`);
  };

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.href}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}>
      <AdminPageLayout town={town}>
        <Switch>
          <ProtectedRoute path={path} exact component={VendorListPage} />
        </Switch>
      </AdminPageLayout>
    </Auth0Provider>
  );
};

export default AdminRoot;
