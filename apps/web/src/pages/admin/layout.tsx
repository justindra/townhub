import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Avatar,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Town } from '@townhub-libs/towns';
import React, { useEffect, useState } from 'react';
import { useTownhub } from '../../state';

const CurrentUserAvatar: React.FC = () => {
  const {
    isLoading,
    isAuthenticated,
    user,
    logout,
    getIdTokenClaims,
  } = useAuth0();
  const { updateJWT } = useTownhub();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const idToken = await getIdTokenClaims();
        updateJWT(idToken.__raw);
      } catch (e) {
        console.log(e.message);
      }
    };

    if (isAuthenticated) {
      getUserMetadata();
    }
  }, [isAuthenticated]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    handleClose();
  };

  if (isLoading) return null;

  if (!isAuthenticated) return <Button color='inherit'>Login</Button>;

  return (
    <div>
      <Avatar alt={user.name} src={user.picture} onClick={handleClick} />
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        getContentAnchorEl={null}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

const usePageLayoutStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
  },
  container: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: theme.spacing(2),
  },
}));

export const AdminPageLayout: React.FC<{ town: Town }> = ({
  town,
  children,
}) => {
  const classes = usePageLayoutStyles();
  return (
    <div className={classes.container}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Townhub | {town.name}
          </Typography>
          <CurrentUserAvatar />
        </Toolbar>
      </AppBar>
      <div className={classes.main}>{children}</div>
    </div>
  );
};
