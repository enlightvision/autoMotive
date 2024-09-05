import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TextInput, ScrollView, StyleSheet, Platform, Linking, Share } from 'react-native'
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMPopupView from '../Components/AMPopupView';
import AMTextInput from '../Components/AMTextInput';
import AMThumbnailComponent from '../Components/AMThumbnailComponent';
import { saveUserDetailsInRedux, saveUserLoginInRedux, saveUserRegisterInRedux, saveUserTokenInRedux } from '../redux/Actions/User';
import { showDialogue, showSimpleDialogue } from '../Utils/AMAlert';
import AMColors from '../Utils/AMColors';
import { DELETE_USER, APP_NAME, fontNormalize, MAILTO, PRIVACY_POLICY, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { postApi } from '../Utils/ServiceManage';
import BaseContainer from './BaseContainer';

const DashboardContainer = (props) => {

    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const userDetail = useSelector(state => state)
    const userDispatch = useDispatch()

    const sideMenuArray = [
        {
            title: 'Home',
            Assets: AMAssets.menu_home
        },
        {
            title: 'Profile',
            Assets: AMAssets.menu_profile
        },
        {
            title: 'Contact Us',
            Assets: AMAssets.menu_contact
        },
        {
            title: 'Share App and Earn Points',
            Assets: AMAssets.menu_share
        },
        {
            title: 'Rate Us',
            Assets: AMAssets.menu_rating
        },
        {
            title: 'Privacy Policy',
            Assets: AMAssets.menu_policy
        },
        {
            title: 'Account Delete',
            Assets: AMAssets.deactivate_account
        }
    ]
    useEffect(() => {


    }, [])

    const accountDelete = () => {

        const param = {
            mobile: userDetail?.userOperation?.userDetail?.mobile
        }

        postApi(DELETE_USER,{}, onSuccessUserDelete, onFailureUserDelete, userDetail?.userOperation)
    }

    const onSuccessUserDelete = (response) => {

        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
        userDispatch(saveUserLoginInRedux(false))
        userDispatch(saveUserRegisterInRedux(false))
        userDispatch(saveUserTokenInRedux(""))
        userDispatch(saveUserDetailsInRedux({}))
        setIsOpenMenu(false)
    }

    const onFailureUserDelete = (error) => {

    }

    const onPressHandler = (value) => {

        const url = Platform.OS == 'ios' ? 'https://apps.apple.com/us/app/app-name/id1641164801' : "https://play.google.com/store/apps/details?id=com.oldautomotiveparts.www"

        switch (value) {
            case 0:
                setIsOpenMenu(false)
                break;
            case 1:
                setIsOpenMenu(false)
                if (checkIsUserLoggedIn()) {
                    props.navigation.navigate('profile')
                }
                break;
            case 2:
                Linking.canOpenURL(MAILTO).then(data => {
                    if (data) {
                        Linking.openURL(MAILTO)
                    } else {
                        showSimpleDialogue("Mail app is not configured on this device.")
                    }
                }).catch(error => {
                    showSimpleDialogue("Mail app is not configured on this device.")
                })
                break;
            case 3:
                Share.share({
                    message:
                        url,
                });
                break;
            case 4:
                Linking.canOpenURL(url).then(data => {
                    if (data)
                        Linking.openURL(url)
                }).catch(error => {

                })
                break;
            case 5:
                Linking.canOpenURL(PRIVACY_POLICY).then(data => {
                    if (data) {
                        Linking.openURL(PRIVACY_POLICY)
                    }
                }).catch(error => {

                })
                break;
            case 6:
                showDialogue("All data from your account will be erased, are you sure to delete your account?",
                [{ "text": "No" }],
                "",
                accountDelete
                )
                break;
            default:
                break;
        }
    }

    const onBusActionClick = () => {
        Snackbar.show({
            text: "Coming soon",
            duration: Snackbar.LENGTH_LONG,
        });

    }

    const onAutoActionClick = () => {
        Snackbar.show({
            text: "Coming soon",
            duration: Snackbar.LENGTH_LONG,
        });

    }

    const onBikeActionClick = () => {
        Snackbar.show({
            text: "Coming soon",
            duration: Snackbar.LENGTH_LONG,
        });

    }
    const onCarActionClick = () => {
        props.navigation.navigate('posttypedashboard')

    }
    const onMultiAxelActionClick = () => {
        Snackbar.show({
            text: "Coming soon",
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onLoginLogoutAction = () => {
        if (userDetail?.userOperation?.isLogin) {
            showDialogue("Are you sure want to logout?", [{ "text": "No" }], APP_NAME, () => {
                userDispatch(saveUserLoginInRedux(false))
                userDispatch(saveUserRegisterInRedux(false))
                userDispatch(saveUserTokenInRedux(""))
                userDispatch(saveUserDetailsInRedux({}))
            })

        } else {
            props.navigation.navigate('login')
        }
        setIsOpenMenu(false)
    }

    const checkIsUserLoggedIn = () => {
        if (!userDetail?.userOperation?.isLogin) {
            props.navigation.navigate('login')
            return false
        } else if (!userDetail?.userOperation?.isRegister) {
            props.navigation.navigate('registration')
            return false
        }
        return true
    }

    const sideMenuRender = () => {
        return (
            <AMPopupView isVisible={isOpenMenu}>
                <View style={{ flex: 1, backgroundColor: AMColors.white }}>
                    <View style={{ flex: 1, paddingHorizontal: 25, marginTop: 30 }}>
                        <Pressable style={{ alignSelf: 'flex-start' }}
                            onPress={() => setIsOpenMenu(false)}
                        >
                            <Icon name='arrow-back' color={AMColors.primary} />
                        </Pressable>
                        <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(18), marginLeft: 5, color: AMColors.grey, marginVertical: 20 }}>{"Menu"}</Text>
                        <ScrollView>
                            {sideMenuArray.map((item, index) => {
                                return index == 6 && !userDetail?.userOperation?.isLogin ? null : (
                                    
                                    <View style={{ marginLeft: 5 }} key={index}>
                                        <Pressable
                                            style={{
                                                flexDirection: 'row',
                                                paddingVertical: 15,
                                                alignItems: 'center'
                                            }}
                                            onPress={() => { onPressHandler(index) }}
                                        >
                                            <Image source={item.Assets} style={{ tintColor: AMColors.primary, marginRight: 30, width: 20, height: 20 }} resizeMode={'contain'} />
                                            <Text style={{ fontFamily: AMFonts.SFProDisplay_Medium, fontSize: fontNormalize(18), color: index == 0 ? AMColors.primary : AMColors.light_Grey }}>{item.title}</Text>
                                        </Pressable>
                                        <View style={{ marginLeft: 50, borderWidth: 0.5, borderColor: AMColors.primary }} />
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>

                    <View style={{ borderTopWidth: 1, borderTopColor: AMColors.primary }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 30 }}
                            onPress={onLoginLogoutAction}
                        >
                            <Image source={AMAssets.menu_login} style={{ tintColor: AMColors.primary, marginHorizontal: 30 }} />
                            <Text style={{ color: AMColors.light_Grey, fontFamily: AMFonts.SFProDisplay_Medium, fontSize: fontNormalize(25) }}>{userDetail?.userOperation?.isLogin ? "Logout" : "Login"}</Text>
                        </Pressable>
                    </View>
                </View>
            </AMPopupView>
        )
    }

    console.log("Redux data :::: ", userDetail);

    return (
        <BaseContainer
            leftComponent={
                <Pressable onPress={() => {
                    setIsOpenMenu(true)
                }}>
                    <Image source={AMAssets.menu} />
                </Pressable>
            }
            rightComponent={
                <Pressable
                    onPress={() => onPressHandler(1)}
                >
                    <Image source={AMAssets.menu_profile} />
                </Pressable>
            }
        >
            <View style={style.flexStyle}>
                {sideMenuRender()}
                <ScrollView contentContainerStyle={style.scrollContainerStyle}>

                    <Text style={style.welcomeTxt}>{"Welcome,"}</Text>
                    <Text style={style.nameStyle}>{userDetail?.userOperation?.userDetail?.name ?? "Guest user"}</Text>

                    <Pressable style={style.fullThumbnail}
                        onPress={onCarActionClick}
                    >
                        <View style={{ alignItems: "center", marginHorizontal: 15 }}>
                            <Image source={AMAssets.car_outline} />
                            <Text style={style.postTitle}>{"CAR"}</Text>
                        </View>

                        <Image style={{ height: '80%' }} resizeMode={'contain'} source={AMAssets.machine_icon} />
                    </Pressable>

                    <View style={style.parentThumbnail}>
                        <ThumbnailRender
                            title={"BIKE"}
                            source={AMAssets.bike_outline}
                            onClickThumbnail={onBikeActionClick}
                        />
                        <ThumbnailRender
                            title={"BUS/TRUCK"}
                            source={AMAssets.bus_outline}
                            onClickThumbnail={onBusActionClick}
                        />
                    </View>

                    <View style={style.parentThumbnail}>

                        <ThumbnailRender
                            title={"MULTI AXEL"}
                            source={AMAssets.Dump_truck}
                            onClickThumbnail={onMultiAxelActionClick}
                        />
                        <ThumbnailRender
                            title={"AUTO"}
                            source={AMAssets.autorikshw_outline}
                            onClickThumbnail={onAutoActionClick}
                        />
                    </View>
                </ScrollView>
            </View>
        </BaseContainer>
    );
};

export default DashboardContainer;

export const ThumbnailRender = (props) => {

    const onClickItem = () => {
        if (props.onClickThumbnail) {
            props.onClickThumbnail()
        }
    }
    return (
        <Pressable style={style.thumbnail}
            onPress={onClickItem}
        >
            <Image source={props.source} />
            <Text style={style.postTitle}>{props.title}</Text>
        </Pressable>
    )
}

const style = StyleSheet.create({
    flexStyle: { flex: 1 },
    scrollContainerStyle: { paddingHorizontal: 30, paddingBottom: 30 },
    welcomeTxt: { fontSize: fontNormalize(40), color: AMColors.grey, fontFamily: AMFonts.SFProDisplay_Bold },
    nameStyle: { fontSize: fontNormalize(18), fontFamily: AMFonts.SFProDisplay_Bold, marginBottom: 10, color: AMColors.primary },
    postTitle: { fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(25), color: AMColors.primary },
    postDescStyle: { fontFamily: AMFonts.Montserrat_Regular, color: AMColors.light_Grey, fontSize: fontNormalize(15) },
    fullThumbnail: { width: "100%", height: (width * 0.5) - 35, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, backgroundColor: AMColors.light_primary, padding: 10, borderRadius: 10 },
    parentThumbnail: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    thumbnail: { width: (width * 0.5) - 35, height: (width * 0.5) - 35, justifyContent: 'center', alignItems: 'center', backgroundColor: AMColors.light_primary, padding: 15, borderRadius: 10 }
})