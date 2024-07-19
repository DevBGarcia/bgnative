import React from 'react';
import { Button, Text, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import Sound from 'react-native-sound';
import Round1Audio from '../audio/Round01.mp3';

export const SoundboardScreen = () => {
  // Enable playback in silence mode
  Sound.setCategory('Playback');

  const playSound = () => {
    // Initialize the sound
    var sound = new Sound(Round1Audio, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Play the sound if loading was successful
      sound.play((success) => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text>Timer List Screen</Text>
      <Button
        title="Play Sound"
        onPress={playSound}
      />
    </View>
  );
};
