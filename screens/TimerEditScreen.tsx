import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigators/TimersNavigator';

export const TimerEditScreen = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

  return (
    <View style={GlobalStyles.screenContainer}>
      <View style={GlobalStyles.backButtonStyle}>
        <IconButton
          IconButtonIconProps={{
            name: 'keyboard-backspace',
          }}
          IconButtonTouchableOpacityProps={{
            onPress: () => navigation.goBack(),
          }}
        />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless placeholder"
        keyboardType="numeric"
        placeholderTextColor={'grey'}
      />
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
  },
});
