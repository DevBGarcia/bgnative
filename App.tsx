import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TOP_LEVEL_SCREEN_NAMES } from './screens/Screens';

const Drawer = createDrawerNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="ProfileScreen">
        <Drawer.Screen name={TOP_LEVEL_SCREEN_NAMES.Home} component={HomeScreen} />
        <Drawer.Screen name={TOP_LEVEL_SCREEN_NAMES.Profile} component={ProfileScreen} />
      </Drawer.Navigator>
      </NavigationContainer>
  );
};

export default App;
