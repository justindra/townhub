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
import { Stop, StopSchedule } from '@townhub-libs/core';
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

export const NextShuttleIcon: React.FC<{ minutes: number }> = ({ minutes }) => {
  const styles = useNextShuttleIconStyles();
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
    // .filter((val) => val > nowInMinutes)
    // Sort it
    .sort()
    // Get the top 3
    .slice(0, 3)
    // Format it as a string;
    .map((val) =>
      now
        .startOf('day')
        .plus({
          hours: Math.floor(val / 60),
          minutes: val % 60,
        })
        .toFormat('t')
    );

  return timesList;
};

export const CardSummary: React.FC<{
  stop: StopSchedule | null;
}> = ({ stop }) => {
  const styles = useCardSummaryStyles();
  const [nextTimes, setNextTimes] = useState<string[]>([]);

  useEffect(() => {
    if (stop) {
      const times = getNextThreeTimes(stop);
      setNextTimes(times);
    }
  }, [stop]);

  if (!stop) return null;
  return (
    <Card className={styles.card} elevation={3}>
      <CardHeader
        title={stop.name}
        subheader={stop.description}
        action={<NextShuttleIcon minutes={20} />}
      />
      {
        nextTimes.length ? 
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          {nextTimes.map((val, index) => (
            <Chip key={index} label={val} />
          ))}
        </HorizontalList>
      </CardContent>
      : null
      }
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Button variant='contained'>Directions</Button>
          <Button variant='outlined'>More info</Button>
        </HorizontalList>
      </CardContent>
    </Card>
  );
};
