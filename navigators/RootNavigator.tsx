import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SoundboardScreen } from "../screens/SoundboardScreen";
import { TimersNavigator } from "./TimersNavigator";

export const TOP_LEVEL_SCREEN_NAVIGATOR_NAMES = {
  Timers: "Timers",
  Soundboard: "Soundboard",
};

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={TOP_LEVEL_SCREEN_NAVIGATOR_NAMES.Timers}
      >
        <Drawer.Screen
          name={TOP_LEVEL_SCREEN_NAVIGATOR_NAMES.Timers}
          component={TimersNavigator}
        />
        <Drawer.Screen
          name={TOP_LEVEL_SCREEN_NAVIGATOR_NAMES.Soundboard}
          component={SoundboardScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
