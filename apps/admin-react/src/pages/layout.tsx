import { FC } from 'react';
import { NavLink } from 'react-router-dom';

export const PageLayout: FC = ({ children }) => {
  return (
    <div className='h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50'>
      <NavLink to='/' exact activeStyle={{ background: 'red' }}>
        Home
      </NavLink>
      <NavLink to='/profile' activeStyle={{ background: 'red' }}>
        Profile
      </NavLink>
      {children}
    </div>
  );
};
