import React, { useState, useEffect } from "react";
import { Text, AppState, AppStateStatus, View, StyleSheet } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import PushNotification from "react-native-push-notification";
import { formatTime } from "../utils/FormatTime";
import IconButton from "../components/IconButton";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../navigators/TimersNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTimerStore } from "../globalStore/timerStore";
import Dialog from "react-native-dialog";
import { GlobalStyles } from "../styles/GlobalStyles";

type TimerStates = "warmup" | "active" | "rest" | "finished";

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
    if (
      currentInterval === 1 &&
      timerState === "warmup" &&
      secondsLeft === selectedTimer.warmupTime
    ) {
      return <Text style={styles.initialStatusText}>Press play to start.</Text>;
    } else if (timerState === "finished" && secondsLeft === 0) {
      return (
        <Text style={styles.finishedStatusText}>
          Finished! Reset to start again.
        </Text>
      );
    } else {
      return <Text style={styles.pausedStatusText}>Paused!</Text>;
    }
  } else {
    return <Text style={styles.liveStatusText}>Live!</Text>;
  }
};

export const TimerScreen = () => {
  const { selectedTimer } = useTimerStore();

  const [appState, setAppState] = useState(AppState.currentState);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  // Define state variables
  const [timerState, setTimerState] = useState<TimerStates>("warmup");
  const [currentInterval, setCurrentInterval] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds(timerState));
  const [isPaused, setIsPaused] = useState(true);

  const [showFinishedDialog, setShowFinishedDialog] = useState(false);

  useEffect(() => {
    // Define the function inside the effect to ensure it has the most current behavior
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    // Subscribe to AppState changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Return a cleanup function that removes the event listener
    return () => subscription.remove();
  }, []);

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
              case "warmup":
                setTimerState("active");
                return getInitialSeconds("active");
              case "active":
                if (currentInterval < selectedTimer.intervalCount) {
                  //More rounrs to go, set rest
                  setTimerState("rest");
                  return getInitialSeconds("rest");
                } else {
                  // Last round finished
                  setTimerState("finished");
                  BackgroundTimer.stopBackgroundTimer(); // Stop the timer
                  setIsPaused(true);
                  if (appState === "active") {
                    setShowFinishedDialog(true);
                  } else {
                    // Trigger push notification if appState is not 'active'
                    PushNotification.localNotification({
                      channelId: "channel-id",
                      title: "Timer Finished",
                      message: "Your timer has finished. Great job!", // Customize your message
                    });
                  }
                  return getInitialSeconds("finished");
                }
              case "rest":
                setCurrentInterval((prevInterval) => prevInterval + 1);
                setTimerState("active");
                return getInitialSeconds("active");
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
      case "warmup":
        return selectedTimer.warmupTime;
      case "active":
        return selectedTimer.intervalTime;
      case "rest":
        return selectedTimer.restTime;
      default:
        return 0;
    }
  }

  // Reset function to reset all states to initial
  const reset = () => {
    setIsPaused(true);
    setTimerState("warmup");
    setCurrentInterval(1);
    setSecondsLeft(getInitialSeconds("warmup"));
  };

  const getHeaderText = (state: TimerStates) => {
    switch (state) {
      case "warmup":
        return "Warmup";
      case "active":
        return "Active";
      case "rest":
        return "Rest";
      case "finished":
        return "Finished";
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <View style={styles.contentSection}>
        <Dialog.Container visible={showFinishedDialog}>
          <Dialog.Title>Timer Finished</Dialog.Title>
          <Dialog.Description>
            Timer has finished. Press OK to reset.
          </Dialog.Description>
          <Dialog.Button
            label="OK"
            onPress={() => {
              setShowFinishedDialog(false);
              reset();
            }}
          />
        </Dialog.Container>
        <View style={styles.timerInfo}>
          <Text style={styles.timerInfoFont}>Title: </Text>
          <Text style={styles.timerInfoFont}>{selectedTimer.timerTitle}</Text>
        </View>
        <View style={styles.timerInfo}>
          <Text style={styles.timerInfoFont}>Current State: </Text>
          <Text style={styles.timerInfoFont}>{getHeaderText(timerState)}</Text>
        </View>
        <View style={styles.timerInfo}>
          <Text style={styles.timerInfoFont}>Current Round:</Text>
          <Text style={styles.timerInfoFont}>
            {currentInterval} (of {selectedTimer.intervalCount})
          </Text>
        </View>
        <View style={styles.timerInfo}>
          <Text style={styles.timerInfoFont}>Time Left:</Text>
          <Text style={styles.timerInfoFont}>{formatTime(secondsLeft)}</Text>
        </View>
        <View style={styles.timerActionButtonsContainer}>
          <IconButton
            IconButtonIconProps={{
              name: "reload",
            }}
            IconButtonTouchableOpacityProps={{
              onPress: reset,
            }}
          />
          <IconButton
            isDisabled={secondsLeft <= 0}
            IconButtonIconProps={{
              name: !isPaused ? "pause" : "play",
            }}
            IconButtonTouchableOpacityProps={{
              onPress: () => setIsPaused((prev) => !prev),
            }}
          />
          <IconButton
            IconButtonIconProps={{
              name: "pencil",
            }}
            IconButtonTouchableOpacityProps={{
              onPress: () => navigation.navigate("EditTimer"),
            }}
          />
        </View>
        {/* Bottom section here for live/paused/start/ended status */}
        <TimerStatus
          timerState={timerState}
          currentInterval={currentInterval}
          secondsLeft={secondsLeft}
          isPaused={isPaused}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerActionButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  contentSection: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
    alignItems: "center",
  },
  timerInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    minWidth: 256,
    maxWidth: 256,
  },
  timerInfoFont: {
    fontSize: 24,
  },
  pausedStatusText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
  },
  initialStatusText: {
    fontSize: 20,
    color: "blue",
    textAlign: "center",
  },
  liveStatusText: {
    fontSize: 20,
    color: "green",
    textAlign: "center",
  },
  finishedStatusText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
  },
});
