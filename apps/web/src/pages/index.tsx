import React, { FC, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ShuttleModule } from '../modules';
import { Shuttles } from '../state';

export const PageRoutes: FC = () => {
  // TODO: Get the HID of the town from the URL and go get the details.
  // If no HID exists, forward to home page to choose Town

  // TODO: Get the list of modules available, if only one then
  // redirect to that module

  useEffect(() => {
    (async () => {
      const daily = await Shuttles.getDailyData();
      
      console.log(daily);
    })();
  }, []);


  return (
    <Switch>
      <Route path='/shuttles' component={ShuttleModule} />
      <Route path='*'>
        <Redirect to='/shuttles' />
      </Route>
    </Switch>
  );
};
