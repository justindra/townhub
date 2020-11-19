import {
  AppBar,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Shuttles, Towns } from '@townhub-libs/core';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoadingPage } from '../components';
import { ShuttleModule } from '../modules';
import { useTownhub } from '../state';

const usePageLayoutStyles = makeStyles((theme) => ({
  appContainer: {
    background: theme.palette.background.default,
  },
  main: {
    height: `calc(var(--vh, 1vh) * 100 - ${theme.spacing(8)}px)`,
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
  },
}));

export const PageRoutes: FC = () => {
  const pageLayoutClasses = usePageLayoutStyles();

  const { Shuttles, Towns } = useTownhub();

  const [town, setTown] = useState<Towns.Town | null>(null);
  const [dailyData, setDailyData] = useState<Shuttles.DailyData | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      // Set the town id from the URL
      const town = await Towns.setTownIdFromUrl();
      // Go get the daily data for the shuttles
      const daily = await Shuttles.getDailyData();
      if (active) {
        setTown(town);
        setDailyData(daily);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Show the loading state when we are still loading the data set
  if (!dailyData || !town) return <LoadingPage />;

  return (
    <Paper className={pageLayoutClasses.appContainer} square>
      <AppBar position='static' color='transparent' elevation={0}>
        <Toolbar>
          <Typography variant='h6'>{town.name}</Typography>
        </Toolbar>
      </AppBar>
      <Paper className={pageLayoutClasses.main} elevation={3} square>
        <Switch>
          <Route path='/shuttles'>
            <ShuttleModule dailyData={dailyData} />
          </Route>
          <Route path='*'>
            <Redirect to='/shuttles' />
          </Route>
        </Switch>
      </Paper>
    </Paper>
  );
};
