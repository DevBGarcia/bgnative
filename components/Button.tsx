import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type ButtonProps = {
  onPress: () => void;
  title: string;
  style?: any;
  textStyle?: any;
  isDisabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ onPress, title, style, textStyle, isDisabled }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    disabled={isDisabled}
    style={[styles.button, style, isDisabled && styles.disabledTouchable]}
  >
    <Text style={[styles.text, textStyle, isDisabled && styles.disabledText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  disabledText: {
    color: 'lightgrey',
  },
  disabledTouchable: {
    color: 'grey',
    borderColor: 'grey',
  },
});
