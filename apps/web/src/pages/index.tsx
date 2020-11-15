import { DailyData } from '@townhub-libs/core';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ShuttleModule } from '../modules';
import { useTownhub } from '../state';

export const PageRoutes: FC = () => {
  const { Shuttles, Towns } = useTownhub();

  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  // TODO: Get the list of modules available, if only one then
  // redirect to that module

  useEffect(() => {
    let active = true;
    (async () => {
      // Set the town id from the URL
      await Towns.setTownIdFromUrl();
      // Go get the daily data for the shuttles
      const daily = await Shuttles.getDailyData();

      console.log(daily);
      if (active) {
        setDailyData(daily);
      }
    })();

    return () => {
      active = false;
    }
  }, []);

  // TODO: Add loading state
  if (!dailyData) return (
    <div>Loading....</div>
  )

  return (
    <Switch>
      <Route path='/shuttles'>
        <ShuttleModule dailyData={dailyData} />
      </Route>
      <Route path='*'>
        <Redirect to='/shuttles' />
      </Route>
    </Switch>
  );
};
