import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMPartsDetailList from '../Components/AMPartsDetailList';
import AMProfilePostList from '../Components/AMProfilePostList';
import AMTextInput from '../Components/AMTextInput';
import AMThemeButton from '../Components/AMThemeButton';
import { saveUserDetailsInRedux } from '../redux/Actions/User';
import AMColors from '../Utils/AMColors';
import { APP_NAME, DELETE_SELL_POST, fontNormalize, UPDATE_PROFILE, USER_PROFILE } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { deleteApi, getApi, postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const ProfileCon = (props) => {

    const validationHelper = new ValidationHelper();
    const userDetail = useSelector(state => state)
    const userDispatch = useDispatch()
    const nameRef = useRef(null)

    const [name, setName] = useState(userDetail?.userOperation?.userDetail?.name ?? "")
    const [email, setEmail] = useState(userDetail?.userOperation?.userDetail?.email ?? "")
    const [mobile, setMobile] = useState(userDetail?.userOperation?.userDetail?.mobile ?? "")
    const [address, setAddress] = useState(userDetail?.userOperation?.userDetail?.address ?? "")
    const [city, setCity] = useState("")
    const [productList, setProductList] = useState([])

    const [shouldVisible, setShouldVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            getUserProfile()
        }, [])
    )

    const getUserProfile = () => {
        getApi(USER_PROFILE, onSuccessUserProfile, onFailureUserProfile, userDetail?.userOperation)
    }

    const onSuccessUserProfile = (response) => {
        setName(response?.data?.name)
        setAddress(response?.data?.address)
        setEmail(response?.data?.email)
        setMobile(response?.data?.mobile)
        setProductList(response?.yourProducts)
        setCity(response?.data?.city)
        userDispatch(saveUserDetailsInRedux(response?.data))
    }

    const onFailureUserProfile = (error) => {
    }

    const onUpdateProfileHandler = () => {
        const param = {
            name: name,
            email: email,
            address: address
        }
        setIsLoading(true)
        postApi(UPDATE_PROFILE, param, onSuccessProfileUpdate, onFailureProfileUpdate, userDetail?.userOperation)
    }

    const onSuccessProfileUpdate = (response) => {
        setIsLoading(false)
        getUserProfile()
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

    const deletePostAction = (data) => {
        deleteApi(DELETE_SELL_POST + data.id, onSuccessDeletePost, onFailureDeletePost, userDetail?.userOperation)
    }

    const onSuccessDeletePost = (response) => {
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onFailureDeletePost = (error) => {
    }

    const onChangeNameHandler = (text) => {
        setShouldVisible(false)
        setName(text)
    }

    const onChangeEmailIdHandler = (text) => {
        setShouldVisible(false)
        setEmail(text)
    }

    const onChangeAddressHandler = (text) => {
        setShouldVisible(false)
        setAddress(text)
    }

    const updateProfileValidation = () => {
        setShouldVisible(true)
        if (
            validationHelper.isEmptyValidation(name, "Please enter name").trim() !== "" ||
            validationHelper.emailValidation(email).trim() !== "" ||
            validationHelper.isEmptyValidation(address, "Please enter address").trim() !== ""
        ) {
            return
        } else {
            onUpdateProfileHandler()
        }
    }

    const navigateToEdit = (item) => {
        console.log("::: ITEM :: ", item);
        props.navigation.navigate('partsdetail', {
            postData: item,
            isUrgent: item.urgentSell,
            // isPartsImageEnable: true,
            isEditable: true
        })
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    const navigateToProfileUpdate = () => {
        props.navigation.navigate('registration',
            {
                isProfileUpdate: true
            }
        )
    }

    const rightComponentRender = () => {
        return (
            <Pressable hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
                onPress={navigateToProfileUpdate}
            >
                <Icon type='ionicon' name='create-outline' color={AMColors.primary} size={25} />
            </Pressable>
        )
    }
    
    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            rightComponent={rightComponentRender()}
        >

            <View style={style.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.userDetailView}>
                        <AMTextInput inputRef={nameRef} title={'Name'} value={name} onChangeText={onChangeNameHandler} editable={false}
                            error={shouldVisible && validationHelper.isEmptyValidation(name, "Please enter name").trim()}
                        />
                        <AMTextInput title={'Email ID'} value={email} onChangeText={onChangeEmailIdHandler} editable={false}
                            error={shouldVisible && validationHelper.emailValidation(email).trim()}
                        />
                        <AMTextInput title={'Mobile No.'} value={mobile} editable={false} />
                        <AMTextInput title={'Address'} style={{ textAlignVertical: "top" }} multiline value={address} onChangeText={onChangeAddressHandler} editable={false}
                            error={shouldVisible && validationHelper.isEmptyValidation(address, "Please enter address").trim()}
                        />
                    </View>

                    <View style={style.titleView}>
                        <Text style={style.titleStyle}>{"My product list"}</Text>
                        <Pressable style={{backgroundColor: AMColors.primary, padding:8, borderRadius:20}}>
                        <Image source={AMAssets.search} style={{tintColor:AMColors.white, width: 16, height: 16}}/>
                        </Pressable>

                    </View>
                    {productList.length !== 0 ?
                        <AMProfilePostList isEditable listData={productList} onClickEdit={navigateToEdit} onClickDelete={deletePostAction} userCity={city} />
                        :
                        <Text style={style.noDataFound}>{"No data found"}</Text>
                    }
                </ScrollView>
            </View>
        </BaseContainer>
    );
};

export default ProfileCon;

const style = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    userDetailView: { backgroundColor: AMColors.light_primary, padding: 15, borderRadius: 10 },
    titleView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 30, marginHorizontal: 15 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.grey, fontSize: fontNormalize(27) },
    noDataFound: { fontFamily: AMFonts.Montserrat_SemiBold, color: AMColors.primary, fontSize: fontNormalize(15), textAlign: 'center' }
})