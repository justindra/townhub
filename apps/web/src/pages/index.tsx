import {
  AppBar,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Town } from '@townhub-libs/towns';
import { DailyData } from '@townhub-libs/shuttles';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, Redirect, Link, useLocation } from 'react-router-dom';
import { LoadingPage } from '../components';
import { ShuttleModule } from '../modules';
import { useTownhub } from '../state';
import { AboutPage } from './about';
import InfoIcon from '@material-ui/icons/Info';
import ReactGA from 'react-ga';
import { DateTime } from 'luxon';

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
  title: {
    flexGrow: 1,
  },
}));

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const PageRoutes: FC = () => {
  const pageLayoutClasses = usePageLayoutStyles();
  const query = useQuery();

  const { Shuttles, Towns } = useTownhub();

  const [town, setTown] = useState<Town | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      // Set the town id from the URL
      const town = await Towns.setTownIdFromUrl();
      // Go get the daily data for the shuttles
      const date = query.get('date');
      const timestamp = date
        ? DateTime.fromISO(date).startOf('day').valueOf()
        : new Date().valueOf();
      const daily = await Shuttles.getDailyData(timestamp);
      if (active) {
        setTown(town);
        setDailyData(daily);
        ReactGA.set({ town: town?.hid });
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
          <Typography variant='h6' className={pageLayoutClasses.title}>
            {town.name}
          </Typography>
          <IconButton color='inherit' component={Link} to='/about'>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper className={pageLayoutClasses.main} elevation={3} square>
        <Switch>
          <Route path='/shuttles'>
            <ShuttleModule dailyData={dailyData} />
          </Route>
          <Route path='/about'>
            <AboutPage townName={town.name} />
          </Route>
          <Route path='*'>
            <Redirect to='/shuttles' />
          </Route>
        </Switch>
      </Paper>
    </Paper>
  );
};
