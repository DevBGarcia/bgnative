/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { SafeAreaView, ScrollView, StatusBar, Text } from "react-native";

function App(): React.JSX.Element {

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Test</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
