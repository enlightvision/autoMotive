import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, Pressable, StyleSheet, Switch, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMPartsDetailList from '../Components/AMPartsDetailList';
import AMProfilePostList from '../Components/AMProfilePostList';
import AMThemeButton from '../Components/AMThemeButton';
import AMColors from '../Utils/AMColors';
import { fontNormalize, SEARCH_POST_DATA, URGENT_REQUIRED_PART } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { postApi } from '../Utils/ServiceManage';
import BaseContainer from './BaseContainer';

// var isEnabled = true
const ListOfRequiredPart = (props) => {


    const listPart = [
        {

        }
    ]
    const userDetail = useSelector(state => state)
    const [requiredPartList, setRequiredPartList] = useState(props?.route?.params?.partsList ?? [])
    const [search, setSearch] = useState('')
    const [count, setCount] = useState(0)
    const [searchListData, setSearchListData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    useEffect(() => {
        if (!props?.route?.params?.partsList) {
            setIsLoading(true)
            urgentRequiredPart(count)
        }
    }, [])

    const urgentRequiredPart = (count = 0) => {
        const param = {
            start: count,
            pageSize: 10
        }

        postApi(URGENT_REQUIRED_PART, param, onSuccessUrgentPart, onFailureUrgentPart, userDetail?.userOperation)
    }

    const onSuccessUrgentPart = (response) => {
        setRequiredPartList(oldData => [...oldData, ...response.data])
        setIsLoading(false)
        setIsRefreshing(false)
        if (response.total == [...requiredPartList, ...response.data].length) {
            setIsEnabled(false)
        } else {
            setCount(value => value + 10)
        }


    }

    const onFailureUrgentPart = (error) => {
        setIsLoading(false)
        setIsRefreshing(false)
    }

    const searchHandler = (text) => {
        const params = {
            search: text
        }
        setSearchLoading(true)
        postApi(SEARCH_POST_DATA, params, onSuccessSearch, onFailureSearch, userDetail?.userOperation)
    }

    const onSuccessSearch = (response) => {
        setSearchLoading(false)
        setSearchListData(response.data)
    }
    const onFailureSearch = (error) => {
        setSearchLoading(false)
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    const onCLickListItem = (data) => {
        props.navigation.navigate('partdetail', {
            itemData: data,
            isSearchData: props?.route?.params?.partsList ? true : false,
            isUrgentDisable: props?.route?.params?.isUrgentDisable ?? false
        })
    }

    const onSearchValue = (text) => {
        setSearch(text)
        if (text !== "") {
            searchHandler(text)
        } else {
            setSearchListData([])
        }
    }

    const onFocusSearch = () => {
        setIsSearchEnabled(true)
    }

    const onBlurSearch = () => {
        if (search == "") {
            setIsSearchEnabled(false)
        }
    }

    const onEndReachPagination = () => {
        console.log("onEndReach :::::: ");
        if (!props?.route?.params?.partsList && isEnabled && !isRefreshing) {
            setIsRefreshing(true)
            setTimeout(() => {
                urgentRequiredPart(count)
            }, 2000)
        }
    }

    const navigateToUrgentPartSell = () => {
        props.navigation.navigate('partsdetail',
            {
                modaldata: props?.route?.params?.modaldata,
                isUrgent: "1",
                // isPartsImageEnable: props?.route?.params?.isPartsImageEnable ?? false,
                type: props?.route?.params?.type,
                postData: props?.route?.params?.postData,
            })
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            isLoading={isLoading}
            title={"Urgently required parts"}
        >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={{ flex: 1, paddingHorizontal: 30 }}>
                {!props?.route?.params?.partsList ?
                    <View style={{ borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', borderColor: AMColors.primary, marginTop: 15, padding: 5, borderRadius: 5 }} >
                        <Image style={{ width: 20, height: 20, marginHorizontal: 15 }} source={AMAssets.search} />
                        <TextInput
                            value={search}
                            style={{ flex: 1, height: 40, color: AMColors.black, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(16) }}
                            placeholder={"Search"}
                            placeholderTextColor={AMColors.primary}
                            onChangeText={onSearchValue}
                            onFocus={onFocusSearch}
                            onBlur={onBlurSearch}
                        />
                    </View>
                    : null}

                {isSearchEnabled ?
                    (searchLoading ?
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <ActivityIndicator color={AMColors.primary} style={{marginTop:30}} />
                        </View>
                        :
                        searchListData.length !== 0 ?

                        <AMProfilePostList contentContainerStyle={{ paddingVertical: 20 }} style={{ marginTop: 10 }} listData={searchListData}
                            onClickItem={onCLickListItem}
                        />
                        
                            :
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {search.length !== 0 ?
                                    <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.primary }}>{"No data found"}</Text>
                                    : null}

                            </View>

                    )
                    :
                    requiredPartList.length !== 0 ?
                        <AMProfilePostList contentContainerStyle={{ paddingVertical: 20 }} style={{ marginTop: 10 }} listData={requiredPartList}
                            onClickItem={onCLickListItem}
                            onEndReached={onEndReachPagination}
                            ListFooterComponent={() => {
                                return (
                                    isRefreshing ?
                                        <View>
                                            <ActivityIndicator color={AMColors.primary} />
                                        </View>
                                        : null
                                )
                            }}
                        />
                        : !isLoading ?
                            props?.route?.params?.partsList ?
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ alignItems: 'center', alignSelf: 'center', padding: 20, borderRadius: 10, borderColor: AMColors.primary, borderWidth: 1 }}>
                                        <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, fontSize: 18, color: AMColors.primary }}>{"No Data Matching"}</Text>
                                        <Text style={{ fontFamily: AMFonts.SFProDisplay_Medium, color: AMColors.grey, textAlign: 'center', marginTop: 10 }}>{"Do you want to list your part in the list of urgently require parts"}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            <AMThemeButton
                                                title={"Yes"}
                                                style={{ width: "40%" }}
                                                onPress={navigateToUrgentPartSell}
                                            />
                                            <AMThemeButton
                                                title={"No"}
                                                style={{ width: "40%", marginLeft: 10, borderWidth: 1, borderColor: AMColors.primary, backgroundColor: AMColors.white }}
                                                textStyle={{ color: AMColors.primary }}
                                                onPress={navigationToBack}
                                            />
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: AMColors.primary, fontFamily: AMFonts.SFProDisplay_Bold }}>{"No data found"}</Text>
                                </View>
                            : null
                }
            </View>
            {/* </TouchableWithoutFeedback> */}
        </BaseContainer>
    );
};

export default ListOfRequiredPart;

const style = StyleSheet.create({

})