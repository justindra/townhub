import { Town } from '@townhub-libs/towns';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoadingPage } from '../components';
import { useTownhub } from '../state';
import ReactGA from 'react-ga';
import { AdminRoot } from './admin';
import { PublicRoot } from './public';

export const PageRoutes: FC = () => {
  const { Towns } = useTownhub();

  const [town, setTown] = useState<Town | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      // Set the town id from the URL
      const town = await Towns.setTownIdFromUrl();
      if (active) {
        setTown(town);
        ReactGA.set({ town: town?.hid });
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!town) return <LoadingPage />;

  return (
    <Switch>
      <Route path='/admin'>
        <AdminRoot town={town} />
      </Route>
      <Route path='*'>
        <PublicRoot town={town} />
      </Route>
    </Switch>
  );
};
