import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { useSound } from '../context/SoundManager';
import { TimerInputModal } from '../components/TimerInputModal';

export const SoundboardScreen = () => {
  const { playSound } = useSound();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

  return (
    <View style={GlobalStyles.screenContainer}>
      <Button
        title="Stopped"
        onPress={() => playSound('stopped')}
      />
      <TimerInputModal
        isOpen={isTimerModalOpen}
        setIsOpen={setIsTimerModalOpen}
      />
      <Button
        title="Open Timer"
        onPress={() => setIsTimerModalOpen(true)}
      />
    </View>
  );
};
