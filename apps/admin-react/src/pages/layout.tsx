import { FC } from 'react';
import { NavLink } from 'react-router-dom';

export const PageLayout: FC = ({ children }) => {
  return (
    <div>
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
