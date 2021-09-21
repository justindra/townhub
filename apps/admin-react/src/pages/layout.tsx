import { useAuth0 } from '@auth0/auth0-react';
import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

const NavItem: FC<NavLinkProps> = ({ isActive, ...props }) => {
  return (
    <NavLink
      className='max-w-full flex rounded-xl items-center py-2 px-4 my-1 transition-colors duration-300 justify-start text-gray-300 hover:bg-blue-400 hover:bg-opacity-25'
      activeClassName='font-bold bg-blue-600 hover:bg-blue-700 hover:bg-opacity-100'
      {...props}
    />
  );
};

const UserProfile: FC = () => {
  const { user } = useAuth0();
  return (
    <img
      src={user.picture}
      alt={user.name}
      className='object-cover rounded-full h-10 w-10 '
    />
  );
};

export const PageLayout: FC = ({ children }) => {
  const { logout } = useAuth0();
  return (
    <div className='h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex'>
      <div className='h-screen hidden lg:flex relative w-48 flex-col'>
        <div className='flex items-center justify-center p-4 py-5 text-lg font-bold uppercase'>
          Townhub
        </div>
        <nav className='mt-2 mx-4 flex-1'>
          <NavItem to='/' exact>
            Home
          </NavItem>
          <NavItem to='/profile'>Profile</NavItem>
        </nav>
        <nav className='my-2 mx-4'>
          <button
            className='w-full text-left rounded-xl items-center py-2 px-4 my-1 transition-colors duration-300 justify-start text-red-500 hover:bg-red-500 hover:bg-opacity-25'
            onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </nav>
      </div>
      <div className='flex-1'>
        <div className='w-full p-4 flex items-center justify-end'>
          <UserProfile />
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
};
