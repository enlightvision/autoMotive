import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen';

const SplashContainer = (props) => {

    useEffect(() => {
        setTimeout(() => {
            // props.navigation.navigate('dashboard')
            props.navigation.reset({
                routes:[{name: 'main'}]
            })
            SplashScreen.hide()
        }, 3000)

    }, [])

    return (
        <View style={style.container}>
            

        </View>
    );
};

export default SplashContainer;

const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})