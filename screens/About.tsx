import React from 'react';
import { Text, Linking, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalStyles } from '../styles/GlobalStyles';

export const About = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:devBgarcia@gmail.com');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      indicatorStyle="black"
      persistentScrollbar={true}
    >
      <View style={[GlobalStyles.screenContainer]}>
        <Text style={GlobalStyles.headerText}>The Spartan HIIT Timer</Text>
        <View style={styles.textContentContainer}>
          <Text>
            Welcome to my app! The purpose of this project is to provide a fun, halo themed, interval timer to spice up your HIIT workouts. I was looking for an
            interval timer, but all the free-to-install apps I found were riddled with ads so I figured I would try taking a crack at making one myself.
          </Text>
          <Text>
            My name is Byron and this is my first major personal project. I'm relatively new to the react/web-development/mobile-development space so please
            report any bugs you find. Check out the release notes to see what the current version has to offer as well as future updates I plan to eventually
            make.
          </Text>
          <Text>
            I intend for this app to be completely free, all I ask is for your feedback. I still have plenty to learn and I'm always looking for ways to
            improve. Please let me know your thoughts on potential updates or features you'd like to see in the future, and if you enjoyed using the app, please
            consider sharing it with your friends.
          </Text>
          <Text>
            Please provide your feedback in the app store or contact me at:{' '}
            <Text
              style={styles.link}
              onPress={handleEmailPress}
            >
              devBgarcia@gmail.com
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textContentContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
