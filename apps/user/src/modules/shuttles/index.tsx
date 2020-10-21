import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export const RouteButton: React.FC = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Button mode="outlined" compact style={{
      flex: 1,
      maxWidth: theme.spacing(8),
      borderRadius: 50,
      marginHorizontal: theme.spacing(0.25)
    }} {...props}>{children}</Button>
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
      <ScrollView horizontal centerContent style={{
        position: 'absolute',
        top: theme.spacing(),
        left: 0,
        right: 0,
      }} contentContainerStyle={{
        justifyContent: 'center',
        flexGrow: 1
      }}>
        <RouteButton theme={theme}>Morning</RouteButton>
        <RouteButton>Afternoon</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
        <RouteButton>Evening</RouteButton>
      </ScrollView>
      <Text>MAP</Text>
      <Card style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}>
        <Card.Title title="This is a stop" subtitle="some sort of extra description" />
      </Card>
    </View>
  )
}