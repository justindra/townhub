import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

export const PageRoutes: FC = () => {
  return (
    <Switch>
      <Route path="/shuttles">
        <h1>Shuttles</h1>
      </Route>
      <Route path="*">
        <Redirect to="/shuttles" />
      </Route>
    </Switch>
  );
};
