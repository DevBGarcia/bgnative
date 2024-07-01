import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TimerScreen } from '../screens/TimerScreen';
import { TimerEditScreen } from '../screens/TimerEditScreen';
import { TimerListScreen } from '../screens/TimerListScreen';


export type TimerScreenNames =  'Timer' | 'EditTimer' | 'TimerList'

export type StackParamList = {
  Timer: undefined,
  EditTimer: undefined,
  TimerList: undefined,
};

// Create a stack navigator
const Stack = createStackNavigator();

export const TimersNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Timer"
      screenOptions={{ headerShown: false }} // Hide the header for all screens
    >
        <Stack.Screen name={'Timer'} component={TimerScreen} />
        <Stack.Screen name={'EditTimer'}component={TimerEditScreen} />
        <Stack.Screen name={'TimerList'} component={TimerListScreen} />
    </Stack.Navigator>
  );
};
