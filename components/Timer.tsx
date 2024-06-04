import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Alert, AppState, AppStateStatus } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';

type TimerProps = {
  initialSeconds?: number;
};

export const Timer = ({ initialSeconds = 5 }: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalId = useRef<number | null>(null);

  console.log('BG - appState', appState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
        appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isActive && seconds > 0) {
        intervalId.current = BackgroundTimer.setInterval(() => {
        setSeconds((currentSeconds) => {
          if (currentSeconds === 1) {
            BackgroundTimer.clearInterval(intervalId.current!);
            if (appState === 'active') {
              Alert.alert(
                'Timer Finished',
                'The countdown has finished.',
                [
                  { text: "Reset", onPress: reset },
                ]
              );
            } else {
              PushNotification.localNotification({
                message: 'Timer Finished',
              });
            }
            return 0;
          } else {
            return currentSeconds - 1;
          }
        });
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(intervalId.current!);
    }

    return () => BackgroundTimer.clearInterval(intervalId.current!);
  }, [isActive, seconds, appState]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return (
    <View>
      <Text>Time remaining: {seconds}</Text>
      {seconds > 0 &&
        <Button
            onPress={() => setIsActive(!isActive)} 
            title={isActive ? 'Pause' : seconds === initialSeconds ? 'Start' : 'Resume'}
        />
      }
      <Button onPress={reset} title="Reset" />
    </View>
  );
};