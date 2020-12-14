import {
  AppBar,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Town } from '@townhub-libs/towns';
import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { LoadingPage } from '../components';
import { ShuttleModule, VendorsModule } from '../modules';
import { useTownhub } from '../state';
import { AboutPage } from './about';
import InfoIcon from '@material-ui/icons/Info';
import ReactGA from 'react-ga';
import { AdminRoot } from './admin';

const usePageLayoutStyles = makeStyles((theme) => ({
  appContainer: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: theme.palette.background.default,
  },
  main: {
    height: `calc(100% - ${theme.spacing(7)}px)`,
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
  },
  title: {
    flexGrow: 1,
  },
}));

export const PageRoutes: FC = () => {
  const pageLayoutClasses = usePageLayoutStyles();

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
  }, []);

  // Show the loading state when we are still loading the data set
  if (!town) return <LoadingPage />;

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
          <Route path='/shuttles' component={ShuttleModule} />
          <Route path='/vendors' component={VendorsModule} />
          <Route path='/about'>
            <AboutPage townName={town.name} />
          </Route>
          <Route path='/admin'>
            <AdminRoot />
          </Route>
          <Route path='*'>
            {/* TODO: Have a home page to go to that shows both modules */}
            <Redirect to='/shuttles' />
          </Route>
        </Switch>
      </Paper>
    </Paper>
  );
};
