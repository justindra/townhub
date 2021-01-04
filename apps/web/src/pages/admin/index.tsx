import React, { useEffect, useState } from 'react';
import { Auth0Provider, useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Route, RouteProps, Switch, useHistory, useRouteMatch } from 'react-router-dom';

const AdminProfile: React.FC = () => {
  const { user, logout, getIdTokenClaims } = useAuth0();

  const [userMetadata, setUserMetadata] = useState(null);
  
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = 'townhub.us.auth0.com';

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
  <Route component={component && withAuthenticationRequired(component)} {...args} />
);

export const AdminRoot: React.FC = () => {
  const history = useHistory();
  const { path } = useRouteMatch();


  const onRedirectCallback = (appState: any) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || `${path}/login`);
  };

  return (
    <Auth0Provider
      domain='townhub.us.auth0.com'
      clientId='TmumMEJoU1ZVKd9D0Rpf5lyLvW0QCxuh'
      redirectUri={window.location.href}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
      >
        <Switch>
          <ProtectedRoute path={path} exact component={AdminProfile} />
        </Switch>
    </Auth0Provider>
  );
};
