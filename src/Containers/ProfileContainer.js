import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMProfilePostList from '../Components/AMProfilePostList';
import { saveUserDetailsInRedux } from '../redux/Actions/User';
import AMColors from '../Utils/AMColors';
import { APP_NAME, DELETE_SELL_POST, DELETE_URGENT_POST, fontNormalize, SEARCH_USER_POST_DATA, UPDATE_PROFILE, USER_PROFILE, USER_SELL_DATA, USER_URGENT_DATA } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { deleteApi, getApi, postApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';
import { MaterialTabBar, MaterialTabItem, Tabs, useCollapsibleStyle } from 'react-native-collapsible-tab-view'
import Tooltip from 'react-native-walkthrough-tooltip';

const ProfileContainer = (props) => {

    const userDetail = useSelector(state => state)
    const userDispatch = useDispatch()
    const scrollY = useRef(new Animated.Value(0)).current

    const [name, setName] = useState(userDetail?.userOperation?.userDetail?.name ?? "")
    const [email, setEmail] = useState(userDetail?.userOperation?.userDetail?.email ?? "")
    const [mobile, setMobile] = useState(userDetail?.userOperation?.userDetail?.mobile ?? "")
    const [address, setAddress] = useState(userDetail?.userOperation?.userDetail?.address ?? "")
    const [minimumSize, setMinimumSize] = useState(0)
    const [selectedTab, setSelectedTab] = useState(0)
    const [search, setSearch] = useState("")
    const [city, setCity] = useState("")
    // const [productList, setProductList] = useState([])
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
    const [toolTipVisible, setToolTipVisible] = useState(false);

    const [shouldVisible, setShouldVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const postList = ['Sell', 'Urgent']

    useFocusEffect(
        useCallback(() => {
            getUserProfile()
        }, [])
    )

    useEffect(() => {
        sellProductAPI(countSellProduct)
        urgentProductAPI(countUrgentProduct)
    }, [])

    const getUserProfile = () => {
        getApi(USER_PROFILE, onSuccessUserProfile, onFailureUserProfile, userDetail?.userOperation)
    }

    const onSuccessUserProfile = (response) => {
        setName(response?.data?.name)
        setAddress(response?.data?.address)
        setEmail(response?.data?.email)
        setMobile(response?.data?.mobile)
        // setProductList(response?.yourProducts)
        setCity(response?.data?.city)
        userDispatch(saveUserDetailsInRedux(response?.data))
    }

    const onFailureUserProfile = (error) => {
    }

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
        deleteApi((selectedTab == 0 ? DELETE_SELL_POST : DELETE_URGENT_POST) + data.id, onSuccessDeletePost, onFailureDeletePost, userDetail?.userOperation)
    }

    const onSuccessDeletePost = (response) => {
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onFailureDeletePost = (error) => {
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

    const onChangeSearchTxt = (text) => {
        if (text == "") {
            clearSearchAction()
            return
        }
        setSearch(text)
        searchProductAPI(text)
    }

    const clearSearchAction = () => {
        setSearch("")
        setSearchSellProductList([])
        setSearchUrgentProductList([])
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
            <>
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

                <View style={style.titleView}
                    onLayout={(event) => {
                        var { height } = event.nativeEvent.layout;
                        setMinimumSize(height + 5)
                    }}
                >
                    {/* <Text style={style.titleStyle}>{"My product list"}</Text> */}
                    <TextInput
                        style={{ flex: 1, color: AMColors.black, marginRight: 10, paddingVertical: 6, paddingLeft: 5, borderColor: AMColors.light_Grey, borderRadius: 10, borderWidth: 1 }}
                        value={search}
                        onChangeText={onChangeSearchTxt}
                        placeholder={"Search Your Product"}
                    />
                    <Tooltip
                        isVisible={toolTipVisible}
                        content={<Text>Search your sell and urgent product</Text>}
                        placement="top"
                        onClose={() => setToolTipVisible(false)}
                    >
                        <Pressable style={{ backgroundColor: AMColors.primary, padding: 8, borderRadius: 20 }} onPress={()=> setToolTipVisible(true)}>
                            <Image source={AMAssets.search} style={{ tintColor: AMColors.white, width: 16, height: 16 }} />
                        </Pressable>
                    </Tooltip>
                </View>
            </>
        )
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            rightComponent={rightComponentRender()}
        >

            <View style={style.container}>

                <Tabs.Container
                    renderHeader={Header}
                    containerStyle={{ overflow: 'hidden', width: Dimensions.get('screen').width - 30, alignSelf: 'center' }}
                    minHeaderHeight={minimumSize}
                    onTabChange={(value) => {
                        setSelectedTab(value.index)
                        clearSearchAction()
                    }}
                >
                    <Tabs.Tab name="Sell Post">
                        <AMProfilePostList isTab isEditable
                            style={{ width: Dimensions.get('screen').width - 30 }}
                            listData={search == "" ? sellProductList : searchSellProductList}
                            onClickEdit={navigateToEdit}
                            onClickDelete={deletePostAction} userCity={city}
                            onEndReached={onEndReachSellPartPagination}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={style.noDataFound}>{"No data found"}</Text>
                                    </View>
                                )
                            }}
                        />
                    </Tabs.Tab>
                    <Tabs.Tab name="Urgent Post">
                        <AMProfilePostList isTab isEditable
                            style={{ width: Dimensions.get('screen').width - 30 }}
                            listData={search == "" ? urgentProductList : searchUrgentProductList}
                            onClickEdit={navigateToEdit}
                            onClickDelete={deletePostAction}
                            onEndReached={onEndReachUrgentPartPagination}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={style.noDataFound}>{"No data found"}</Text>
                                    </View>
                                )
                            }}
                        />
                    </Tabs.Tab>
                </Tabs.Container>

            </View>
        </BaseContainer>
    );
};

export default ProfileContainer;

export const CustomTextInput = (props) => {
    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: AMColors.primary, marginBottom: 5 }}>
            <Text style={{ color: AMColors.primary, fontFamily: AMFonts.Montserrat_Regular, marginVertical: 5 }}>{props.title}</Text>
            <Text style={{ flex: 1, paddingVertical: 5, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(15) }}>{props.value}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: { flex: 1, paddingVertical: 15 },
    userDetailView: { backgroundColor: AMColors.light_primary, padding: 15, marginHorizontal: 15, borderRadius: 10 },
    titleView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 5, marginHorizontal: 10 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.grey, fontSize: fontNormalize(27) },
    noDataFound: { fontFamily: AMFonts.Montserrat_SemiBold, color: AMColors.primary, fontSize: fontNormalize(15), textAlign: 'center' },


    box: {
        height: 250,
        width: '100%',
    },
    boxA: {
        backgroundColor: 'white',
    },
    boxB: {
        backgroundColor: '#D8D8D8',
    },
    header: {
        height: 250,
        width: '100%',
        backgroundColor: '#2196f3',
    },
})