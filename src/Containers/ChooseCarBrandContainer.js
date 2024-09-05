import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
import AMAssets from '../Assets';
import AMFastImage from '../Components/AMFastImage';
import AMColors from '../Utils/AMColors';
import { BRAND, DEFAULT_IMAGE_URL, fontNormalize, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { postApi } from '../Utils/ServiceManage';
import BaseContainer from './BaseContainer';

const ChooseCarBrandContainer = (props) => {

    const [frequentModalList, setFrequentModalList] = useState([])
    const [otherModalList, setOtherModalList] = useState([])
    const [searchFrequentModalList, setSearchFrequentModalList] = useState([])
    const [searchOtherModalList, setSearchOtherModalList] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('')

    const userDetail = useSelector(state => state)

    useEffect(() => {
        fetchBrandModal()
    }, [])

    const fetchBrandModal = () => {
        setIsLoading(true)
        postApi(BRAND, {}, onSuccessGetModalBrand, onFailureModalBrand, userDetail?.userOperation)
    }

    const onSuccessGetModalBrand = (response) => {
        setFrequentModalList(response.frequent)
        setOtherModalList(response.others)
        setIsLoading(false)
    }

    const onFailureModalBrand = (error) => {
        setIsLoading(false)
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    const navigateToDetailPart = (item) => {
        props.navigation.navigate(props?.route?.params?.type == 'purchase' ? 'searchfilterparts' : 'partsdetail', {
            modaldata: item,
            isUrgent: props?.route?.params?.isUrgent ?? "0",
                // isPartsImageEnable: props?.route?.params?.isPartsImageEnable ?? false,
                type: props?.route?.params?.type
        })
    }

    const onSearchValue = (text) => {
        setSearch(text)
        if (text !== "") {
            // console.log("::FILTER :::: ",frequentModalList.filter(items => items.name.search(text) !== -1) );
            // searchHandler(text)
            setSearchFrequentModalList(frequentModalList.filter(items => items.name.toLowerCase().search(text.toLowerCase()) !== -1))
            setSearchOtherModalList(otherModalList.filter(items => items.name.toLowerCase().search(text.toLowerCase()) !== -1))
        } else {
            // setSearchListData([])
            setSearchFrequentModalList([])
            setSearchOtherModalList([])
        }
    }

    const skeletonRender = () => {
        return (
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item flexDirection="row" flexWrap='wrap' justifyContent='space-evenly'>
                    {[1, 2, 3, 4, 5, 6].map((item, index) => {
                        return (
                            <SkeletonPlaceholder.Item key={index} width={(width * 0.33) - 35} height={(width * 0.33) - 25} marginBottom={10} borderRadius={10} />
                        )
                    })}
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        )
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            title={"Choose Car's Brand"}
        >
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 30 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>

                <View style={{ borderWidth: 0.5, flexDirection: 'row', alignItems: 'center', borderColor: AMColors.primary, marginTop: 15, padding: 5, borderRadius: 5 }} >
                            <Image style={{ width: 20, height: 20, marginHorizontal: 15 }} source={AMAssets.search} />
                            <TextInput
                                value={search}
                                style={{ flex: 1, height: 40, color: AMColors.black, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(16) }}
                                placeholder={"Search"}
                                placeholderTextColor={AMColors.primary}
                                onChangeText={onSearchValue}
                            />
                        </View>
                    <View style={{ borderLeftWidth: 3, borderColor: AMColors.light_Grey, marginVertical: 20, paddingHorizontal: 15 }}>
                        <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.light_Grey, fontSize: fontNormalize(13) }}>{"Frequently Inquired"}</Text>
                    </View>
                    {isLoading ?
                        skeletonRender() :
                        (search == "" ? frequentModalList.length : searchFrequentModalList.length) !== 0 ?
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                                {(search == "" ? frequentModalList : searchFrequentModalList).map((item, index) => {
                                    return (
                                        <Pressable
                                            key={index}
                                            style={[styles.thumbnail, { marginRight: (index + 1) % 3 == 0 ? 0 : 24, }]}
                                            onPress={() => navigateToDetailPart(item)}
                                        >
                                            <AMFastImage
                                                style={styles.imageStyle}
                                                source={item.image}
                                                brand
                                            />
                                            <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, color: AMColors.grey, marginBottom: 10, fontSize: fontNormalize(18) }} numberOfLines={1}>{item.name}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View> : <Text style={{ fontFamily: AMFonts.Montserrat_SemiBold, color: AMColors.primary, fontSize: fontNormalize(15), alignSelf: 'center' }}>{"No data found"}</Text>
                    }

                    <View style={{ borderLeftWidth: 3, borderColor: AMColors.light_Grey, marginVertical: 20, paddingHorizontal: 15 }}>
                        <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.light_Grey, fontSize: fontNormalize(13) }}>{"Other Popular Brands"}</Text>
                    </View>
                    {isLoading ?
                        skeletonRender() :
                        (search == "" ? otherModalList.length : searchOtherModalList.length) !== 0 ?
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {(search == "" ? otherModalList : searchOtherModalList).map((item, index) => {
                                    return (
                                        <Pressable
                                            key={index}
                                            style={[styles.thumbnail, { marginRight: (index + 1) % 3 == 0 ? 0 : 24, }]}
                                            onPress={() => navigateToDetailPart(item)}
                                        >
                                            <AMFastImage
                                                style={styles.imageStyle}
                                                source={item.image}
                                                brand
                                            />
                                            <Text style={{ fontFamily: AMFonts.SFProDisplay_Regular, color: AMColors.grey, marginBottom: 10, fontSize: fontNormalize(18) }} numberOfLines={1}>{item.name}</Text>
                                        </Pressable>
                                    )
                                })}

                            </View> : <Text style={{ fontFamily: AMFonts.Montserrat_SemiBold, color: AMColors.primary, fontSize: fontNormalize(15), alignSelf: 'center' }}>{"No data found"}</Text>
                    }
                </ScrollView>
            </View>
        </BaseContainer>
    );
};

export default ChooseCarBrandContainer;

const styles = StyleSheet.create({
    thumbnail: {
        backgroundColor: AMColors.white,
        alignItems: 'center',
        width: (width * 0.33) - 35,
        marginBottom: 25,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowRadius: 4,
                shadowColor: AMColors.black,
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 0 },
                borderRadius: 10,
            },
            android: {
                elevation: 1
            }
        })

    },
    imageStyle: { width: (width * 0.33) - 35, height: (width * 0.33) - 35, borderTopLeftRadius: 10, borderTopRightRadius: 10 }
})