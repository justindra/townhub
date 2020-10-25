import React from 'react';
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {
  Caption,
  Card,
  Chip,
  Surface,
  Title,
  useTheme,
} from 'react-native-paper';
import {
  Button,
  HorizontalListFlex,
  HorizontalListScroll,
} from '../../components';

const useCardSummaryStyles = () => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  return StyleSheet.create({
    card: {
      maxWidth: dimensions.width - theme.spacing(2),
      width: theme.spacing(25),
    },
    cardContent: {
      paddingHorizontal: 0,
      paddingVertical: theme.spacing(0.5),
    },
  });
};

const useNextShuttleIconStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    surface: {
      marginRight: theme.spacing(0.5),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.text,
      borderRadius: theme.roundness,
      padding: theme.spacing(0.25),
      width: theme.spacing(3),
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
  });
};

export const NextShuttleIcon: React.FC<{ minutes: number }> = ({ minutes }) => {
  const styles = useNextShuttleIconStyles();
  return (
    <Surface style={styles.surface}>
      <Title style={styles.title}>{minutes}</Title>
      <Caption style={styles.caption}>min</Caption>
    </Surface>
  );
};

export const CardSummary: React.FC<{
  title: string;
  subtitle: string;
  minutes: number;
  style?: StyleProp<ViewStyle>;
}> = ({ title, subtitle, minutes, style }) => {
  const styles = useCardSummaryStyles();

  const cardStyle = StyleSheet.compose<ViewStyle>(styles.card, style);
  return (
    <Card style={cardStyle}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        right={() => {
          return <NextShuttleIcon minutes={minutes} />;
        }}
      />
      <Card.Content style={styles.cardContent}>
        <HorizontalListScroll>
          <Chip>06:15 am</Chip>
          <Chip>08:15 am</Chip>
          <Chip>10:15 am</Chip>
          <Chip>12:15 pm</Chip>
          <Chip>01:15 pm</Chip>
        </HorizontalListScroll>
      </Card.Content>
      <Card.Content style={styles.cardContent}>
        <HorizontalListFlex>
          <Button icon='directions' mode='contained'>
            Directions
          </Button>
          <Button icon='alpha-i-circle' mode='outlined'>
            More info
          </Button>
        </HorizontalListFlex>
      </Card.Content>
    </Card>
  );
};
