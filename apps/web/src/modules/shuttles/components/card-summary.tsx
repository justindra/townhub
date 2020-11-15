import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Chip,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import { Button, HorizontalList } from '../../../components';
import { StopSchedule } from '@townhub-libs/core';
import { DateTime } from 'luxon';

const useCardSummaryStyles = makeStyles((theme) => ({
  card: {
    maxWidth: `calc(100vw - ${theme.spacing(4)}px)`,
    width: theme.spacing(50),
  },
  cardContent: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing(0.5),
  },
}));

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
  }
  
  // Update every 10 seconds to make sure it's pseudo-live
  useEffect(() => {
    const intervalId = setInterval(setTheMinutes, 10 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setTheMinutes();
  }, [nextShuttleMinutes])

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

/** Get the next three scheduled times */
const getNextThreeTimes = (stop: StopSchedule) => {
  const now = DateTime.local();
  const nowInMinutes = now.minute + 60 * now.hour;
  const timesList = Object.values(stop.schedule)
    // Merge into one array
    .reduce((prev, current) => current.concat(...prev), [])
    // Get the ones that are after now
    .filter((val) => val > nowInMinutes)
    // Sort it
    .sort()
    // Get the top 3
    .slice(0, 3);

  return timesList;
};

const convertMinutesToTimeFormat = (val: number) => {
  return DateTime.local()
    .startOf('day')
    .plus({
      hours: Math.floor(val / 60),
      minutes: val % 60,
    })
    .toFormat('t');
};

export const CardSummary: React.FC<{
  stop: StopSchedule | null;
}> = ({ stop }) => {
  const styles = useCardSummaryStyles();
  const [nextTimes, setNextTimes] = useState<number[]>([]);

  useEffect(() => {
    if (stop) {
      const times = getNextThreeTimes(stop);
      setNextTimes(times);
    }
  }, [stop]);

  const handleOpenDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${stop?.point?.lat},${stop?.point?.lng}`,
      '_blank'
    );
  };

  if (!stop) return null;
  return (
    <Card className={styles.card} elevation={3}>
      <CardHeader
        title={stop.name}
        subheader={stop.description}
        action={
          <NextShuttleIcon
            nextShuttleMinutes={
              nextTimes && nextTimes.length ? nextTimes[0] : null
            }
          />
        }
      />
      {nextTimes.length ? (
        <CardContent className={styles.cardContent}>
          <HorizontalList>
            {nextTimes.map((val, index) => (
              <Chip key={index} label={convertMinutesToTimeFormat(val)} />
            ))}
          </HorizontalList>
        </CardContent>
      ) : null}
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Button variant='contained' onClick={handleOpenDirections}>
            Directions
          </Button>
          <Button variant='outlined'>More info</Button>
        </HorizontalList>
      </CardContent>
    </Card>
  );
};
