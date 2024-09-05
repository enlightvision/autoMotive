import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import AMColors from '../Utils/AMColors';

const AMProgressLoader = (props) => {
    return (
        <Modal visible={props.isVisible} transparent={true}>
            <View style={{flex:1, alignItems: 'center', backgroundColor: "rgba(0,0,0,0.2)", justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={AMColors.primary} />
            </View>
        </Modal>
    );
};

export default AMProgressLoader;

const style = StyleSheet.create({
    
})