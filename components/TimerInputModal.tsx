import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import { LinearGradient } from 'react-native-linear-gradient'; // or `import LinearGradient from "react-native-linear-gradient"`

export type TimerInputModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  timeInSeconds: any;
  setTimeInSeconds: (timeInSeconds: any) => void;
  modalTitle?: string;
};

export const TimerInputModal: React.FC<TimerInputModalProps> = ({ isOpen, setIsOpen, timeInSeconds, setTimeInSeconds, modalTitle }) => {
  const [initialValue, setInitialValue] = useState(convertToTimeObject(timeInSeconds));

  useEffect(() => {
    setInitialValue(convertToTimeObject(timeInSeconds));
  }, [timeInSeconds]);

  function convertToSeconds({ minutes, seconds }: { minutes: number; seconds: number }): number {
    return minutes * 60 + seconds;
  }

  function convertToTimeObject(totalSeconds: number): { minutes: number; seconds: number } {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  }

  return (
    <View style={{ backgroundColor: '#F1F1F1', alignItems: 'center', justifyContent: 'center' }}>
      <TimerPickerModal
        visible={isOpen}
        setIsVisible={setIsOpen}
        onConfirm={(pickedDuration) => {
          let timeConvertedToSeconds = convertToSeconds(pickedDuration);
          setTimeInSeconds(timeConvertedToSeconds);
          setIsOpen(false);
        }}
        initialValue={initialValue}
        modalTitle={modalTitle || 'Set Timer'}
        onCancel={() => setIsOpen(false)}
        closeOnOverlayPress
        use12HourPicker
        // Audio={Audio}
        // supply your own custom click sound asset
        // clickSoundAsset={require("./assets/custom_click.mp3")}
        LinearGradient={LinearGradient}
        hoursPickerIsDisabled
        hideHours
        styles={{
          theme: 'light',
        }}
        padHoursWithZero
        padMinutesWithZero
        padSecondsWithZero
      />
    </View>
  );
};
