import React from 'react';
import { Button, Text, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { useSound } from '../context/SoundManager';

export const SoundboardScreen = () => {
  const { playSound } = useSound();

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text>Timer List Screen</Text>
      <Button
        title="Stopped"
        onPress={() => playSound('stopped')}
      />
      <Button
        title="Returned"
        onPress={() => playSound('returned')}
      />
    </View>
  );
};
