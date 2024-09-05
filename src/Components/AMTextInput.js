import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View, Pressable, Text, TextInput, StyleSheet, Keyboard } from 'react-native'
import AMColors from '../Utils/AMColors';
import { fontNormalize } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';

const AMTextInput = (props) => {

    
    return (
        <View style={[{ marginTop: 5 }, props.containerStyle]}>
            <Text style={{ color: AMColors.primary, fontFamily: AMFonts.Montserrat_Regular, marginVertical: 5 }}>{props.title}
                {props.isDisableMendatory ? "" : <Text style={{ fontSize: fontNormalize(20) }}>*</Text>}</Text>
            <View style={{ borderWidth: 1, borderColor: AMColors.primary, padding: 10, borderRadius: 10 }}>
                <TextInput
                    ref={props.inputRef}
                    value={props.value}
                    style={[{ height: props.multiline ? 100 : 40, fontFamily: props.multiline ? AMFonts.Montserrat_Regular : AMFonts.Gotham_Book, fontSize: fontNormalize(15), color: AMColors.black }, props.style]}
                    keyboardType={props.keyboardType ?? 'default'}
                    placeholder={props.placeholder}
                    placeholderTextColor={AMColors.light_Grey}
                    onChangeText={props.onChangeText}
                    multiline={props.multiline}
                    editable={props.editable ?? true}
                    onLayout={props.onLayout}
                    maxLength={props.maxLength}
                    onSubmitEditing={props.onSubmitEditing}
                    returnKeyType={props.returnKeyType}
                />
            </View>
            {props.error ?
                <Text style={{ color: AMColors.red, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12) }}>{props.error}</Text>
                : null}
        </View>
    );
};

export default AMTextInput;

const style = StyleSheet.create({

})