import React from 'react';
import { makeStyles, Chip, Paper, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import {
  Button,
  HorizontalList,
  
} from '../../components';

const useCardSummaryStyles = makeStyles((theme) => ({
    card: {
      maxWidth: `calc(100vw - ${theme.spacing(2)})`,
      width: theme.spacing(25),
    },
    cardContent: {
      paddingHorizontal: 0,
      paddingVertical: theme.spacing(0.5),
    },
}));

const useNextShuttleIconStyles = makeStyles((theme) => ({
    surface: {
      marginRight: theme.spacing(0.5),
      marginTop: theme.spacing(0.25),
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.text.primary,
      padding: theme.spacing(0.125),
      width: theme.spacing(2.75),
    },
    title: {
      margin: 0,
      padding: 0,
    },
    caption: {
      margin: 0,
      marginTop: theme.spacing(-0.5),
      padding: 0,
    },
  })
);

export const NextShuttleIcon: React.FC<{ minutes: number }> = ({ minutes }) => {
  const styles = useNextShuttleIconStyles();
  return (
    <Paper className={styles.surface}>
      <Typography className={styles.title}>{minutes}</Typography>
      <Typography className={styles.caption}>min</Typography>
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
    <Card className={styles.card}>
      <CardHeader
        title={title}
        subtitle={subtitle}
        right={() => {
          return <NextShuttleIcon minutes={minutes} />;
        }}
      />
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Chip label="06:15 am" />
          <Chip label="08:15 am" />
          <Chip label="10:15 am" />
        </HorizontalList>
      </CardContent>
      <CardContent className={styles.cardContent}>
        <HorizontalList>
          <Button variant='contained'>
            Directions
          </Button>
          <Button variant='outlined'>
            More info
          </Button>
        </HorizontalList>
      </CardContent>
    </Card>
  );
};
