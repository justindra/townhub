import React from 'react';
import { useTheme } from 'react-native-paper';
import { HorizontalListScroll } from '../../components';
import { CardSummary } from './card-summary';

export const CardList: React.FC = () => {
  const theme  = useTheme();
  return (
    <HorizontalListScroll style={{
      position: 'absolute',
      bottom: theme.spacing(0.5),
      left: 0,
      right: 0,
    }}>
      <CardSummary
      title="This is a stop" subtitle="some sort of extra description asdhuauiydnuiahdiuasjdiusa"
      minutes={24}
      />
      <CardSummary
      title="This is a stop" subtitle="some sort of extra description asdhuauiydnuiahdiuasjdiusa"
      minutes={24}
      />
      <CardSummary
      title="This is a stop" subtitle="some sort of extra description asdhuauiydnuiahdiuasjdiusa"
      minutes={24}
      />
    </HorizontalListScroll>

  )
}