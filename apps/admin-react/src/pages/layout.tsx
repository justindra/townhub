import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

const NavItem: FC<NavLinkProps> = ({ isActive, ...props }) => {
  return (
    <NavLink
      className='w-full flex items-center p-4 transition-colors duration-200 justify-start'
      activeClassName='text-blue-400 font-bold bg-gradient-to-r from-white via-transparent dark:from-gray-600 border-l-4 border-blue-600'
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
