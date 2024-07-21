import React, { useEffect, useRef } from 'react';
import { Button, Text, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import Sound from 'react-native-sound';

export const SoundboardScreen = () => {
  // Enable playback in silence mode
  Sound.setCategory('Playback');
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Initialize and load the sound when the component mounts
    soundRef.current = new Sound('gameovervictory.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        soundRef.current = null;
      }
    });

    // Cleanup function to release the sound resource when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
        soundRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    // Play the sound if it's loaded
    if (soundRef.current) {
      soundRef.current.play((success) => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    }
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
