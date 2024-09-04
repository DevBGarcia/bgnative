import React, { useState, useEffect, useRef } from 'react';
import { Text, AppState, AppStateStatus, View, StyleSheet, ScrollView, NativeModules } from 'react-native';
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

const TIMER_CHECK_INTERVAL = 100;

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
  const { ForegroundService } = NativeModules;

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  // Define state variables
  const [timerState, setTimerState] = useState<TimerStates>('warmup');
  const [currentInterval, setCurrentInterval] = useState(1);

  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(getInitialSeconds(timerState));
  const timerPauseTimeRef = useRef<number | null>(null);

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
    return () => {
      subscription.remove(); // Stop the service
      ForegroundService.stopService();
    };
  }, []);

  // Start the service when the app is in the background it will continue
  useEffect(() => {
    isPaused === true ? ForegroundService.stopService() : ForegroundService.startService();
  }, [isPaused]);

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

  // Need a function to determine what audio to play when transitioning between states at the end of each timer (warmup, active, rest)
  const handleRoundTransitionAudio = () => {
    //This is an edge case for 1 round
    if (timerState === 'warmup') {
      handleRoundIntervalAudio(currentInterval);
      currentInterval === selectedTimer.intervalCount && playSound('final_round_1');
    } else if (timerState === 'active') {
      currentInterval === selectedTimer.intervalCount ? playSound('game_over_victory') : playSound('round_over');
    } else if (timerState === 'rest') {
      handleRoundIntervalAudio(currentInterval + 1);
      currentInterval + 1 === selectedTimer.intervalCount && playSound('final_round_1');
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
        // Logic to check the durations and remaining times
        let startTimeStamp = timerStartTimeRef.current;
        if (!startTimeStamp) {
          const initStartTime = new Date().getTime();
          timerStartTimeRef.current = initStartTime;
          startTimeStamp = initStartTime;
        }

        // Get the current time and calculate the elapsed time. Compared the elapsed time and compare it to the timer duration.
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTimeStamp;
        const remainingTime = timerDurationRef.current - Math.floor(elapsedTime / 1000);

        //If there is no change in the remaining time, return.
        if (remainingTime === secondsLeft) {
          return;
        }

        if (remainingTime >= 0) {
          console.log(`Current Interval: ${currentInterval}, Timer State: ${timerState}, Time Left: ${remainingTime}`);
          setSecondsLeft(remainingTime);
        } else {
          switch (timerState) {
            case 'warmup': //Warmup is done, start active
              setTimerState('active');
              setSecondsLeft(getInitialSeconds('active'));
              timerDurationRef.current = getInitialSeconds('active');
              timerStartTimeRef.current = new Date().getTime();
              return;
            case 'active': //Active is done, check if more rounds to go, set rest else finish
              if (currentInterval < selectedTimer.intervalCount) {
                //More rounrs to go, set rest
                playSound('reset');
                setTimerState('rest');
                setSecondsLeft(getInitialSeconds('rest'));
                timerDurationRef.current = getInitialSeconds('rest');
                timerStartTimeRef.current = new Date().getTime();
                return;
              } else {
                setTimerState('finished');
                BackgroundTimer.stopBackgroundTimer(); // Stop the timer
                setShowFinishedDialog(true);
                reset();
                if (appState !== 'active') {
                  PushNotification.localNotification({
                    channelId: 'channel-id',
                    title: 'Timer Finished',
                    message: 'Your timer has finished. Great job!', // Customize your message
                  });
                }
                return;
              }
            case 'rest': //Rest is done, start active
              setCurrentInterval((prevInterval) => prevInterval + 1);
              setTimerState('active');
              setSecondsLeft(getInitialSeconds('active'));
              timerDurationRef.current = getInitialSeconds('active');
              timerStartTimeRef.current = new Date().getTime();
              return;
          }
        }
      }, TIMER_CHECK_INTERVAL);
    };

    if (!isPaused) {
      // Start the native service that will make sure the app continues to run in the background when the phone is locked
      startTimer();
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [isPaused, secondsLeft]);

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
    timerDurationRef.current = getInitialSeconds('warmup');
    timerStartTimeRef.current = null;
    timerPauseTimeRef.current = null;
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

  // Need to record the paused time to adjust the timer start time stamp when resumed
  const handlePause = () => {
    setIsPaused(true);
    timerPauseTimeRef.current = new Date().getTime();
  };

  // Get the elapsed time of the puasedtime, and then add that to the start time to get the new start time for resuming.
  const handleResume = () => {
    setIsPaused(false);
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - timerPauseTimeRef.current;
    timerStartTimeRef.current += elapsedTime;
    timerPauseTimeRef.current = null;
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
                    handleTimerAudio(secondsLeft);
                  }
                  isPaused ? handleResume() : handlePause();
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
