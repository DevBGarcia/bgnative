import React from 'react';
import { View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Timer } from '../components/Timer';

export const HomeScreen = () => {
    return (
        <View style={GlobalStyles.ScreenContainer}>
            <Timer/>
        </View>
    );
  };
