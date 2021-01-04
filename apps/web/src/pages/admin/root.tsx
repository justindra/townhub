import React, { useEffect, useState } from 'react';
import {
  AppState,
  Auth0Provider,
  useAuth0,
  withAuthenticationRequired,
} from '@auth0/auth0-react';
import {
  Route,
  RouteProps,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import loadable from "@loadable/component";
import { LoadingPage } from '../../components';

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || '';
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || '';

const AdminProfile: React.FC = () => {
  const { user, logout, getIdTokenClaims } = useAuth0();

  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const idToken = await getIdTokenClaims();

        console.log(idToken.__raw);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, []);

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <h3>User Metadata</h3>
      {userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        'No user metadata defined'
      )}
      <button onClick={() => logout({ returnTo: window.location.href })}>
        Logout
      </button>
    </div>
  );
};

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

const AdminRoot: React.FC = () => {
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
      <Switch>
        <ProtectedRoute path={path} exact component={AdminProfile} />
      </Switch>
    </Auth0Provider>
  );
};

export default AdminRoot;