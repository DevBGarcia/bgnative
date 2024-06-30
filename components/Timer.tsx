import React, { useState, useEffect, useRef } from 'react';
import { Text, Alert, AppState, AppStateStatus, View, StyleSheet } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import { GlobalStyles } from '../styles/GlobalStyles';
import { formatTime } from '../utils/FormatTime';
import IconButton from './IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigators/TimersNavigator';
import { StackNavigationProp } from '@react-navigation/stack';


type TimerProps = {
  initialSeconds?: number;
};

export const Timer = ({ initialSeconds = 5 }: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalId = useRef<number | null>(null);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

useEffect(() => {
  // Define the function inside the effect to ensure it has the most current behavior
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  // Subscribe to AppState changes
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  // Return a cleanup function that removes the event listener
  return () => subscription.remove();
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
                channelId: 'channel-id',
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

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  const styles = StyleSheet.create({
    timerActionButtonsContainer: {
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 16,
    },
  });

  return (
    <>
      <Text style={GlobalStyles.h1}>{formatTime(seconds)}</Text>
      <View style={styles.timerActionButtonsContainer}>
        <IconButton
          IconButtonIconProps={{
            name: 'reload',
          }}
          IconButtonTouchableOpacityProps={{
            onPress: reset,
          }}
        />
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
            name: 'pencil-circle-outline',
          }}
          IconButtonTouchableOpacityProps={{
            onPress: () => navigation.navigate('EditTimer'),
          }}
        />
      </View>
    </>
  );
};
