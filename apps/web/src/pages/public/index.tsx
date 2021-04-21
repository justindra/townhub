import {
  AppBar,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Town } from '@townhub-libs/towns';
import React, { FC } from 'react';
import { Switch, Route, Link, useHistory, useLocation } from 'react-router-dom';
import { LoadingPage } from '../../components';
import { ShuttleModule, VendorsModule, VENDORS_ENDPOINT } from '../../modules';
import { AboutPage } from './about';
import InfoIcon from '@material-ui/icons/Info';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { HomePage } from './home';
import { VENDOR_CATEGORIES } from '@townhub-libs/vendors/web';

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

const getModuleComponent = (type: string) => {
  if (type === 'shuttles') return ShuttleModule;
  if (type === 'vendors') return VendorsModule;
  // TODO: Create a Not found component that we can return here
  return () => <div>Not Found</div>;
};

export const PublicRoot: FC<{ town: Town }> = ({ town }) => {
  const location = useLocation();
  const history = useHistory();

  const pageLayoutClasses = usePageLayoutStyles();

  const handleGoBack = () => {
    history.goBack();
  };

  // Show the loading state when we are still loading the data set
  if (!town) return <LoadingPage />;

  const showBackButton = location.pathname !== '/';

  return (
    <Paper className={pageLayoutClasses.appContainer} square>
      <AppBar position='static' color='transparent' elevation={0}>
        <Toolbar>
          {showBackButton && (
            <IconButton color='inherit' onClick={handleGoBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
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
          {[
            VENDOR_CATEGORIES.ARTISAN,
            VENDOR_CATEGORIES.FOOD_DRINKS,
            VENDOR_CATEGORIES.STORE,
          ].map((vendorCategory) => (
            <Route
              key={vendorCategory.name}
              path={`/${VENDORS_ENDPOINT}/:category`}
              component={VendorsModule}
            />
          ))}
          {town.modules.map((module) => {
            const ModuleComponent = getModuleComponent(module.type);
            return (
              <Route
                key={module.slug}
                path={`/${module.slug || module.type}`}
                component={ModuleComponent}
              />
            );
          })}
          <Route path='/about'>
            <AboutPage townName={town.name} />
          </Route>
          <Route path='*' component={HomePage} />
        </Switch>
      </Paper>
    </Paper>
  );
};
