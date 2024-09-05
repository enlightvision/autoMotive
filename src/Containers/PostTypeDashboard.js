import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AMAssets from '../Assets';
import AMThumbnailComponent from '../Components/AMThumbnailComponent';
import AMColors from '../Utils/AMColors';
import { fontNormalize, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import BaseContainer from './BaseContainer';

const PostTypeDashboard = (props) => {

    const userDetail = useSelector(state => state)
    const userDispatch = useDispatch()

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
    const onSellActionClick = () => {
        if (checkIsUserLoggedIn()) {
            props.navigation.navigate('choosecarbrand',
                {
                    type: 'sell',
                    // isPartsImageEnable: true
                }
            )
        }

    }

    const onBuyActionClick = () => {
        if (checkIsUserLoggedIn()) {
            props.navigation.navigate('choosecarbrand',
                {
                    type: 'purchase'
                }
            )

        }

    }
    const onUrgentActionClick = () => {
        if (checkIsUserLoggedIn()) {
            props.navigation.navigate('choosecarbrand',
                {
                    type: 'sell',
                    isUrgent: "1",
                    // isPartsImageEnable: true
                }
            )
        }

    }
    const onPostActionClick = () => {
        Snackbar.show({
            text: "Coming soon",
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onProfileActionClick = () => {
        if(checkIsUserLoggedIn()){
            props.navigation.navigate('profile')
        }
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            rightComponent={
                <Pressable
                    onPress={onProfileActionClick}
                >
                    <Image source={AMAssets.menu_profile} />
                </Pressable>
            }
        >
            <View style={style.flexStyle}>
                <ScrollView contentContainerStyle={style.scrollContainerStyle}>

                    <Text style={style.welcomeTxt}>{"Welcome,"}</Text>
                    <Text style={style.nameStyle}>{userDetail?.userOperation?.userDetail?.name ?? "Guest user"}</Text>

                    <View style={style.parentThumbnail}>
                        <AMThumbnailComponent
                            title={"SELL"}
                            description={"Car Parts"}
                            source={AMAssets.home_sale}
                            onClickThumbnail={onSellActionClick}
                        />
                        <AMThumbnailComponent
                            title={"BUY"}
                            description={"Car Parts"}
                            source={AMAssets.home_buy}
                            onClickThumbnail={onBuyActionClick}
                        />
                    </View>

                    <Pressable style={style.fullThumbnail}
                        onPress={onUrgentActionClick}
                    >
                        <View style={{ flex: 1 }}>
                            <Image style={{ marginTop: 40 }} source={AMAssets.home_urgent} />
                            <Text style={style.postTitle} numberOfLines={1}>{"URGENTLY"}</Text>
                            <Text style={style.postDescStyle}>{"Required car parts"}</Text>
                        </View>

                        <Image style={{ height: wp("22%") }} resizeMode={'contain'} source={AMAssets.home_urgent_parts} />
                    </Pressable>

                    <View style={style.parentThumbnail}>
                        <AMThumbnailComponent
                            title={"POST"}
                            description={"Parts to be sold urgently"}
                            onClickThumbnail={onPostActionClick}
                        />
                        <AMThumbnailComponent
                            title={"LIST"}
                            description={"Of urgently Required Part"}
                            onClickThumbnail={() => {
                                props.navigation.navigate('listrequireparts',
                                    {
                                        isUrgentDisable: true
                                    }
                                )
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        </BaseContainer>
    );
};

export default PostTypeDashboard;

const style = StyleSheet.create({
    flexStyle: { flex: 1 },
    scrollContainerStyle: { paddingHorizontal: 30, paddingBottom: 30 },
    welcomeTxt: { fontSize: fontNormalize(40), color: AMColors.grey, fontFamily: AMFonts.SFProDisplay_Bold },
    nameStyle: { fontSize: fontNormalize(18), fontFamily: AMFonts.SFProDisplay_Bold, marginBottom: 10, color: AMColors.primary },
    postTitle: { fontFamily: AMFonts.SFProDisplay_Bold, fontSize: wp("8.5%"), color: AMColors.primary },
    postDescStyle: { fontFamily: AMFonts.SFProDisplay_Regular, color: AMColors.light_Grey, fontSize: fontNormalize(20) },
    fullThumbnail: { width: "100%", justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, backgroundColor: AMColors.light_primary, paddingHorizontal: 15, paddingVertical: 20, borderRadius: 10 },
    parentThumbnail: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    thumbnail: { width: (width * 0.5) - 35, backgroundColor: AMColors.light_primary, padding: 15, borderRadius: 10 }
})