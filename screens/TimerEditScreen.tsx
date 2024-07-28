import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigators/TimersNavigator';
import { Timer, useTimerStore } from '../globalStore/timerStore';
import { NUMBERS_ONLY_REGEX } from '../utils/RegexSupport';

export const TimerEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { selectedTimer, setSelectedTimer, isTimerUpdateLoading, setIsTimerUpdateLoading } = useTimerStore();

  const [timerName, onChangeTimerName] = useState<string>(selectedTimer.timerName);

  const [intervalRoundCount, onChangeIntervalRoundCount] = useState<string>(selectedTimer.intervalCount.toString());
  const [isIntervalRoundCountError, setIsIntervalRoundCountError] = useState<boolean>(false);

  const [intervalRoundTime, onChangeIntervalRoundTime] = useState<string>(selectedTimer.intervalTime.toString());
  const [isIntervalRoundTimeError, setIsIntervalRoundTimeError] = useState<boolean>(false);

  const [restTime, onChangeRestTime] = useState<string>(selectedTimer.restTime.toString());
  const [isRestTimeError, setIsRestTimeError] = useState<boolean>(false);

  const [warmupTime, onChangeWarmupTime] = useState<string>(selectedTimer.warmupTime.toString());
  const [isWarmupTimeError, setIsWarmupTimeError] = useState<boolean>(false);

  const updateSelectedTimer = () => {
    setIsTimerUpdateLoading(true);

    let newTimer: Timer = {
      timerName: timerName,
      intervalCount: Number(intervalRoundCount),
      intervalTime: Number(intervalRoundTime),
      restTime: Number(restTime),
      warmupTime: Number(warmupTime),
    };

    setSelectedTimer(newTimer);

    setIsTimerUpdateLoading(false);

    navigation.goBack();
  };

  const isUpdateDisabled =
    isIntervalRoundCountError ||
    isIntervalRoundTimeError ||
    isRestTimeError ||
    isWarmupTimeError ||
    !timerName ||
    !intervalRoundCount ||
    !intervalRoundTime ||
    !restTime ||
    !warmupTime;

  return (
    <View style={styles.screenContainer}>
      <ScrollView>
        <View style={styles.subcontentSection}>
          <View style={GlobalStyles.backButtonHeader}>
            <IconButton
              IconButtonIconProps={{
                name: 'keyboard-backspace',
              }}
              IconButtonTouchableOpacityProps={{
                onPress: () => navigation.goBack(),
                style: { position: 'absolute', left: 0 },
              }}
            />
            <Text style={GlobalStyles.headerText}>Edit Timer</Text>
          </View>
          <Text style={styles.supportMessage}>
            * Note: All Inputs are <Text style={styles.errorMessage}>REQUIRED</Text>
          </Text>
          <View>
            <Text>Timer Name:</Text>
            <TextInput
              style={[styles.input]}
              onChangeText={(inputVal) => {
                onChangeTimerName(inputVal);
              }}
              value={timerName}
              placeholder="Name for this timer"
              placeholderTextColor={'gray'}
            />
          </View>
          <View>
            <Text>Interval/Round Count:</Text>
            {isIntervalRoundCountError && <Text style={styles.errorMessage}>Invalid Value, whole numbers only</Text>}
            <TextInput
              style={[styles.input, isIntervalRoundCountError && styles.errorInput]}
              onChangeText={(inputVal) => {
                const isValid = NUMBERS_ONLY_REGEX.test(inputVal);
                setIsIntervalRoundCountError(!isValid);
                onChangeIntervalRoundCount(inputVal);
              }}
              value={intervalRoundCount}
              keyboardType="numeric"
              placeholder="Enter the number of intervals/rounds"
              placeholderTextColor={'gray'}
            />
          </View>
          <View>
            <Text>Time Length Per Interval/Round (Seconds):</Text>
            {isIntervalRoundTimeError && <Text style={styles.errorMessage}>Invalid Value, whole numbers only</Text>}
            <TextInput
              style={[styles.input, isIntervalRoundTimeError && styles.errorInput]}
              onChangeText={(inputVal) => {
                const isValid = NUMBERS_ONLY_REGEX.test(inputVal);
                setIsIntervalRoundTimeError(!isValid);
                onChangeIntervalRoundTime(inputVal);
              }}
              value={intervalRoundTime}
              keyboardType="numeric"
              placeholder="Number of seconds per each interval/round"
              placeholderTextColor={'gray'}
            />
          </View>
          <View>
            <Text>Rest Time Length (Seconds):</Text>
            {isRestTimeError && <Text style={styles.errorMessage}>Invalid Value, whole numbers only</Text>}
            <TextInput
              style={[styles.input, isRestTimeError && styles.errorInput]}
              onChangeText={(inputVal) => {
                const isValid = NUMBERS_ONLY_REGEX.test(inputVal);
                setIsRestTimeError(!isValid);
                onChangeRestTime(inputVal);
              }}
              value={restTime}
              keyboardType="numeric"
              placeholder="Number of seconds for rest"
              placeholderTextColor={'gray'}
            />
          </View>
          <View>
            <Text>Warmup Time Length (Seconds):</Text>
            {isWarmupTimeError && <Text style={styles.errorMessage}>Invalid Value, whole numbers only</Text>}
            <TextInput
              style={[styles.input, isWarmupTimeError && styles.errorInput]}
              onChangeText={(inputVal) => {
                const isValid = NUMBERS_ONLY_REGEX.test(inputVal);
                setIsWarmupTimeError(!isValid);
                onChangeWarmupTime(inputVal);
              }}
              value={warmupTime}
              keyboardType="numeric"
              placeholder="Number of seconds for warmup"
              placeholderTextColor={'gray'}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.subcontentSection}>
        <Button
          title="Save Timer"
          onPress={updateSelectedTimer}
          disabled={isUpdateDisabled || isTimerUpdateLoading}
        />
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          disabled={isTimerUpdateLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    minWidth: 200,
  },
  screenContainer: {
    flex: 1,
    padding: 24,
    flexDirection: 'column',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
  supportMessage: {
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  subcontentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
});
