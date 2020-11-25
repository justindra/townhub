import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Divider,
  ListItem,
  List,
  ListItemText,
  Typography,
  Grow,
  Collapse,
} from '@material-ui/core';
import { Button, HorizontalList } from '../../../../components';
import { Shuttles } from '@townhub-libs/core';
import { NextShuttleIcon } from './next-shuttle-icon';
import { getNextThreeTimes, convertMinutesToTimeFormat } from './helpers';

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

export const CardSummary: React.FC<{
  stop: Shuttles.StopSchedule | null;
}> = ({ stop }) => {
  const styles = useCardSummaryStyles();
  const [nextTimes, setNextTimes] = useState<number[]>([]);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

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
          <Button
            variant='contained'
            onClick={handleOpenDirections}
            color='secondary'>
            Directions
          </Button>
          <Button
            variant='outlined'
            onClick={() => setShowMoreInfo(!showMoreInfo)}>
            {showMoreInfo ? 'Less info' : 'More info'}
          </Button>
        </HorizontalList>
      </CardContent>
      <Collapse in={showMoreInfo}>
        <>
          <Divider />
            <List dense>
              {stop.routes.map((route) => (
                <ListItem key={route.id}>
                  <ListItemText
                    primary={route.name}
                    secondary={
                      <>
                        <Typography variant='body2'  component='span' color='inherit'>
                          {route.description}
                        </Typography>
                        {route.schedule
                          .map(convertMinutesToTimeFormat)
                          .join(' | ')}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
        </>
      </Collapse>
    </Card>
  );
};
