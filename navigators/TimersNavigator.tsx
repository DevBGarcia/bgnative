import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TimerScreen } from '../screens/TimerScreen';
import { TimerEditScreen } from '../screens/TimerEditScreen';
import { TimerListScreen } from '../screens/TimerListScreen';

export const TIMERS_NAVIGATOR_SCREEN_NAMES = {
    Timer: 'Timer',
    EditTimer: 'Edit Timer',
    TimerList: 'Timer List',
}

// Create a stack navigator
const Stack = createStackNavigator();

export const TimersNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Timer"
      screenOptions={{ headerShown: false }} // Hide the header for all screens
    >
        <Stack.Screen name={TIMERS_NAVIGATOR_SCREEN_NAMES.Timer} component={TimerScreen} />
        <Stack.Screen name={TIMERS_NAVIGATOR_SCREEN_NAMES.EditTimer}component={TimerEditScreen} />
        <Stack.Screen name={TIMERS_NAVIGATOR_SCREEN_NAMES.TimerList} component={TimerListScreen} />
    </Stack.Navigator>
  );
};
