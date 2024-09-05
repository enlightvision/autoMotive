import React, { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMColors from '../Utils/AMColors';
import { DEFAULT_IMAGE_URL, fontNormalize, SEARCH_PRODUCT_DETAIL, SHOW_PRODUCTS_DETAIL, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { getApi, postApi } from '../Utils/ServiceManage';
import BaseContainer from './BaseContainer';

const PartDetailContainer = (props) => {

    const userDetail = useSelector(state => state)

    const [partDetails, setPartDetails] = useState()
    const [productImages, setProductImages] = useState([])

    useEffect(() => {
        if (props?.route?.params?.isSearchData) {
            searchPartDetailAPI()
        } else {
            partDetailAPI()
        }
    }, [])

    const searchPartDetailAPI = () => {
        const param = {
            id: props?.route?.params?.itemData?.id
        }

        postApi(SEARCH_PRODUCT_DETAIL, param, onSuccessSearchRequiredPart, onFailureSearchRequiredPart, userDetail?.userOperation)
    }

    const onSuccessSearchRequiredPart = (response) => {
        setPartDetails(response.data)
        setProductImages(response.data.image.split(',').map(item => DEFAULT_IMAGE_URL + "partsSelling/" + item))
    }

    const onFailureSearchRequiredPart = (error) => {


    }
    const partDetailAPI = () => {
        const param = {
            id: props?.route?.params?.itemData?.id
        }
        postApi(SHOW_PRODUCTS_DETAIL, param, onSuccessRequiredPart, onFailureRequiredPart, userDetail?.userOperation)
    }

    const onSuccessRequiredPart = (response) => {
        setPartDetails(response.data)
        setProductImages(response.data.image.split(',').map(item => DEFAULT_IMAGE_URL + "partsSelling/" + item))
    }

    const onFailureRequiredPart = (error) => {

    }

    const renderPartFeature = (title, value) => {
        return (
            <View style={{ marginVertical: 10, flex: 1 }}>
                <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(13), color: AMColors.light_Grey }}>{title}</Text>
                <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(15), color: AMColors.grey }}>{value ?? "N/A"}</Text>
            </View>
        )
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    const handlerPhoneCall = () => {
        let number = `tel: ${(partDetails?.user?.mobile ?? partDetails?.MobileNumber)}`
        Linking.canOpenURL(number).then(() => {
            Linking.openURL(number)
        }).catch(() => {
            Snackbar.show({
                text: "Your number is invalid please check",
                duration: Snackbar.LENGTH_SHORT,
            });
        })
    }

    const handlerWhatsApp = () => {
        let number = "whatsapp://send?text=" +
            "&phone=+91" + (partDetails?.user?.mobile ?? partDetails?.MobileNumber)
        Linking.canOpenURL(number).then(() => {
            Linking.openURL(number)
        }).catch(() => {
            Snackbar.show({
                text: "Your whatsapp number is invalid please check",
                duration: Snackbar.LENGTH_SHORT,
            });
        })
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            rightComponent={
                partDetails?.urgentSell == "1" && !props?.route?.params?.isUrgentDisable ?
                    <Pressable style={{ flexDirection: 'row', backgroundColor: AMColors.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', marginHorizontal: 5 }}>
                        <Image source={AMAssets.bell_pro} />
                        <Text style={{ color: AMColors.white, marginLeft: 5, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12) }}>{"Urgent Sell"}</Text>
                    </Pressable>
                    : null
            }
        >
            <ScrollView contentContainerStyle={style.scrollStyle} showsVerticalScrollIndicator={false}>

                <SliderBox
                    images={productImages.length == 0 ? [AMAssets.product_placeholder] : productImages}
                    sliderBoxHeight={heightPercentageToDP("40%")}
                    parentWidth={width - 20}
                    dotColor={AMColors.primary}
                    inactiveDotColor={AMColors.medium_light_primary}
                />
                <View style={{ paddingHorizontal: 20, }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{flex:1, fontFamily: AMFonts.Montserrat_Bold, fontSize: fontNormalize(20), color: AMColors.primary, marginTop: 25, marginBottom: 5 }}>
                            {(partDetails?.brand ?? partDetails?.title)}</Text>
                        <Text style={{ flex:1,textAlign:'right', fontFamily: AMFonts.Montserrat_Bold, fontSize: fontNormalize(20), color: AMColors.primary, marginTop: 25, marginBottom: 5 }}>
                            {(partDetails?.brand_model ?? partDetails?.brandModel_name)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                    {renderPartFeature("VERSION", (partDetails?.brand_version ?? partDetails?.version))}

                        <View style={{ width: 1, borderColor: AMColors.grey, marginHorizontal: 50, borderWidth: 0.5 }} />
                        {renderPartFeature("SUB CATEGORY", (partDetails?.sub_cat ?? partDetails?.subCategory))}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {renderPartFeature("CITY", (partDetails?.user?.city ?? partDetails?.City))}
                        <View style={{ width: 1, borderColor: AMColors.grey, marginHorizontal: 50, borderWidth: 0.5 }} />
                        <View style={{ marginVertical: 10, flex: 1 }}>
                            <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(16), color: AMColors.light_Grey }}>{"APPROX PRICE"}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={AMAssets.rupee} style={{ width: 18, height: 18, tintColor: AMColors.grey }} />
                                <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(18), color: AMColors.grey }}>{partDetails?.approxRate ?? "N/A"}</Text>
                            </View>
                        </View> 
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {renderPartFeature("MAIN CATEGORY", (partDetails?.cat ?? partDetails?.category))}
                        <View style={{ width: 1, borderColor: AMColors.grey, marginHorizontal: 50, borderWidth: 0.5 }} />
                        {renderPartFeature("CONDITION OF PART", partDetails?.conditionPart)}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {renderPartFeature("DATE", (partDetails?.postDate))}
                        <View style={{ width: 1, borderColor: AMColors.grey, marginHorizontal: 50, borderWidth: 0.5 }} />
                        {renderPartFeature("QUANTITY", partDetails?.quantity)}    
                    </View>
                    
                </View>
            </ScrollView>

            <View style={{ backgroundColor: AMColors.primary, paddingHorizontal: 25, paddingVertical: 15, justifyContent: 'center' }}>
                {userDetail?.userOperation?.isLogin ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ borderRadius: 50, backgroundColor: AMColors.white, overflow: 'hidden' }}>
                                <Image
                                    style={{ padding: 25 }}
                                    resizeMode={'center'}
                                    source={AMAssets.menu_profile}
                                />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <Text style={{ color: AMColors.white, fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(20) }} numberOfLines={1}>{(partDetails?.user?.name ?? partDetails?.SellerName)}</Text>
                                <Text style={{ color: AMColors.white, fontFamily: AMFonts.SFProDisplay_Regular, fontSize: fontNormalize(14) }}>{(partDetails?.user?.mobile ?? partDetails?.MobileNumber)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Pressable style={{ marginRight: 10 }} onPress={handlerWhatsApp}>
                                <Image source={AMAssets.whatsapp} style={{ tintColor: AMColors.white }} />
                            </Pressable>
                            <Pressable onPress={handlerPhoneCall}>
                                <Icon name='phone-in-talk' size={30} color={AMColors.white} />
                            </Pressable>
                        </View>
                    </View>
                    :
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable
                            onPress={() => {
                                props.navigation.navigate('login')
                            }}
                        >
                            <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(15), textDecorationLine: 'underline', color: AMColors.white }}>{"LOGIN"}</Text>
                        </Pressable>
                        <Text style={{ fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(15) }}>{" If you want to show seller detail"}</Text>
                    </View>
                }
            </View>

        </BaseContainer>
    );
};

export default PartDetailContainer;

const style = StyleSheet.create({
    scrollStyle: { paddingBottom: 30, paddingHorizontal: 10 },
    // partsDetailViewStyle: 
})