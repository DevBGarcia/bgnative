import React, { useState, useEffect, useRef } from 'react';
import { Text, Alert, AppState, AppStateStatus } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import { GlobalStyles } from '../styles/GlobalStyles';
import { formatTime } from '../utils/FormatTime';
import IconButton from './IconButton';

type TimerProps = {
  initialSeconds?: number;
};

export const Timer = ({ initialSeconds = 5 }: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalId = useRef<number | null>(null);

  console.log('BG - seconds', seconds);

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
                  { text: 'Reset', onPress: reset },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, seconds, appState]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

return (
    <>
        <Text style={GlobalStyles.h1}>{formatTime(seconds)}</Text>
         <IconButton
            isDisabled={seconds <= 0}
            IconButtonIconProps={{
                    name: isActive ? 'pause-circle-outline' : 'play-circle-outline',
            }}
            IconButtonTouchableOpacityProps={{
                onPress: () => setIsActive((prev) => !prev),
            }}
         />
         <IconButton
            IconButtonIconProps={{
                    name: 'reload-circle-outline',
            }}
            IconButtonTouchableOpacityProps={{
                onPress: reset,
            }}
         />
    </>
);
};
