import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useLoadingPageStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.paper,
    width: '100%',
    height: '100vh',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

export const LoadingPage: React.FC = () => {
  const loadingPageClasses = useLoadingPageStyles();

  return (
    <div className={loadingPageClasses.container}>
      <CircularProgress className={loadingPageClasses.loader} />
    </div>
  );
};
