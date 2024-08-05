import React, { useState, useEffect } from 'react';
import { Text, AppState, AppStateStatus, View, StyleSheet, ScrollView } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import { formatTime } from '../utils/FormatTime';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigators/TimersNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTimerStore } from '../globalStore/timerStore';
import Dialog from 'react-native-dialog';
import { GlobalStyles } from '../styles/GlobalStyles';
import { useSound } from '../context/SoundManager';

type TimerStates = 'warmup' | 'active' | 'rest' | 'finished';

type TimerStatusProps = {
  timerState: TimerStates;
  currentInterval: number;
  secondsLeft: number;
  isPaused: boolean;
};

export const TimerStatus = (props: TimerStatusProps) => {
  const { selectedTimer } = useTimerStore();
  const { timerState, currentInterval, secondsLeft, isPaused } = props;

  if (isPaused) {
    if (currentInterval === 1 && timerState === 'warmup' && secondsLeft === selectedTimer.warmupTime) {
      return <Text style={styles.initialStatusText}>Press play icon to start.</Text>;
    } else if (timerState === 'finished' && secondsLeft === 0) {
      return <Text style={styles.finishedStatusText}>Finished! Reset to start again.</Text>;
    } else {
      return <Text style={styles.pausedStatusText}>Paused!</Text>;
    }
  } else {
    return <Text style={styles.liveStatusText}>Live!</Text>;
  }
};

export const TimerScreen = () => {
  const { selectedTimer, resetTimerFlag } = useTimerStore();

  const [appState, setAppState] = useState(AppState.currentState);
  const { playSound } = useSound();

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  // Define state variables
  const [timerState, setTimerState] = useState<TimerStates>('warmup');
  const [currentInterval, setCurrentInterval] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds(timerState));
  const [isPaused, setIsPaused] = useState(true);

  const [showFinishedDialog, setShowFinishedDialog] = useState(false);

  const HALF_WAY_MARK = selectedTimer.intervalTime / 2;

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
    if (!isPaused) {
      handleTimerAudio(secondsLeft);
    }
  }, [secondsLeft]);

  useEffect(() => {
    reset();
  }, [resetTimerFlag]);

  const handleTimerAudio = (seconds: number) => {
    //Only play halfway mark if it's greater than 30 seconds. It gets very noisy otherwise
    if (seconds === HALF_WAY_MARK && timerState === 'active' && HALF_WAY_MARK >= 30) {
      playSound('halfway_to_victory');
    }

    const soundActions = {
      600: () => timerState === 'active' && playSound('time_10_minutes_remain'),
      300: () => {
        playSound(timerState === 'active' ? 'time_5_minutes_remain' : 'time_5_minutes');
      },
      120: () => playSound(timerState === 'active' ? 'time_2_minutes_left' : 'time_2_minutes'),
      60: () => playSound(timerState === 'active' ? 'time_1_minute_left' : 'time_1_minute'),
      30: () => playSound(timerState === 'active' ? 'time_30_seconds_remaining' : 'time_30_seconds'),
      10: () => playSound(timerState === 'active' ? 'time_10_seconds_remaining' : 'time_10_seconds'),
      5: () => timerState === 'active' && playSound('time_5_second_countdown'),
      4: () => timerState !== 'active' && playSound('time_4_beep_spawn'),
      0: () => handleRoundTransitionAudio(),
    };

    // Execute the sound action if the seconds are valid
    const action = soundActions[seconds];
    if (action) {
      action();
    }
  };

  //Need a function to determine what audio to play when transitioning between states at the end of each timer (warmup, active, rest)
  const handleRoundTransitionAudio = () => {
    //This is an edge case for 1 round
    if (timerState === 'warmup') {
      currentInterval === selectedTimer.intervalCount ? playSound('final_round_1') : handleRoundIntervalAudio(currentInterval);
    } else if (timerState === 'active') {
      currentInterval === selectedTimer.intervalCount ? playSound('game_over_victory') : playSound('round_over');
    } else if (timerState === 'rest') {
      currentInterval + 1 === selectedTimer.intervalCount ? playSound('final_round_1') : handleRoundIntervalAudio(currentInterval + 1);
    }
  };

  const handleRoundIntervalAudio = (interval: number) => {
    const intervalRoundActions = {
      1: () => playSound('round_01'),
      2: () => playSound('round_02'),
      3: () => playSound('round_03'),
      4: () => playSound('round_04'),
      5: () => playSound('round_05'),
      6: () => playSound('round_06'),
      7: () => playSound('round_07'),
      8: () => playSound('round_08'),
      9: () => playSound('round_09'),
      10: () => playSound('round_10'),
      11: () => playSound('round_11'),
      12: () => playSound('round_12'),
      13: () => playSound('round_13'),
      14: () => playSound('round_14'),
      15: () => playSound('round_15'),
      16: () => playSound('round_16'),
      17: () => playSound('round_17'),
      18: () => playSound('round_18'),
      19: () => playSound('round_19'),
      20: () => playSound('round_20'),
      21: () => playSound('round_21'),
      22: () => playSound('round_22'),
      23: () => playSound('round_23'),
      24: () => playSound('round_24'),
      25: () => playSound('round_25'),
    };
    // Execute the sound action if the seconds are valid
    const action = intervalRoundActions[interval];
    if (action) {
      action();
    }
  };

  // Single useEffect for timer logic
  useEffect(() => {
    const startTimer = () => {
      BackgroundTimer.runBackgroundTimer(() => {
        setSecondsLeft((prevSeconds: number) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            // Change state when timer seconds reach 0
            switch (timerState) {
              case 'warmup': //Warmup is done, start active
                setTimerState('active');
                return getInitialSeconds('active');
              case 'active': //Active is done, check if more rounds to go, set rest else finish
                if (currentInterval < selectedTimer.intervalCount) {
                  //More rounrs to go, set rest
                  playSound('reset');
                  setTimerState('rest');
                  return getInitialSeconds('rest');
                } else {
                  setTimerState('finished');
                  BackgroundTimer.stopBackgroundTimer(); // Stop the timer
                  if (appState === 'active') {
                    setShowFinishedDialog(true);
                    reset();
                  } else {
                    // Trigger push notification if appState is not 'active'
                    PushNotification.localNotification({
                      channelId: 'channel-id',
                      title: 'Timer Finished',
                      message: 'Your timer has finished. Great job!', // Customize your message
                    });
                  }
                  return getInitialSeconds('finished');
                }
              case 'rest': //Rest is done, start active
                setCurrentInterval((prevInterval) => prevInterval + 1);
                setTimerState('active');
                return getInitialSeconds('active');
            }
          }
          return getInitialSeconds(timerState);
        });
      }, 1000);
    };

    if (!isPaused) {
      startTimer();
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [isPaused, timerState, currentInterval, secondsLeft]);

  // Function to get initial seconds based on timer state
  function getInitialSeconds(state: TimerStates): number {
    switch (state) {
      case 'warmup':
        return selectedTimer.warmupTime;
      case 'active':
        return selectedTimer.intervalTime;
      case 'rest':
        return selectedTimer.restTime;
      default:
        return 0;
    }
  }

  // Reset function to reset all states to initial
  const reset = () => {
    setIsPaused(true);
    setTimerState('warmup');
    setCurrentInterval(1);
    setSecondsLeft(getInitialSeconds('warmup'));
  };

  const getHeaderText = (state: TimerStates) => {
    switch (state) {
      case 'warmup':
        return 'Warmup';
      case 'active':
        return 'Active';
      case 'rest':
        return 'Rest';
      case 'finished':
        return 'Finished';
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        persistentScrollbar={true}
      >
        <View style={styles.contentSection}>
          <Dialog.Container visible={showFinishedDialog}>
            <Dialog.Title>Timer Finished</Dialog.Title>
            <Dialog.Description>Timer has finished. Press OK to reset.</Dialog.Description>
            <Dialog.Button
              label="OK"
              onPress={() => {
                setShowFinishedDialog(false);
                reset();
              }}
            />
          </Dialog.Container>
          <View>
            <Text style={GlobalStyles.headerText}> Selected Timer Specs </Text>
            <View style={styles.sectionSpacer} />
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Title : </Text>
              <Text style={styles.timerInfoFont}>{selectedTimer.timerName}</Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Interval Count: </Text>
              <Text style={styles.timerInfoFont}>{selectedTimer.intervalCount}</Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Warmup Time: </Text>
              <Text style={styles.timerInfoFont}>{formatTime(selectedTimer.warmupTime)}</Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Interval Time: </Text>
              <Text style={styles.timerInfoFont}>{formatTime(selectedTimer.intervalTime)}</Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Rest Time: </Text>
              <Text style={styles.timerInfoFont}>{formatTime(selectedTimer.restTime)}</Text>
            </View>
          </View>
          <View>
            <Text style={GlobalStyles.headerText}> Timer State </Text>
            <View style={styles.sectionSpacer} />
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Current State: </Text>
              <Text style={styles.timerInfoFont}>{getHeaderText(timerState)}</Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Current Interval:</Text>
              <Text style={styles.timerInfoFont}>
                {currentInterval} (of {selectedTimer.intervalCount})
              </Text>
            </View>
            <View style={styles.timerInfo}>
              <Text style={styles.timerInfoFont}>Time Left:</Text>
              <Text style={styles.timerInfoFont}>{formatTime(secondsLeft)}</Text>
            </View>
            {/* Bottom section here for live/paused/start/ended status */}
          </View>
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
              isDisabled={secondsLeft <= 0}
              IconButtonIconProps={{
                name: !isPaused ? 'pause' : 'play',
              }}
              IconButtonTouchableOpacityProps={{
                onPress: () => {
                  //Only play pause/resume sound if not starting timer for the first time
                  if (!(timerState === 'warmup' && secondsLeft === selectedTimer.warmupTime)) {
                    playSound(!isPaused ? 'stopped' : 'returned', true);
                  } else {
                    //Need to startup sound as well as trigger first seconds sounds here
                    playSound('buckle_up');
                    handleTimerAudio(secondsLeft);
                  }
                  setIsPaused((prev) => !prev);
                },
              }}
            />
            <IconButton
              IconButtonIconProps={{
                name: 'pencil',
              }}
              IconButtonTouchableOpacityProps={{
                onPress: () => {
                  reset();
                  navigation.navigate('EditTimer');
                },
              }}
            />
          </View>
          <TimerStatus
            timerState={timerState}
            currentInterval={currentInterval}
            secondsLeft={secondsLeft}
            isPaused={isPaused}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timerActionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  timerInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  timerInfoFont: {
    fontSize: 16,
  },
  timerInfoLabel: {
    fontSize: 16,
  },
  pausedStatusText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },
  initialStatusText: {
    fontSize: 24,
    color: 'blue',
    textAlign: 'center',
  },
  liveStatusText: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
  },
  finishedStatusText: {
    fontSize: 24,
    color: 'red',
    textAlign: 'center',
  },
  sectionSpacer: {
    marginVertical: 8,
  },
});
