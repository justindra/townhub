import React from 'react';
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

export const CardSummary: React.FC<{
  title: string;
  subtitle: string;
  minutes: number;
}> = ({ title, subtitle, minutes }) => {
  const styles = useCardSummaryStyles();

  return (
    <Card className={styles.card} elevation={3}>
      <CardHeader
        title={title}
        subheader={subtitle}
        action={<NextShuttleIcon minutes={minutes} />}
      />
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Chip label='06:15 am' />
          <Chip label='08:15 am' />
          <Chip label='10:15 am' />
        </HorizontalList>
      </CardContent>
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Button variant='contained'>Directions</Button>
          <Button variant='outlined'>More info</Button>
        </HorizontalList>
      </CardContent>
    </Card>
  );
};
