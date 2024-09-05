import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AMColors from '../Utils/AMColors';

const AMPopupView = (props) => {

    const onRequestClose = () => {
        if (props.onRequestClose !== undefined) {
            props.onRequestClose()
        }
    }

    return (
        
        <Modal visible={props.isVisible} animationType={'slide'} transparent onRequestClose={onRequestClose}>
            <SafeAreaView style={{flex:1}}>
            <View style={[style.container, props.style]}>
                {props.children}
            </View>
            </SafeAreaView>
        </Modal>
        
    );
};

export default AMPopupView;

const style = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center', 
        // justifyContent: 'center',
        backgroundColor: AMColors.light_black
    },
    blurStyle: {
        // alignItems:'center',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})