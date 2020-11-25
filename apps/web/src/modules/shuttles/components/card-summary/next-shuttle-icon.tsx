import React, { useEffect, useState } from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';

const useNextShuttleIconStyles = makeStyles((theme) => ({
  surface: {
    textAlign: 'center',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    fontWeight: 600,
    lineHeight: 'initial',
    letterSpacing: '0.05em',
    marginBottom: -theme.spacing(0.5),
  },
  caption: {
    lineHeight: 'initial',
  },
}));

export const NextShuttleIcon: React.FC<{
  nextShuttleMinutes: number | null;
}> = ({ nextShuttleMinutes }) => {
  const styles = useNextShuttleIconStyles();
  const [minutes, setMinutes] = useState<string>('');

  // Update the number of minutes to come
  const setTheMinutes = () => {
    if (!nextShuttleMinutes) return;
    const nextMinutes = DateTime.local()
      .set({
        hour: Math.floor(nextShuttleMinutes / 60),
        minute: nextShuttleMinutes % 60,
      })
      .diffNow('minutes').minutes;
    setMinutes(nextMinutes.toString());
  };

  // Update every 10 seconds to make sure it's pseudo-live
  useEffect(() => {
    const intervalId = setInterval(setTheMinutes, 10 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setTheMinutes();
  }, [nextShuttleMinutes]);

  if (!nextShuttleMinutes) return null;

  return (
    <Paper className={styles.surface} variant='outlined'>
      <Typography className={styles.title} variant='body1'>
        {minutes}
      </Typography>
      <Typography className={styles.caption} variant='caption'>
        min
      </Typography>
    </Paper>
  );
};
