import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigators/TimersNavigator';
import { Timer, useTimerStore } from '../globalStore/timerStore';
import { NUMBERS_ONLY_REGEX } from '../utils/RegexSupport';
import { Button } from '../components/Button';
import { TimerInputModal } from '../components/TimerInputModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatTime } from '../utils/FormatTime';

export type EditTimerState = 'intervalRoundTime' | 'restTime' | 'warmupTime' | null;

export const TimerEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { selectedTimer, setSelectedTimer, isTimerUpdateLoading, setIsTimerUpdateLoading, triggerResetTimerFlag } = useTimerStore();

  const [timerName, onChangeTimerName] = useState<string>(selectedTimer.timerName);

  const [intervalRoundCount, onChangeIntervalRoundCount] = useState<string>(selectedTimer.intervalCount.toString());
  const [isIntervalRoundCountError, setIsIntervalRoundCountError] = useState<boolean>(false);

  const [intervalRoundTime, onChangeIntervalRoundTime] = useState<string>(selectedTimer.intervalTime.toString());

  const [restTime, onChangeRestTime] = useState<string>(selectedTimer.restTime.toString());

  const [warmupTime, onChangeWarmupTime] = useState<string>(selectedTimer.warmupTime.toString());

  const [isTimerInputModalOpen, setIsTimerInputModalOpen] = useState<boolean>(false);
  const [editTimerState, setEditTimerState] = useState<EditTimerState>(null);

  const getTimerInputModalTitle = (editTimerKey: EditTimerState) => {
    switch (editTimerKey) {
      case 'intervalRoundTime':
        return 'Set Interval/Round Time';
      case 'restTime':
        return 'Set Rest Time';
      case 'warmupTime':
        return 'Set Warmup Time';
      default:
        return 'Set Timer';
    }
  };

  const getEditTime = (editTimerKey: EditTimerState) => {
    switch (editTimerKey) {
      case 'intervalRoundTime':
        return intervalRoundTime;
      case 'restTime':
        return restTime;
      case 'warmupTime':
        return warmupTime;
      default:
        return '';
    }
  };

  const getEditTimeSetter = (editTimerKey: EditTimerState) => {
    switch (editTimerKey) {
      case 'intervalRoundTime':
        return onChangeIntervalRoundTime;
      case 'restTime':
        return onChangeRestTime;
      case 'warmupTime':
        return onChangeWarmupTime;
      default:
        return () => {};
    }
  };

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
    triggerResetTimerFlag();

    navigation.goBack();
  };

  const isUpdateDisabled = isIntervalRoundCountError || !timerName || !intervalRoundCount || !intervalRoundTime || !restTime || !warmupTime;

  return (
    <View style={styles.screenContainer}>
      <TimerInputModal
        isOpen={isTimerInputModalOpen}
        setIsOpen={setIsTimerInputModalOpen}
        timeInSeconds={getEditTime(editTimerState)}
        setTimeInSeconds={getEditTimeSetter(editTimerState)}
        modalTitle={getTimerInputModalTitle(editTimerState)}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        persistentScrollbar={true}
      >
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
            {isIntervalRoundCountError && <Text style={styles.errorMessage}>Invalid, whole number above 0 required</Text>}
            <TextInput
              style={[styles.input, isIntervalRoundCountError && styles.errorInput]}
              onChangeText={(inputVal) => {
                let isValid = NUMBERS_ONLY_REGEX.test(inputVal) && Number(inputVal) > 0;
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
            <Text>Time Length Per Interval/Round:</Text>
            <TouchableOpacity
              style={[styles.input]}
              onPress={() => {
                setEditTimerState('intervalRoundTime');
                setIsTimerInputModalOpen(true);
              }}
            >
              {intervalRoundTime ? <Text>{formatTime(intervalRoundTime)}</Text> : <Text style={{ color: 'lightgrey' }}>Set Interval/Round Time</Text>}
            </TouchableOpacity>
          </View>
          <View>
            <Text>Rest Time Length:</Text>
            <TouchableOpacity
              style={[styles.input]}
              onPress={() => {
                setEditTimerState('restTime');
                setIsTimerInputModalOpen(true);
              }}
            >
              {restTime ? <Text>{formatTime(restTime)}</Text> : <Text style={{ color: 'lightgrey' }}>Number of seconds for rest</Text>}
            </TouchableOpacity>
          </View>
          <View>
            <Text>Warmup Time Length:</Text>
            <TouchableOpacity
              style={[styles.input]}
              onPress={() => {
                setEditTimerState('warmupTime');
                setIsTimerInputModalOpen(true);
              }}
            >
              {warmupTime ? <Text>{formatTime(warmupTime)}</Text> : <Text style={{ color: 'lightgrey' }}>Number of seconds for warmup</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.subcontentSection}>
        <Button
          title="Save Timer"
          onPress={updateSelectedTimer}
          isDisabled={isUpdateDisabled || isTimerUpdateLoading}
          style={{ color: 'green', borderColor: 'green' }}
          textStyle={{ color: 'green' }}
        />
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          isDisabled={isTimerUpdateLoading}
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
