import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

const NavItem: FC<NavLinkProps> = ({ isActive, ...props }) => {
  return (
    <NavLink
      className='max-w-full flex rounded-xl items-center py-2 px-4 mx-4 my-1 transition-colors duration-300 justify-start text-gray-300 hover:bg-blue-400 hover:bg-opacity-25'
      activeClassName='font-bold bg-blue-600 hover:bg-blue-700 hover:bg-opacity-100'
      {...props}
    />
  );
};

export const PageLayout: FC = ({ children }) => {
  return (
    <div className='h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex'>
      <div className='h-screen hidden lg:block relative w-48'>
        <div className='flex items-center justify-center p-4 text-lg font-bold uppercase'>
          Townhub
        </div>
        <nav className='mt-2'>
          <NavItem to='/' exact>
            Home
          </NavItem>
          <NavItem to='/profile'>Profile</NavItem>
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
};
