import { useAuth0 } from '@auth0/auth0-react';
import { FC, useEffect, useState } from 'react';

export const ProfilePage: FC = () => {
  const { user, logout, getIdTokenClaims } = useAuth0();

  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const idToken = await getIdTokenClaims();

        // TODO: Save this in Redux-offline?
        console.log(idToken.__raw);
        console.log(idToken);
      } catch (e) {
        console.log((e as Error).message);
      }
    };

    getUserMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
    </div>
  );
};
