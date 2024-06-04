import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';

type TimerProps = {
  initialSeconds?: number;
};

export const Timer = ({ initialSeconds = 5 }: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        console.log('BG - interval called - seconds:', seconds);
        setSeconds((currentSeconds) => {
          if (currentSeconds === 1) {
            clearInterval(interval!);
            Alert.alert(
                'Timer Finished',
                'The countdown has finished.',
                [
                  { text: "Reset", onPress: reset},
                ]
              );
            return 0;
          } else {
            return currentSeconds - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, seconds]);


  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return (
    <View>
      <Text>Time remaining: {seconds}</Text>
      <Button
        onPress={() => setIsActive(!isActive)} 
        title={isActive ? 'Pause' : seconds === initialSeconds ? 'Start' : 'Resume'}
      />
      <Button onPress={reset} title="Reset" />
    </View>
  );
};