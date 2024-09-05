import React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AMProgressLoader from '../Components/AMProgressLoader';
import NavBar from '../Components/NavBar';
import AMColors from '../Utils/AMColors';

const BaseContainer = (props) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AMColors.white }}>
            <View style={{ flex: 1 }} pointerEvents={props.isLoading ? 'none' : 'auto'}>
                <NavBar
                    leftComponent={props.leftComponent}
                    rightComponent={props.rightComponent}
                    onLeftPress={props.onLeftPress}
                    title={props.title}
                />
                {props.isLoading ? <AMProgressLoader isVisible={props.isLoading}/>: null}
                {props.children}
            </View>
        </SafeAreaView>
    );
};

export default BaseContainer;