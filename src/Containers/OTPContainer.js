import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useDispatch } from 'react-redux';
import AMAssets from '../Assets';
import AMTextInput from '../Components/AMTextInput';
import AMThemeButton from '../Components/AMThemeButton';
import { saveUserDetailsInRedux, saveUserLoginInRedux, saveUserRegisterInRedux, saveUserTokenInRedux } from '../redux/Actions/User';
import AMColors from '../Utils/AMColors';
import { fontNormalize, LOGIN, OTP_VERIFY, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';

const OTPContainer = (props) => {

    const validationHelper = new ValidationHelper();
    const [otp, setOTP] = useState("")
    const [shouldVisible, setShouldVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const userDispatch = useDispatch()


    const onChangeOTPHandler = (text) => {
        const numberRegex = /^\d+$/
        if (text.match(numberRegex) || text == "") {
            setOTP(text)
        }
        setShouldVisible(false)
    }

    const OTPValidationHandler = () => {
        if (validationHelper.isEmptyValidation(otp, "Please enter OTP").trim() !== "") {
            return
        } else {
            OTPAPIHandler()
        }
    }

    const OTPAPIHandler = () => {

        const params = {
            mobile: props?.route?.params?.mobile,
            otp: otp
        }
        setIsLoading(true)
        postApi(OTP_VERIFY, params, onSuccessOTPVerification, onFailureOTPVerification)
    }

    const onSuccessOTPVerification = (response) => {
        setIsLoading(false)
        userDispatch(saveUserTokenInRedux(response?.token))
        userDispatch(saveUserLoginInRedux(true))
        userDispatch(saveUserDetailsInRedux(response?.data))
        if (response.updateProfile) {
            // props.navigation.popToTop()
            props.navigation.pop(2)
            userDispatch(saveUserRegisterInRedux(true))
        } else {
            props.navigation.navigate('registration',
            {
                mobile:props?.route?.params?.mobile
            })
        }
    }

    const onFailureOTPVerification = (error) => {
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const loginAPIAction = () => {
        const param = {
            mobile: props?.route?.params?.mobile
        }
        // setIsLoading(true)
        postApi(LOGIN, param, onSuccessLoginHandler, onFailureLoginHandler)
    }

    const onSuccessLoginHandler = (response) => {
        console.log("LOGIN SUCCESS :::::: ", response);
        // setIsLoading(false)
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onFailureLoginHandler = (error) => {
        console.log("LOGIN FAILURE ::: ", error);

    }

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: AMColors.white }} bounces={false} keyboardShouldPersistTaps={'always'}>
        <View style={{ flex: 1, backgroundColor: AMColors.primary }}>
            <Image source={AMAssets.logo} style={{ tintColor: AMColors.white, alignSelf: 'center', marginVertical: width * 0.12 }} />

            <View style={{ flex: 1, backgroundColor: AMColors.white, borderTopLeftRadius: 20, padding: 30 }}>
                <Text style={{ fontFamily: AMFonts.Montserrat_Bold, fontSize: fontNormalize(25), color: AMColors.grey, marginVertical: 10 }}>{"OTP Verification"}</Text>

                <Text style={{ fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(15), color: AMColors.grey, marginVertical: 20 }}>{"We send an OTP via SMS on: "}<Text style={{ color: AMColors.primary }}>{props?.route?.params?.mobile ?? ""}</Text></Text>
                <AMTextInput
                    value={otp}
                    title={'One Time Password'}
                    placeholder={'Enter OTP'}
                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'number-pad'}
                    onChangeText={onChangeOTPHandler}
                    maxLength={6}
                    error={shouldVisible && validationHelper.isEmptyValidation(otp, "Please enter OTP").trim()}
                    onSubmitEditing={OTPValidationHandler}
                    returnKeyType={'done'}
                />

                <AMThemeButton
                    title={'Verify'}
                    style={{ alignSelf: 'center', marginTop: 20 }}
                    isLoading={isLoading}
                    onPress={OTPValidationHandler}
                />
                <View style={{ alignSelf: 'center', marginVertical: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(20)}}>{"Didn't Receive? "}</Text>
                        <Pressable onPress={loginAPIAction}>
                            <Text style={{ color: AMColors.primary, fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(20) }}>{"Resend"}</Text>
                        </Pressable>
                    </View>
                    <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(20), marginVertical: 10 }}>{"OR"}</Text>

                    <Pressable onPress={navigateToBack}>
                        <Text style={{ color: AMColors.primary, fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(20) }}>{"Change Number"}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={{ backgroundColor: AMColors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                <Text>{"Powered By, "}</Text>
                <Pressable><Text style={{ color: AMColors.primary }}>{"Old Automotive Parts"}</Text></Pressable>
            </View>
        </View>
        </ScrollView>
    );
};

export default OTPContainer;

const style = StyleSheet.create({
    
})