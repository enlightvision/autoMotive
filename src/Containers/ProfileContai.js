import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { APP_NAME, DELETE_SELL_POST, fontNormalize, SEARCH_USER_POST_DATA, UPDATE_PROFILE, USER_PROFILE, USER_SELL_DATA, USER_URGENT_DATA } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { deleteApi, getApi, postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';
import { Segmented } from 'react-native-collapsible-segmented-view'
import { BlurView, VibrancyView } from "@react-native-community/blur";
import AMPopupView from '../Components/AMPopupView';


const ProfileContai = (props) => {

    const validationHelper = new ValidationHelper();
    const userDetail = useSelector(state => state)
    const userDispatch = useDispatch()
    const nameRef = useRef(null)

    const [name, setName] = useState(userDetail?.userOperation?.userDetail?.name ?? "")
    const [email, setEmail] = useState(userDetail?.userOperation?.userDetail?.email ?? "")
    const [mobile, setMobile] = useState(userDetail?.userOperation?.userDetail?.mobile ?? "")
    const [address, setAddress] = useState(userDetail?.userOperation?.userDetail?.address ?? "")
    const [search, setSearch] = useState("")
    const [selectedTab, setSelectedTab] = useState(0)
    const [city, setCity] = useState("")
    const [sellProductList, setSellProductList] = useState([])
    const [urgentProductList, setUrgentProductList] = useState([])
    const [searchUrgentProductList, setSearchUrgentProductList] = useState([])
    const [searchSellProductList, setSearchSellProductList] = useState([])
    const [countSellProduct, setCountSellProduct] = useState(0)
    const [countUrgentProduct, setCountUrgentProduct] = useState(0)
    const [isRefreshingSellPart, setIsRefreshingSellPart] = useState(false);
    const [isEnabledSellPart, setIsEnabledSellPart] = useState(true);
    const [isRefreshingUrgentPart, setIsRefreshingUrgentPart] = useState(false);
    const [isEnabledUrgentPart, setIsEnabledUrgentPart] = useState(true);
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const postList = ['Sell', 'Urgent']

    useFocusEffect(
        useCallback(() => {
            getUserProfile()
            sellProductAPI(countSellProduct)
            urgentProductAPI(countUrgentProduct)
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
        setCity(response?.data?.city)
        userDispatch(saveUserDetailsInRedux(response?.data))
    }

    const onFailureUserProfile = (error) => { }

    const sellProductAPI = (count) => {
        const params = {
            start: count,
            pageSize: 10
        }
        postApi(USER_SELL_DATA, params, onSuccessSellProduct, onFailureSellProduct, userDetail?.userOperation)
    }

    const onSuccessSellProduct = (response) => {
        console.log("Sell Product ::::: ", response);
        setIsRefreshingSellPart(false)
        setSellProductList(oldData => [...oldData, ...response.data])
        if (response.total == [...sellProductList, ...response.data].length) {
            setIsEnabledSellPart(false)
        } else {
            setCountSellProduct(value => value + 10)
        }
    }

    const onFailureSellProduct = () => { }

    const urgentProductAPI = (count) => {
        const params = {
            start: count,
            pageSize: 10
        }
        postApi(USER_URGENT_DATA, params, onSuccessUrgentProduct, onFailureUrgentProduct, userDetail?.userOperation)
    }

    const onSuccessUrgentProduct = (response) => {
        console.log("Urgent Product ::::: ", response);
        setIsRefreshingUrgentPart(false)
        setUrgentProductList(oldData => [...oldData, ...response.data])
        if (response.total == [...urgentProductList, ...response.data].length) {
            setIsEnabledUrgentPart(false)
        } else {
            setCountUrgentProduct(value => value + 10)
        }
    }

    const onFailureUrgentProduct = () => { }

    const searchProductAPI = (text) => {
        const params = {
            search: text ?? search,
            urgentSell: selectedTab
        }
        postApi(SEARCH_USER_POST_DATA, params, onSuccessSearchProduct, onFailureSearchProduct, userDetail?.userOperation)
    }

    const onSuccessSearchProduct = (response) => {
        console.log("Search Product ::::: ", response);
        if (selectedTab) {
            setSearchUrgentProductList(response.data)
        } else {
            setSearchSellProductList(response.data)
        }

    }

    const onFailureSearchProduct = () => { }

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

    const onChangeSearchTxt = (text) => {
        if (text == "") {
            clearSearchAction()
            return
        }
        setSearch(text)
        searchProductAPI(text)
    }

    const onChangeTabBar = (value) => {
        setSelectedTab(value)
        clearSearchAction()
    }

    const clearSearchAction = () => {
        setSearch("")
        setSearchSellProductList([])
        setSearchUrgentProductList([])
    }

    const navigateToEdit = (item) => {
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

    const searchModalVisiblity = () => {
        setModalVisible(true)
    }

    const onEndReachSellPartPagination = () => {
        console.log("onEndReach :::::: ");
        if (isEnabledSellPart && !isRefreshingSellPart) {
            setIsRefreshingSellPart(true)
            setTimeout(() => {
                sellProductAPI(countSellProduct)
            }, 2000)
        }
    }

    const onEndReachUrgentPartPagination = () => {
        console.log("onEndReach :::::: ");
        if (isEnabledUrgentPart && !isRefreshingUrgentPart) {
            setIsRefreshingUrgentPart(true)
            setTimeout(() => {
                urgentProductAPI(countUrgentProduct)
            }, 2000)
        }
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

    const Header = () => {
        return (
            <View style={style.userDetailView}>
                <CustomTextInput
                    title={'Name'}
                    value={name}
                />
                <CustomTextInput
                    title={'Email ID'} value={email}
                />
                <CustomTextInput
                    title={'Mobile No.'} value={mobile}
                />
                <CustomTextInput
                    title={'Address'} value={address}
                />
            </View>
        )
    }

    const SellPartRender = () => {
        return (
            <AMProfilePostList isSegmented isEditable
                listData={search == "" ? sellProductList : searchSellProductList}
                onClickEdit={navigateToEdit}
                onClickDelete={deletePostAction} userCity={city}
                onEndReached={onEndReachSellPartPagination}
                ListEmptyComponent={() => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Text style={style.noDataFound}>{"No data found"}</Text>
                        </View>
                    )
                }}
            />
        )
    }

    const UrgentPartRender = () => {
        return (
            <AMProfilePostList isSegmented isEditable
                listData={search == "" ? urgentProductList : searchUrgentProductList}
                onClickEdit={navigateToEdit}
                onClickDelete={deletePostAction}
                onEndReached={onEndReachUrgentPartPagination}
                ListEmptyComponent={() => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Text style={style.noDataFound}>{"No data found"}</Text>
                        </View>
                    )
                }}
            />
        )
    }

    const searchListModalRender = () => {
        return (
            <AMPopupView isVisible={modalVisible}>
                <BlurView
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }}
                    blurType="thickMaterial"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="black"
                >
                    <View style={{ flex: 1, margin: 15 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: AMColors.white, padding: 10, borderRadius: 10, marginBottom: 15 }}>
                            <TextInput
                                style={{ flex: 1, color: AMColors.black, marginRight: 10, paddingVertical: 6, paddingLeft: 5, borderColor: AMColors.light_Grey, borderRadius: 10, borderWidth: 1 }}
                                value={search}
                                onChangeText={onChangeSearchTxt}
                                placeholder={"Search Your Product"}
                            />
                            <Pressable style={{ backgroundColor: AMColors.primary, alignItems: 'center', borderRadius: 10 }}
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                            >
                                <Text style={{ margin: 10, color: AMColors.white, fontFamily: AMFonts.SFProDisplay_Medium }}>{"Go"}</Text>
                            </Pressable>
                        </View>
                        {(selectedTab == 0 ? searchSellProductList : searchUrgentProductList).length !== 0 ?
                            <AMProfilePostList isEditable listData={selectedTab == 0 ? searchSellProductList : searchUrgentProductList} onClickEdit={navigateToEdit} onClickDelete={deletePostAction} userCity={city} />
                            :
                            search == "" ? null :
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={style.noDataFound}>{"No data found"}</Text>
                                </View>
                        }
                    </View>
                </BlurView>
            </AMPopupView>
        )
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            rightComponent={rightComponentRender()}
        >

            <View style={style.container}>
                {searchListModalRender()}
                <Segmented.View header={Header} containerStyle={{ overflow: 'hidden' }}
                    control={() => {
                        return (
                            <View >
                                <View style={style.titleView}>
                                    <TextInput
                                        style={{ flex: 1, color: AMColors.black, marginRight: 10, paddingVertical: 6, paddingLeft: 5, borderColor: AMColors.light_Grey, borderRadius: 10, borderWidth: 1 }}
                                        value={search}
                                        onChangeText={onChangeSearchTxt}
                                        editable={false}
                                        placeholder={"Search Your Product"}
                                    />
                                    {search !== "" ?
                                        <Pressable style={{ marginRight: 10 }} hitSlop={{ right: 10, left: 10 }} onPress={clearSearchAction}>
                                            <Icon name='highlight-off' size={35} color={AMColors.grey} />
                                        </Pressable> : null}
                                    <Pressable style={{ backgroundColor: AMColors.primary, padding: 8, borderRadius: 20 }}
                                        onPress={searchModalVisiblity}
                                    >
                                        <Image source={AMAssets.search} style={{ tintColor: AMColors.white, width: 16, height: 16 }} />
                                    </Pressable>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {postList.map((item, index) => {
                                        return (
                                            <Pressable style={{ flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: index == selectedTab ? 3 : 0, borderBottomColor: AMColors.primary }}
                                                key={index}
                                                onPress={() => onChangeTabBar(index)}
                                            >
                                                <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(16) }}>{item}</Text>
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>
                        )
                    }}
                >
                    <Segmented.Segment component={selectedTab == 0 ? SellPartRender : UrgentPartRender} />
                </Segmented.View>

            </View>
        </BaseContainer>
    );
};



export const CustomTextInput = (props) => {
    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: AMColors.primary, marginBottom: 5 }}>
            <Text style={{ color: AMColors.primary, fontFamily: AMFonts.Montserrat_Regular, marginVertical: 5 }}>{props.title}</Text>
            <Text style={{ flex: 1, paddingVertical: 5, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(15) }}>{props.value}</Text>
        </View>
    )
}

export default ProfileContai;

const style = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    userDetailView: { backgroundColor: AMColors.light_primary, paddingHorizontal: 15, paddingBottom: 15, borderRadius: 10 },
    titleView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginHorizontal: 5 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.grey, fontSize: fontNormalize(20) },
    noDataFound: { fontFamily: AMFonts.Montserrat_SemiBold, color: AMColors.primary, fontSize: fontNormalize(15), textAlign: 'center' }
})