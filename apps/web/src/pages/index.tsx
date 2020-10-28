import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ShuttleModule } from '../modules';

export const PageRoutes: FC = () => {
  return (
    <Switch>
      <Route path='/shuttles' component={ShuttleModule} />
      <Route path='*'>
        <Redirect to='/shuttles' />
      </Route>
    </Switch>
  );
};
