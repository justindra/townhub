import {
  AppState,
  Auth0Provider,
  withAuthenticationRequired,
} from '@auth0/auth0-react';
import { FC } from 'react';
import {
  Route,
  RouteProps,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router';
import { NavLink } from 'react-router-dom';
import { HomePage } from './home';
import { PageLayout } from './layout';
import { LoadingPage } from './loading';
import { ProfilePage } from './profile';

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

export const PageRoutes: FC = () => {
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
      onRedirectCallback={onRedirectCallback}
      cacheLocation='localstorage'>
      <PageLayout>
        <Switch>
          <ProtectedRoute path='/' exact component={HomePage} />
          <ProtectedRoute path='/profile' component={ProfilePage} />
        </Switch>
      </PageLayout>
    </Auth0Provider>
  );
};
