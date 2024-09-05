import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AMAssets from '../Assets';
import { showDialogue } from '../Utils/AMAlert';
import AMColors from '../Utils/AMColors';
import { APP_NAME, DEFAULT_IMAGE_URL, fontNormalize } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import AMFastImage from './AMFastImage'
import { Segmented } from 'react-native-collapsible-segmented-view'
import { Tabs } from 'react-native-collapsible-tab-view';

const AMProfilePostList = (props) => {
    const [listData, setListData] = useState([props.listData])

    useEffect(() => {
        setListData(props.listData)
    }, [props.listData])

    const onClickEdit = (item) => {
        if (props.onClickEdit) {
            props.onClickEdit(item)
        }
    }

    const onClickDelete = (item) => {
        showDialogue("Are you sure want to delete",
            [{ "text": "No" }],
            APP_NAME,
            () => {
                if (props.onClickDelete) {
                    props.onClickDelete(item)
                    setListData(listData.filter(items => items.id !== item.id))
                }
            })
    }

    const onClickListItem = (data) => {
        if (props.onClickItem) {
            props.onClickItem(data)
        }
    }

    const partsDetailRender = ({ item, index }) => {
        return (
            <Pressable key={index} style={{ flex: 1, flexDirection: 'row', backgroundColor: AMColors.light_primary, padding: 5, marginBottom: 10 }}
                onPress={() => onClickListItem(item)}
            >

                <AMFastImage
                    source={item?.image?.split(",")[0]}
                    style={{ width: 80, height: '100%' }}
                />

                <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ flex: 1, color: AMColors.primary, fontFamily: AMFonts.Montserrat_SemiBold, fontSize: fontNormalize(16) }}>{(item?.brandName ?? item?.brand_name ?? item?.brand?.name ?? "")}</Text>
                                <Text style={{ color: AMColors.primary, fontFamily: AMFonts.Montserrat_SemiBold, fontSize: fontNormalize(16) }}>{(item?.brandModelName ?? item?.brand_model?.name ?? "")}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{"Sub Category : "}</Text> */}
                                <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{(item?.subCategoryName ?? item?.sub_cat?.name ?? item?.subCatName)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{"Approx. Price : "}</Text> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={AMAssets.rupee} style={{ width: 15, height: 15, tintColor: AMColors.grey }} />
                                    <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{item?.approxRate}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <Text style={{ fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{"City : "}</Text> */}
                                <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }}>{(props?.userCity ?? item?.user?.city ?? item?.city)}</Text>
                            </View>
                        </View>
                        {props.isEditable ?
                            <View style={{ marginLeft: 5 }}>
                                <Pressable style={{ backgroundColor: AMColors.white, padding: 5, borderRadius: 20, marginTop: 5 }}
                                    onPress={() => onClickEdit(item)}
                                >
                                    <Icon type='ionicon' name='create-outline' color={AMColors.green} />
                                </Pressable>
                                <Pressable style={{ backgroundColor: AMColors.white, padding: 5, borderRadius: 20, marginTop: 5 }}
                                    onPress={() => onClickDelete(item)}
                                >
                                    <Icon type='ionicon' name='trash-outline' color={AMColors.red} />
                                </Pressable>
                            </View>
                            : null}
                    </View>

                    {/* <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <Pressable style={{ flexDirection: 'row', backgroundColor: AMColors.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', marginHorizontal: 5 }}>
                            <Image source={AMAssets.safe_protect} />
                            <Text style={{ color: AMColors.white, marginLeft: 5, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12) }}>{"Protected"}</Text>
                        </Pressable> */}
                    {/* {item.urgentSell == "1" ?
                        <Pressable style={{ alignSelf: 'flex-start', flexDirection: 'row', backgroundColor: AMColors.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', marginHorizontal: 5 }}>
                            <Image source={AMAssets.bell_pro} />
                            <Text style={{ color: AMColors.white, marginLeft: 5, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12) }}>{"Urgent Sell"}</Text>
                        </Pressable>
                        : null} */}
                    {/* </View> */}
                </View>
            </Pressable>
        )
    }

    return (
        <View style={{ flex: 1, paddingTop: 10 }}>
            {props.isTab ?
                <Tabs.FlatList
                    data={listData}
                    extraData={listData}
                    contentContainerStyle={props.contentContainerStyle}
                    keyExtractor={(item, index) => index.toString()}
                    style={props.style}
                    showsVerticalScrollIndicator={false}
                    renderItem={partsDetailRender}
                    keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? 'always'}
                    onEndReached={props.onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={props.ListFooterComponent}
                    ListEmptyComponent={props.ListEmptyComponent}
                />
                :
                <FlatList
                    data={listData}
                    contentContainerStyle={props.contentContainerStyle}
                    keyExtractor={(item, index) => index.toString()}
                    style={props.style}
                    showsVerticalScrollIndicator={false}
                    renderItem={partsDetailRender}
                    keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? 'always'}
                    onEndReached={props.onEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={props.ListFooterComponent}
                    ListEmptyComponent={props.ListEmptyComponent}
                />
            }
        </View>
    );
};

export default AMProfilePostList;