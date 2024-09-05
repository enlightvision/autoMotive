import React, { createRef, useEffect, useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import AMAssets from '../Assets';
import AMTextInput from '../Components/AMTextInput';
import AMThemeButton from '../Components/AMThemeButton';
import { showDialogue } from '../Utils/AMAlert';
import AMColors from '../Utils/AMColors';
import { ACTIVE_DEACTIVE_USER, fontNormalize, LOGIN, PRIVACY_POLICY, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';

const LoginContainer = (props) => {

    const validationHelper = new ValidationHelper();

    const [contactNo, setContactNo] = useState("")
    const [shouldVisible, setShouldVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const onChangeContactNoHandler = (text) => {
        const numberRegex = /^\d+$/
        if (text.match(numberRegex) || text == "") {
            setShouldVisible(false)
            setContactNo(text)
        }
    }

    const onLoginValidationHandler = () => {
        setShouldVisible(true)
        if (validationHelper.mobileNumberValidation(contactNo).trim() !== "") {
            return
        } else {
            loginAPIAction()
        }
    }

    const loginAPIAction = () => {
        const param = {
            mobile: contactNo
        }
        setIsLoading(true)
        postApi(LOGIN, param, onSuccessLoginHandler, onFailureLoginHandler)
    }

    const onSuccessLoginHandler = (response) => {
        console.log("LOGIN SUCCESS :::::: ", response);
        // if (response.account == "deactive") {
        //     showDialogue("You are about to reactivate your account with us. Are you sure to proceed?",
        //         [{ "text": "No" }],
        //         "",
        //         accountActivate
        //     )
        // } else {
            props.navigation.navigate('otp',
                {
                    mobile: contactNo
                }
            )
        // }

        setIsLoading(false)
    }

    const onFailureLoginHandler = (error) => {
        console.log("LOGIN FAILURE ::: ", error);
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const accountActivate = () => {

        const param = {
            mobile: contactNo,
            action: "0"
        }
        setIsLoading(true)
        postApi(ACTIVE_DEACTIVE_USER, param, onSuccessUserActive, onFailureUserActive)
    }

    const onSuccessUserActive = (response) => {
        setIsLoading(false)
        loginAPIAction()
    }

    const onFailureUserActive = (error) => {
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: AMColors.white }} bounces={false} keyboardShouldPersistTaps={'always'}>
            <View style={{ flex: 1, backgroundColor: AMColors.primary }}>
                <Image source={AMAssets.logo} style={{ tintColor: AMColors.white, alignSelf: 'center', marginVertical: width * 0.12 }} />

                <View style={{ flex: 1, backgroundColor: AMColors.white, borderTopLeftRadius: 20, padding: 30 }}>
                    <Text style={{ fontFamily: AMFonts.Montserrat_Bold, fontSize: fontNormalize(25), color: AMColors.grey, marginVertical: 10 }}>{"Login"}</Text>

                    <AMTextInput
                        title={'Mobile Number'}
                        placeholder={'Enter your mobile number'}
                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'number-pad'}
                        onChangeText={onChangeContactNoHandler}
                        maxLength={10}
                        error={shouldVisible && validationHelper.mobileNumberValidation(contactNo).trim()}
                        onSubmitEditing={onLoginValidationHandler}
                        returnKeyType={'done'}
                    />

                    <AMThemeButton
                        title={'Login'}
                        style={{ alignSelf: 'center', marginTop: 20 }}
                        isLoading={isLoading}
                        onPress={onLoginValidationHandler}
                    />
                </View>

                <View style={{ backgroundColor: AMColors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                    <Text>{"By logging in, You agree to our "}</Text>
                    <Pressable
                        onPress={() => {
                            Linking.canOpenURL(PRIVACY_POLICY)
                                .then(data => {
                                    if (data) {
                                        Linking.openURL(PRIVACY_POLICY)
                                    }
                                }).catch(error => {

                                })
                        }}
                    ><Text style={{ color: AMColors.primary }}>{"Privacy Policy"}</Text></Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

export default LoginContainer;

const style = StyleSheet.create({

})