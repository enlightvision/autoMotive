import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AMAssets from '../Assets';
import AMColors from '../Utils/AMColors';
import { APP_NAME, DEFAULT_IMAGE_URL, fontNormalize, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import AMFastImage from './AMFastImage'

const AMPartsDetailList = (props) => {

    const [listData, setListData] = useState([props.listData])

    useEffect(() => {
        setListData(props.listData)
    }, [props.listData])

    const onClickEdit = (item) => {
        if (props.onClickEdit) {
            props.onClickEdit(item)
        }
    }

    const onClickListItem = (data) => {
        if (props.onClickItem) {
            props.onClickItem(data)
        }
    }

    const subListing = (item1, item2) => {
        return (
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5 }}>
                <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }} numberOfLines={1}>{item1}</Text>
                <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14), marginLeft: 5 }} numberOfLines={1}>{item2}</Text>
            </View>
        )
    }

    const partsDetailRender = ({ item, index }) => {
        return (
            <Pressable key={index} style={{ width: "48%", marginLeft: index % 2 !== 0 ? "4%" : "0%", backgroundColor: AMColors.light_primary, padding: 10, marginBottom: 10, borderRadius:5 }}
                onPress={() => onClickListItem(item)}
            >

                <AMFastImage
                    source={item?.image?.split(",")[0]}
                    style={{ width: "100%", height: (width * 0.5) - 60, borderRadius:5 }}
                />

                <View style={{ flex: 1, paddingBottom: 5 }}>

                    {/* {subListing(item?.brandName, item?.brandModelName)} */}
                    <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5 }}>
                        <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Bold, color: AMColors.primary, fontSize: fontNormalize(14) }} numberOfLines={1}>{item?.brandName}</Text>
                        <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Bold, color: AMColors.primary, fontSize: fontNormalize(14), marginLeft: 5 }} numberOfLines={1}>{item?.brandModelName}</Text>
                    </View>
                    {subListing((item?.brandVersion ?? item?.brandVersionName), (item?.subCategoryName ?? item?.subCatName))}

                    <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5 }}>
                        <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }} numberOfLines={1}>{(item?.city ?? item?.user?.city)}</Text>
                        <View style={{flex:1, flexDirection: 'row', alignItems:'center' }}>
                            <Image source={AMAssets.rupee} style={{width:15, height:15, tintColor: AMColors.grey}}/>
                            <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, color: AMColors.grey, fontSize: fontNormalize(14) }} numberOfLines={1}>{item?.approxRate ?? "-"}</Text>
                        </View>
                    </View>

                </View>
            </Pressable>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={listData}
                contentContainerStyle={props.contentContainerStyle}
                keyExtractor={(item, index) => index.toString()}
                style={props.style}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={partsDetailRender}
                keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? "always"}
                onEndReached={props.onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={props.ListFooterComponent}
            />
        </View>
    );
};

export default AMPartsDetailList;

const style = StyleSheet.create({

})