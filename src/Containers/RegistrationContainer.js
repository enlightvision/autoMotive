import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import AMTextInput from '../Components/AMTextInput';
import AMThemeButton from '../Components/AMThemeButton';
import { saveUserDetailsInRedux, saveUserRegisterInRedux } from '../redux/Actions/User';
import AMColors from '../Utils/AMColors';
import { fontNormalize, REGISTRATION, UPDATE_PROFILE, USER_PROFILE } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { getApi, postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const RegistrationContainer = (props) => {

    const validationHelper = new ValidationHelper();
    const userDetail = useSelector(state => state)
    const nameRef = useRef(null)
    const shopNameRef = useRef(null)
    const contactNoRef = useRef(null)
    const emailIdRef = useRef(null)
    const addressRef = useRef(null)
    const stateStrRef = useRef(null)
    const cityRef = useRef(null)
    const areaRef = useRef(null)
    const landmarkRef = useRef(null)
    const zipCodeRef = useRef(null)
    const userDispatch = useDispatch()

    const [name, setName] = useState(userDetail?.userOperation?.userDetail?.name ?? "")
    const [shopName, setShopName] = useState(userDetail?.userOperation?.userDetail?.shopName ?? "")
    const [contactNo, setContactNo] = useState(props?.route?.params?.mobile ?? userDetail?.userOperation?.userDetail?.mobile ?? "")
    const [emailId, setEmailId] = useState(userDetail?.userOperation?.userDetail?.email ?? "")
    const [address, setAddress] = useState(userDetail?.userOperation?.userDetail?.address ?? "")
    const [statestr, setState] = useState(userDetail?.userOperation?.userDetail?.state ?? "")
    const [city, setCity] = useState(userDetail?.userOperation?.userDetail?.city ?? "")
    const [area, setArea] = useState(userDetail?.userOperation?.userDetail?.area ?? "")
    const [landmark, setLandmark] = useState(userDetail?.userOperation?.userDetail?.landmark ?? "")
    const [zipCode, setZipcode] = useState(userDetail?.userOperation?.userDetail?.zipcode ?? "")
    const [shouldVisible, setShouldVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        nameRef.current.focus()
    }, [])

    const validationHandler = () => {
        setShouldVisible(true)
        if (
            validationHelper.isEmptyValidation(name, "Please enter name").trim() !== "" ||
            validationHelper.isEmptyValidation(shopName, "Please enter shopname").trim() !== "" ||
            // validationHelper.mobileNumberValidation(contactNo).trim() !== "" ||
            validationHelper.emailValidation(emailId).trim() !== "" ||
            validationHelper.isEmptyValidation(address, "Please enter address").trim() !== "" ||
            validationHelper.isEmptyValidation(statestr, "Please enter state").trim() !== "" ||
            validationHelper.isEmptyValidation(city, "Please enter city").trim() !== "" ||
            validationHelper.isEmptyValidation(area, "Please enter area").trim() !== "" ||
            validationHelper.isEmptyValidation(landmark, "Please enter landmark").trim() !== "" ||
            validationHelper.isEmptyValidation(zipCode, "Please enter zipCode").trim() !== ""
        ) {
            return
        } else {
            if (props?.route?.params?.isProfileUpdate) {
                onUpdateProfileHandler()
            } else {
                registrationAPIAction()
            }
        }
    }

    const onUpdateProfileHandler = () => {
        const param = {
            name: name,
            email: emailId,
            shopName: shopName,
            location: landmark,
            city: city,
            state: statestr,
            area: area,
            landmark: landmark,
            zipcode: zipCode,
            address: address
        }
        setIsLoading(true)
        postApi(UPDATE_PROFILE, param, onSuccessProfileUpdate, onFailureProfileUpdate, userDetail?.userOperation)
    }

    const onSuccessProfileUpdate = (response) => {
        setIsLoading(false)
        props.navigation.goBack()
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const onFailureProfileUpdate = (error) => {
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const registrationAPIAction = () => {
        const param = {
            name: name,
            email: emailId,
            shopName: shopName,
            location: landmark,
            city: city,
            state: statestr,
            area: area,
            landmark: landmark,
            zipcode: zipCode,
            //    image:"1653280367images.jpg",
            //    shopPhoto:"1653280397download.jpg",
            address: address
        }
        setIsLoading(true)
        postApi(REGISTRATION, param, onSuccessRegistration, onFailureRegistration, userDetail?.userOperation)
    }

    const onSuccessRegistration = (response) => {
        userDispatch(saveUserRegisterInRedux(true))
        // props.navigation.popToTop()
        props.navigation.pop(3)
        getUserProfile()
        setIsLoading(false)
    }

    const onFailureRegistration = (error) => {
        setIsLoading(false)
    }

    const getUserProfile = () => {
        getApi(USER_PROFILE, onSuccessUserProfile, onFailureUserProfile, userDetail?.userOperation)
    }

    const onSuccessUserProfile = (response) => {
        userDispatch(saveUserDetailsInRedux(response?.data))
    }

    const onFailureUserProfile = (error) => {
    }

    const onChangeNameHandler = (text) => {
        setShouldVisible(false)
        setName(text)
    }

    const onChangeShopNameHandler = (text) => {
        setShouldVisible(false)
        setShopName(text)
    }

    const onChangeContactNoHandler = (text) => {
        setShouldVisible(false)
        setContactNo(text)
    }

    const onChangeEmailIdHandler = (text) => {
        setShouldVisible(false)
        setEmailId(text)
    }

    const onChangeAddressHandler = (text) => {
        setShouldVisible(false)
        setAddress(text)
    }

    const onChangeStateHandler = (text) => {
        setShouldVisible(false)
        setState(text)
    }

    const onChangeCityHandler = (text) => {
        setShouldVisible(false)
        setCity(text)
    }

    const onChangeAreaHandler = (text) => {
        setShouldVisible(false)
        setArea(text)
    }

    const onChangeLandmarkHandler = (text) => {
        setShouldVisible(false)
        setLandmark(text)
    }

    const onChangeZipcodeHandler = (text) => {
        setShouldVisible(false)
        const numberRegex = /^\d+$/
        if (text.match(numberRegex) || text == "") {
            setZipcode(text)
        }
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            title={"Update profile"}
        >
            <View style={style.containerStyle}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                    {/* <Text style={style.titleStyle}>{"Update profile"}</Text> */}

                    <AMTextInput
                        title={'Name'}
                        inputRef={nameRef}
                        value={name}
                        onChangeText={onChangeNameHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(name, "Please enter name").trim()}
                        onSubmitEditing={()=>{shopNameRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Shop/Firm name'}
                        inputRef={shopNameRef}
                        value={shopName}
                        onChangeText={onChangeShopNameHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(shopName, "Please enter shopname").trim()}
                        onSubmitEditing={()=>{contactNoRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Contact No.'}
                        inputRef={contactNoRef}
                        value={contactNo}
                        onChangeText={onChangeContactNoHandler}
                        keyboardType={'number-pad'}
                        editable={false}
                        maxLength={10}
                        onSubmitEditing={()=>{emailIdRef.current.focus()}}
                    // error={shouldVisible && validationHelper.mobileNumberValidation(contactNo).trim()}
                    />
                    <AMTextInput
                        title={'E-mail ID'}
                        inputRef={emailIdRef}
                        value={emailId}
                        onChangeText={onChangeEmailIdHandler}
                        keyboardType={'email-address'}
                        error={shouldVisible && validationHelper.emailValidation(emailId).trim()}
                        onSubmitEditing={()=>{addressRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Address'}
                        inputRef={addressRef}
                        multiline
                        style={{ textAlignVertical: "top" }}
                        value={address}
                        onChangeText={onChangeAddressHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(address, "Please enter address").trim()}
                        onSubmitEditing={()=>{stateStrRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'State'}
                        inputRef={stateStrRef}
                        value={statestr}
                        onChangeText={onChangeStateHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(statestr, "Please enter state").trim()}
                        onSubmitEditing={()=>{cityRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'City'}
                        inputRef={cityRef}
                        value={city}
                        onChangeText={onChangeCityHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(city, "Please enter city").trim()}
                        onSubmitEditing={()=>{areaRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Area'}
                        inputRef={areaRef}
                        value={area}
                        onChangeText={onChangeAreaHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(area, "Please enter area").trim()}
                        onSubmitEditing={()=>{landmarkRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Landmark'}
                        inputRef={landmarkRef}
                        value={landmark}
                        onChangeText={onChangeLandmarkHandler}
                        error={shouldVisible && validationHelper.isEmptyValidation(landmark, "Please enter landmark").trim()}
                        onSubmitEditing={()=>{zipCodeRef.current.focus()}}
                    />
                    <AMTextInput
                        title={'Zipcode'}
                        inputRef={zipCodeRef}
                        value={zipCode}
                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'number-pad'}
                        onChangeText={onChangeZipcodeHandler}
                        maxLength={6}
                        error={shouldVisible && validationHelper.isEmptyValidation(zipCode, "Please enter zipCode").trim()}
                        onSubmitEditing={validationHandler}
                    />

                    <AMThemeButton
                        title={'Update'}
                        style={style.themeButtonStyle}
                        onPress={validationHandler}
                        isLoading={isLoading}
                    />
                </KeyboardAwareScrollView>
            </View>
        </BaseContainer>
    );
};

export default RegistrationContainer;

const style = StyleSheet.create({
    containerStyle: { flex: 1, paddingHorizontal: 30 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, marginBottom: 20, fontSize: fontNormalize(20), color: AMColors.grey },
    themeButtonStyle: { alignSelf: 'center', marginVertical: 30 }
})