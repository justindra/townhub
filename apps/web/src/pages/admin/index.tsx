import React, { useEffect, useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AdminProfile: React.FC = () => {
  const { user, logout, getAccessTokenSilently, getAccessTokenWithPopup, getIdTokenClaims } = useAuth0();

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

const AdminHome: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return isAuthenticated ? (
    <AdminProfile />
  ) : (
    <div>
      {error}
      <button onClick={() => loginWithRedirect()}>
        Log In
      </button>
    </div>
  );
};

export const AdminRoot: React.FC = () => {
  return (
    <Auth0Provider
      domain='townhub.us.auth0.com'
      clientId='TmumMEJoU1ZVKd9D0Rpf5lyLvW0QCxuh'
      redirectUri={window.location.href}
      useRefreshTokens={true}>
      <AdminHome />
    </Auth0Provider>
  );
};
