import React from 'react';
import { View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Timer } from '../components/Timer';

export const TimerScreen = () => {
    return (
        <View style={GlobalStyles.screenContainer}>
            <Timer/>
        </View>
    );
  };
