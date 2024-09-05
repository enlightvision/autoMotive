import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import AMColors from '../Utils/AMColors';
import { fontNormalize } from '../Utils/AMConstant';

const AMThemeButton = (props) => {
    return (
        <Pressable style={[{ height:40, justifyContent:'center',borderRadius:30,width: "70%", backgroundColor: AMColors.primary, alignItems:'center' }, props.style]}
        onPress={props.onPress}
        pointerEvents={props.isLoading ? 'none' : 'auto'}
        >
            {props.isLoading ? 
            <ActivityIndicator color={AMColors.white} />
            :
            <Text style={[{color: AMColors.white, fontSize: fontNormalize(18)}, props.textStyle]}>{props.title}</Text>
        }
        </Pressable>
    );
};

export default AMThemeButton;

const style = StyleSheet.create({
    
})