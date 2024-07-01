import React from 'react';
import { View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import IconButton from '../components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigators/TimersNavigator';

export const TimerEditScreen = () => {

    const navigation = useNavigation<StackNavigationProp<StackParamList>>();

    return(
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
        </View>
    );
};