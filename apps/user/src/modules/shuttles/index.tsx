import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Button, HorizontalListScroll } from '../../components';
import { CardList } from './card-list';

export const RouteButton: React.FC = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Button mode="outlined" style={{
      flex: 1,
      maxWidth: theme.spacing(8),
      borderRadius: 50,
      marginHorizontal: theme.spacing(0.25)
    }} color={theme.colors.text} {...props}>{children}</Button>
  )
}

export const ShuttleModule: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#81bf81',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
    }}>
      <HorizontalListScroll style={{
        position: 'absolute',
        top: theme.spacing(1),
        left: 0,
        right: 0
      }}>
        <RouteButton>Morning</RouteButton>
        <RouteButton>Afternoon</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
      </HorizontalListScroll>
      <Text>MAP</Text>
      <CardList />
    </View>
  )
}